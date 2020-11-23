import { Injectable, Logger } from '@nestjs/common'
import { DatasetDto } from './dataset.schema'
import { Client, SearchResponse, ShardsResponse } from 'elasticsearch'
import { PaginationParams } from './datasets.controller'
//import { _ } from 'lodash'

interface DatasetSearchParams {
  searchParams: {
    query?: string,
    tags?: string,
    organizations?: string,
    sites?: string,
    resourceFormats?: string
  }
}


@Injectable()
export class ElasticSearchService {
  private readonly logger = new Logger(ElasticSearchService.name)
  private readonly esclient = new Client({ host: process.env['ES_URL'] })

  async indexDataset(dataset: DatasetDto): Promise<ShardsResponse> {
    const esReturn = await this.esclient.index({
      index: 'datasets',
      id: dataset.unique_name,
      body: this.filterDataset(dataset)
    })

    if (!['created', 'updated'].includes(esReturn.result)) {
      this.logger.error({esReturn})
    }

    return esReturn
  }

  filterDataset(dataset: DatasetDto): any {
    delete dataset.organization?.description
    return dataset
  }

  async search(params: DatasetSearchParams & PaginationParams): Promise<SearchResponse<any>> {
    const query = params.searchParams.query || ''
    const organization = params.searchParams.organizations || ''
    const tags = params.searchParams.tags || ''
    const sites = params.searchParams.sites || ''
    const resourceFormats = params.searchParams.resourceFormats || ''
    this.logger.log(params.searchParams.query, 'params.searchParams.query')

    const esResponse =  await this.esclient.search<any>({
      index: 'datasets',
      body: { query: { bool: { should: [
        {
          simple_query_string: {
            query: query,
            all_fields: true
          }
        },
        { match: { organization: { query: organization } } },
        { match: { tags: { query: tags } } },
        { match: { site_name: { query: sites } } },
        { match: { "resources.format": { query: resourceFormats } } }
      ]}}},
      size: params.pagination.limit,
      from: params.pagination.offset
    })

    return esResponse
  }

  async clearES(): Promise<void>{
    await this.esclient.indices.delete({
      index: 'datasets'
    }).catch(err => this.logger.error(err))

    const esIndiceExistis = await this.esIndiceExistis()

    this.logger.log({esIndiceExistis})

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
            description: {
              type: 'keyword'
            },
            organization: {
              properties: {
                name: {
                  type: 'text',
                  analyzer: 'portuguese'
                },
                image_url: { type: 'keyword' }
              }
            },
            tags: {
              type: 'text',
              analyzer: 'portuguese'
            },
            aditionalInfo: {
              type: 'object',
              enabled: false
            },
            resources: {
              properties: {
                name: {
                  type: 'text',
                  analyzer: 'portuguese'
                },
                description: { type: 'keyword' },
                url: { type: 'keyword' },
                type: { type: 'keyword' },
                format: { type: 'text' },
                created_at: { type: 'long' },
                updated_at: { type: 'long' }
              }
            },
            sourceUrl: { type: 'keyword' },
            site_name: { type: 'keyword' },
            site_display_name: {
              type: 'text',
              analyzer: 'portuguese'
            },
            mongo_id: { type: 'keyword' }
          }
        }
      }
    })

    this.logger.log({esRes})

    return
  }

  async esIndiceExistis(): Promise<boolean> {
    return await this.esclient.indices.exists({ index: 'datasets' })
  }
}
