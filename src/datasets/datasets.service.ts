import { Injectable } from '@nestjs/common';
import { Dataset } from './dataset.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatasetsService {
  constructor(@InjectModel('datasets') private Dataset: Model<Dataset>) {}

  createOrUpdateDataset(dataset: Dataset | null): Promise<Dataset | null> {
    if (!dataset) return Promise.resolve(null);
    let datasetPromise = this.findByUniqueName(dataset.unique_name);

    return datasetPromise.then(persistedDataset => {
      if (persistedDataset) {
        return this.updateDataset(dataset, persistedDataset);
      }
      return this.createDataset(dataset);
    });
  }

  findById(id: number) {
    return this.Dataset.findById(id).exec();
  }

  clearDb() {
    return this.Dataset.deleteMany({}, err => {
      if (!err) {
        return true;
      }
    });
  }

  private findByUniqueName(datasetName: string): Promise<Dataset | null> {
    return this.Dataset.findOne({
      unique_name: datasetName,
    }).exec();
  }

  private updateDataset(
    dataset: Dataset,
    persistedDataset: Dataset,
  ): Promise<Dataset> {
    Object.keys(dataset).forEach((key, _) => {
      persistedDataset[key] = dataset[key];
    });

    return persistedDataset.save();
  }

  private createDataset(dataset: Dataset): Promise<Dataset> {
    return new this.Dataset(dataset).save();
  }
}
