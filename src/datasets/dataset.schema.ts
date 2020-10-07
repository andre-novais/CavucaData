import { Document, Schema } from 'mongoose';

export interface Dataset extends Document {
  name: string;
  description: string;
  organization: string;
  group: string[] | [];
  tags: string[] | [];
  aditionalInfo: object | null;
  resources: {
    name: string;
    description: string;
    url: string;
    type: string;
  }[];
  sourceUrl: string;
  unique_name: string;
}

export const DatasetSchema = new Schema({
  name: String,
  description: String,
  organization: String,
  group: [String],
  tags: [String],
  aditionalInfo: Schema.Types.Mixed,
  resources: [Object],
  sourceUrl: String,
  unique_name: {
    type: String,
    unique: true,
  },
});
