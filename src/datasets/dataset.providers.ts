import { Connection } from 'mongoose';
import { DatasetSchema } from './dataset.schema';

export const DatasetProviders = [
  {
    provide: 'datasetModelToken',
    useFactory: async (connection: Connection) =>
      connection.model('Dataset', DatasetSchema),
    inject: ['DbConToken'],
  },
];
