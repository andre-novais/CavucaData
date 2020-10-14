import { Document, Schema } from 'mongoose';

export interface Dataset extends Document {
  name: string;
  description: string;
  organization: string;
  tags: string[] | [];
  aditionalInfo: object | null;
  resources: {
    name: string;
    description: string;
    url: string;
    type: string;
  }[];
  sourceUrl: string;
  groups: string[] | [];
  unique_name: string;
  site_name: String;
}

export const DatasetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organization: String,
  tags: [String],
  aditionalInfo: Schema.Types.Mixed,
  resources: {
    type: [Object],
    required: true
  },
  sourceUrl: String,
  groups: [String],
  unique_name: {
    type: String,
    unique: true,
    required: true
  },
  site_name: {
    type: String,
    required: true
  }
});
