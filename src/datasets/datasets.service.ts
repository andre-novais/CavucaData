import { Injectable, Logger } from '@nestjs/common';
import { Dataset } from './dataset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatasetsService {
  private readonly logger = new Logger(DatasetsService.name);

  constructor(@InjectModel('datasets') private Dataset: Model<Dataset>) {}

  async listDatasets() {
    return await this.Dataset.find({}).exec()
  }

  async listFilterOptionsByCategory(category: string) {
    const query = await this.Dataset.find({}).select(category).distinct(category).exec()
    const queryElemsAreArrays = Array.isArray(query[0])
    if (queryElemsAreArrays){

      const filterOptions: string[] = []
      for (const options of query) {
        filterOptions.concat(options)
      }
      return filterOptions

    } else return query
  }

  async listDatasetsByFilter(filter: {}) {
    return await this.Dataset.find(filter).exec()
  }

  async createOrUpdateDataset(dataset: Dataset | null): Promise<Dataset | null> {
    if (!dataset) return Promise.resolve(null);

    const persistedDataset = await this.findByUniqueName(dataset.unique_name);

    if (persistedDataset) {
      return await this.updateDataset(dataset, persistedDataset);
    }
    return await this.createDataset(dataset);
  }

  async findById(id: number) {
    return await this.Dataset.findById(id).exec();
  }

  async createDataset(dataset: Dataset): Promise<Dataset> {
    return await new this.Dataset(dataset).save().catch((err) => {
      return err;
    });
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
