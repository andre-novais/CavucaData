import { Injectable, Logger } from '@nestjs/common'
import { DatasetDto } from './dataset.schema'
import { Client, SearchResponse, ShardsResponse } from 'elasticsearch'

export interface DatasetIndex {
  name: string,
  tags: string[],
  groups: string[],
  organization: string,
  resourceFormats: string[],
  site: string,
  mongo_id: string
}

interface DatasetSearchParams {
  query?: string,
  tags?: string,
  organizations?: string,
  groups?: string,
  sites?: string,
  resourceFormats?: string
}


@Injectable()
export class ElasticSearchService {
  private readonly logger = new Logger(ElasticSearchService.name)
  private readonly esclient = new Client({ host: process.env['ES_URL'] })

  async indexDataset(dataset: DatasetDto): Promise<ShardsResponse> {
    const esReturn = await this.esclient.index({
      index: 'datasets',
      id: dataset.unique_name,
      body: {
        name: dataset.name,
        tags: dataset.tags,
        groups: dataset.groups.map(group => group.name),
        organization: dataset.organization?.name,
        resourceFormats: [...new Set(dataset.resources.map(resource => resource.format))],
        site: dataset.site_name,
        mongo_id: dataset.mongo_id
      }
    })

    if (!['created', 'updated'].includes(esReturn.result)) {
      this.logger.log(esReturn, 'esReturn')
    }

    return esReturn
  }

  async search(searchTerms: DatasetSearchParams): Promise<SearchResponse<DatasetIndex>> {
    const organization = searchTerms.organizations || ''
    const tags = searchTerms.tags || ''
    const groups = searchTerms.groups || ''
    const sites = searchTerms.sites || ''
    const resourceFormats = searchTerms.resourceFormats || ''

    const esResponse =  await this.esclient.search<DatasetIndex>({
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
        { match: { resourceFormats: { query: resourceFormats } } }
      ]}}}
    })

    this.logger.log(esResponse, 'esResponse')
    return esResponse
  }

  async clearES(): Promise<void>{
    await this.esclient.indices.delete({
      index: 'datasets'
    })

    const esIndiceExistis = await this.esIndiceExistis()

    this.logger.log(esIndiceExistis, 'esIndiceExistis')

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
            resourceFormats: {
              type: 'text',
              analyzer: 'portuguese'
            },
            site: {
              type: 'text',
              analyzer: 'portuguese'
            },
            mongo_id: {
              type: 'keyword',
            }
          }
        }
      }
    })

    this.logger.log(esRes, 'esRes')

    return
  }

  async esIndiceExistis(): Promise<boolean> {
    return await this.esclient.indices.exists({ index: 'datasets' })
  }
}
