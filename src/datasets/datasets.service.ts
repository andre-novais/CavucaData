import { Injectable } from '@nestjs/common';
import { Dataset } from './dataset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel('datasets') private Dataset: Model<Dataset>) {}

  async createOrUpdateDataset(dataset: Dataset | null): Promise<Dataset | null> {
    if (!dataset) return Promise.resolve(null);

    const persistedDataset = await this.findByUniqueName(dataset.unique_name);

    if (persistedDataset) {
      return this.updateDataset(dataset, persistedDataset);
    }
    return await this.createDataset(dataset);
  }

  findById(id: number) {
    return this.Dataset.findById(id).exec();
  }

  createDataset(dataset: Dataset): Promise<Dataset> {
    return new this.Dataset(dataset)
      .save()
      .then((data) => data)
      .catch((err) => {
        return err;
      });
  }

  clearDb() {
    return this.Dataset.deleteMany({}, (err) => {
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

  private updateDataset(dataset: Dataset, persistedDataset: Dataset): Promise<Dataset> {
    Object.keys(dataset).forEach((key, _) => {
      persistedDataset[key] = dataset[key];
    });

    return persistedDataset.save();
  }
}
