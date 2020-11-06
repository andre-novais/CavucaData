import { Body, Injectable, Logger } from '@nestjs/common';
import { Dataset } from './dataset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from 'elasticsearch';

@Injectable()
export class DatasetsService {
  private readonly logger = new Logger(DatasetsService.name);
  private readonly esclient = new Client({ host: process.env['ES_URL'] })



  constructor(@InjectModel('datasets') private Dataset: Model<Dataset>) {
    this.prepareEs().catch(err => this.logger.log(err))
  }

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
    //await this.indexDataset(dataset);

    return await new this.Dataset(dataset).save();
  }

  async indexDataset(dataset: Dataset) {
    const esReturn = await this.esclient.index({
      index: 'datasets',
      id: dataset.unique_name,
      body: {
        name: dataset.name,
        tags: dataset.tags,
        groups: dataset.groups,
        organization: dataset.organization,
        resourceTypes: [...new Set(dataset.resources.map(resource => resource.format))],
        site: dataset.site_name
      }
    })

    this.logger.log(esReturn)

    return esReturn
  }

  async search(searchTerms: any): Promise<any> {
    const organization = searchTerms.organization || '';
    const tags = searchTerms.tags || '';
    const groups = searchTerms.groups || '';
    const sites = searchTerms.sites || '';
    const resourceTypes = searchTerms.resourceTypes || '';

    const esResponse =  await this.esclient.search({
      index: 'datasets',
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

    this.logger.log(esResponse)
    return esResponse.hits.hits
  }

  async clearDb() {
    return await this.Dataset.deleteMany({}, (err) => {
      if (!err) {
        return true;
      }
    });
  }

  async teste2() {
    return await this.Dataset.countDocuments()
  }

  async findByUniqueName(datasetName: string): Promise<Dataset | null> {
    return await this.Dataset.findOne({
      unique_name: datasetName
    }).exec();
  }

  async prepareEs(): Promise<void>{
    //const r = await this.esclient.indices.delete({
    //  index: 'datasets'
    //})

    const esIndiceExistis = true //await this.esIndiceExistis()

    //this.logger.log(esIndiceExistis, 'esIndiceExistis')

    if(esIndiceExistis) { return }

    const esRes = await this.esclient.indices.create({
      index: 'datasets',
      body: {
        mappings: {
          properties: {
            name: {
              type: 'text',
              analyzer: 'portuguese'
            },
            tags: {
              type: 'text',
              analyzer: 'portuguese'
            },
            groups: {
              type: 'text',
              analyzer: 'portuguese'
            },
            organization: {
              type: 'text',
              analyzer: 'portuguese'
            },
            resourceTypes: {
              type: 'text',
              analyzer: 'portuguese'
            },
            site: {
              type: 'text',
              analyzer: 'portuguese'
            }
          }
        }
      }
    })

    //this.logger.log(esRes, 'esRes')

    return
  }

  async esIndiceExistis(): Promise<Boolean> {
    return await this.esclient.indices.exists({ index: 'datasets' })
  }

  private async updateDataset(dataset: Dataset, persistedDataset: Dataset): Promise<Dataset> {
    Object.keys(dataset).forEach((key, _) => {
      persistedDataset[key] = dataset[key];
    });

    return await persistedDataset.save();
  }
}
