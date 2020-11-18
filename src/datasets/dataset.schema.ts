import { Document, Schema } from 'mongoose'

export interface DatasetDto {
  name: string,
  description: string,
  organization?: {
    name: string,
    description?: string,
    image_url: string
  },
  tags: string[] | [],
  aditionalInfo?: Record<string, string>,
  resources: {
    name: string,
    description: string,
    url: string,
    type: string,
    format: string,
    created_at: number,
    updated_at: number
  }[],
  sourceUrl: string,
  unique_name: string,
  site_name: string,
  site_display_name: string,
  mongo_id?: string
}

export interface Dataset extends DatasetDto, Document {}

export const DatasetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  organization: Object,
  tags: [String],
  aditionalInfo: Schema.Types.Mixed,
  resources: {
    type: [Object],
    required: true
  },
  sourceUrl: String,
  unique_name: {
    type: String,
    unique: true,
    required: true
  },
  site_name: {
    type: String,
    required: true
  },
  site_display_name: {
    type: String,
    required: true
  }
})
