import { Injectable, Logger } from '@nestjs/common';
import { Dataset } from './dataset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from 'elasticsearch';

@Injectable()
export class DatasetsService {
  private readonly logger = new Logger(DatasetsService.name);
  private readonly esclient = new Client({ host: process.env['ES_URL'] })

  constructor(@InjectModel('datasets') private Dataset: Model<Dataset>) {}

  async listDatasets() {
    return await this.Dataset.find({}).exec();
  }

  async listFilterOptionsByCategory(category: string) {
    const query = await this.Dataset.find({}).select(category).distinct(category).exec();
    const queryElemsAreArrays = Array.isArray(query[0]);
    if (queryElemsAreArrays) {
      const filterOptions: string[] = [];
      for (const options of query) {
        filterOptions.concat(options);
      }
      return filterOptions;
    } else return query;
  }

  async listDatasetsByFilter(filter: {}) {
    return await this.Dataset.find(filter).exec();
  }

  async findDownloadUrl(id: string, resource_index: number) {
    const dataset = await this.findById(id);
    return dataset!['resources'][resource_index].url;
  }

  async createOrUpdateDataset(dataset: Dataset | null): Promise<Dataset | null> {
    if (!dataset) return Promise.resolve(null);

    const persistedDataset = await this.findByUniqueName(dataset.unique_name);

    if (persistedDataset) {
      return await this.updateDataset(dataset, persistedDataset);
    }
    return await this.createDataset(dataset);
  }

  async findById(id: string) {
    return await this.Dataset.findById(id).exec();
  }

  async createDataset(dataset: Dataset | any): Promise<Dataset> {
    await this.indexDataset(dataset);

    return await new this.Dataset(dataset).save().catch((err) => {
      return err;
    });
  }

  async indexDataset(dataset: Dataset) {
    return await this.esclient.index({
      index: 'datasets',
      type: 'dataset',
      id: dataset.unique_name,
      body: {
        name: dataset.name,
        tags: dataset.tags,
        groups: dataset.groups,
        organization: dataset.organization,
        resourceTypes: dataset.resources.map(resource => resource.type),
        site: dataset.site_name,
        unique_name: dataset.unique_name
      }
    })
  }

  async search(searchTerms: any): Promise<any> {
    const organization = searchTerms.organization || '';
    const tags = searchTerms.tags || '';
    const groups = searchTerms.groups || '';
    const sites = searchTerms.sites || '';
    const resourceTypes = searchTerms.resourceTypes || '';

    const esResponse =  await this.esclient.search({
      index: 'datasets',
      type:'dataset',
      body: { query: { bool: { should: [
        {
          simple_query_string: {
            query: searchTerms.query,
            all_fields: true
          }
        },
        { match: { organization: { query: organization } } },
        { match: { tags: { query: tags } } },
        { match: { groups: { query: groups } } },
        { match: { site_name: { query: sites } } },
        { match: { resourceTypes: { query: resourceTypes } } }
      ]}}}
    })

    return esResponse.hits.hits
  }

  async clearDb() {
    return await this.Dataset.deleteMany({}, (err) => {
      if (!err) {
        return true;
      }
    });
  }

  async findByUniqueName(datasetName: string): Promise<Dataset | null> {
    return await this.Dataset.findOne({
      unique_name: datasetName
    }).exec();
  }

  private async updateDataset(dataset: Dataset, persistedDataset: Dataset): Promise<Dataset> {
    Object.keys(dataset).forEach((key, _) => {
      persistedDataset[key] = dataset[key];
    });

    return await persistedDataset.save();
  }
}
