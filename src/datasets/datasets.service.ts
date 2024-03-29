import { Injectable, Logger } from '@nestjs/common'
import { Dataset, DatasetDto } from './dataset.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ElasticSearchService } from './elasticsearch.service'
import { PaginationParams } from './datasets.controller'

enum FilterCategories {
  tags,
  organization,
  site_display_name
}
type CategoryStrings = keyof typeof FilterCategories

interface FilterParams {
  filter: Record<string, string>
}

@Injectable()
export class DatasetsService {
  private readonly logger = new Logger(DatasetsService.name)

  constructor(
    @InjectModel('datasets') private Dataset: Model<Dataset>,
    private readonly elasticSearchService: ElasticSearchService
  ) {}

  async findById(id: string): Promise<Dataset | null> {
    return await this.Dataset.findById(id).exec()
  }

  async listDatasets(params: PaginationParams): Promise<Dataset[]> {
    const limit = params.pagination.limit
    const offset = params.pagination.offset

    return await this.Dataset.find({}).skip(offset).limit(limit).exec()
  }

  async listFilterOptionsByCategory(category: CategoryStrings): Promise<string[]> {
    const query: any[] = await this.Dataset.find({}).select(category).distinct(category).exec()
    this.logger.log({query})

    const queryElemsAreArrays = Array.isArray(query[0])
    if (queryElemsAreArrays) {
      const filterOptions: string[] = []
      for (const options of query) {
        filterOptions.concat(options)
      }
      return filterOptions
    }

    const queryElemsAreObjects = typeof query[0] === 'object' && query[0] !== null
    if (queryElemsAreObjects) {
      const filterOptions = query.map(object => {
        return object.name
      })
      return filterOptions
    }

    return query
  }

  async listDatasetsByFilter(params: PaginationParams & FilterParams): Promise<Dataset[]> {
    const filter = params.filter
    const limit = params.pagination.limit
    const offset = params.pagination.offset
    this.logger.log({params})

    return await this.Dataset.find(filter).skip(offset).limit(limit).exec()
  }

  async findDownloadUrl(id: string, resource_index: number): Promise<string> {
    const dataset = await this.findById(id)
    return dataset!['resources'][resource_index].url
  }

  async createOrUpdateDataset(dataset: DatasetDto): Promise<Dataset | null> {
    if (!dataset) return Promise.resolve(null)

    const persistedDataset = await this.findByUniqueName(dataset.unique_name)

    if (persistedDataset) {
      return await this.updateDataset(dataset, persistedDataset)
    }
    return await this.createDataset(dataset)
  }

  async createDataset(dataset: DatasetDto): Promise<Dataset> {
    const savedDataset = await new this.Dataset(dataset).save()

    if (savedDataset.errors) {
      const savedDatasetErrors = savedDataset.errors
      this.logger.error({savedDatasetErrors})
      return savedDataset
    }

    dataset.mongo_id = savedDataset._id
    await this.elasticSearchService.indexDataset(dataset).catch( err => this.logger.error({err}) )

    return savedDataset
  }

  private async updateDataset(dataset: DatasetDto, persistedDataset: Dataset): Promise<Dataset> {
    return await this.Dataset.update({ _id: persistedDataset._id}, dataset).exec()
  }

  async clearDb(): Promise<void> {
    await this.elasticSearchService.clearES()

    await this.Dataset.deleteMany({}, (err) => {
      this.logger.error({err})
    })
  }

  async findByUniqueName(datasetName: string): Promise<Dataset | null> {
    return await this.Dataset.findOne({
      unique_name: datasetName
    }).exec()
  }

  async countDatasets(): Promise<number> {
    return await this.Dataset.countDocuments()
  }

  async test(): Promise<any> {
    return await this.Dataset.find({ 'organization.name': 'BELOTUR' } ).exec()
  }
}
