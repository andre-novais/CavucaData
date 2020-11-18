const fetch = require('node-fetch')
import * as _ from 'lodash'
import { SiteConfig } from '../config/site_metadata'
import { DatasetDto } from '../../datasets/dataset.schema'

interface CkanDataset {
  name: string,
  title: string,
  notes: string,
  tags: {display_name: string}[],
  groups: {
    title: string,
    description: string,
    image_display_url: string
  }[],
  resources: {
    name: string,
    description: string,
    url: string,
    format: string,
    resource_type: string,
    created: string,
    last_modified: string
  }[],
  organization: {
    title: string,
    description: string,
    image_url: string
  },
  extras: Record<string, string>[]
}

type Organization = DatasetDto['organization']

class CkanScrapper {
  _config: SiteConfig
  _siteType: string
  _datasets: CkanDataset[]

  constructor(config: SiteConfig) {
    this._config = config
    this._siteType = config.site_type
    this._datasets = []
  }

  scrappe = async function*(this: CkanScrapper): AsyncGenerator<string> {
    const ROWS_PER_ITERATION = 1000

    let numRows = ROWS_PER_ITERATION
    let iterCount = 0
    while(numRows >= ROWS_PER_ITERATION) {
      const url = `${this._config.base_url}/api/3/action/package_search?rows=${ROWS_PER_ITERATION}&start=${ROWS_PER_ITERATION * (iterCount)}`

      const response = await (await fetch(url)).json()
      const datasets: CkanDataset[] = response.result.results

      this._datasets = datasets
      numRows = datasets.length
      iterCount++

      for (const dataset of this._datasets) {
        yield dataset.title
      }
    }
  }

    async getDataset(title: string): Promise<DatasetDto | null> {
      const data = this._datasets.find(dataset => dataset.title == title)
      if(!data) { return null }

      const dataset = {
        name: data.title,
        description: data.notes,
        organization: this.getOrganization(data),
        tags: this.getTags(data),
        resources: data.resources.map(resource => {
          return {
            name: resource.name,
            description: resource.description,
            url: resource.url,
            format: resource.format.toLowerCase(),
            type: resource.resource_type,
            created_at: +(new Date(resource.created)),
            updated_at: +(new Date(resource.last_modified))
          }
        }),
        sourceUrl: `${this._config.base_url}/dataset/${data.name}`,
        unique_name: this._config.site_name + data.title.replace(/ /gi, '_'),
        aditionalInfo: this.getAditionalInfo(data),
        site_name: this._config.site_name,
        site_display_name: this._config.site_display_name
      }

      return dataset
    }

    getOrganization(data: CkanDataset): Organization | undefined {
      if(!data.organization) { return undefined }

      return {
        name: data.organization.title,
        description: data.organization.description,
        image_url: this._config.image_base_url + data.organization.image_url
      }
    }

    getTags(data: CkanDataset): string[] {
      const tags = data.tags.map(tag => tag.display_name.toLowerCase())
      data.groups.forEach(group => {
        tags.push(group.title.toLowerCase())
      })

      return tags
    }

    getAditionalInfo(data: CkanDataset): Record<string, string> {
      const localData: any = _.cloneDeep(data)

      const alreadyIncludedItems: string[] = [
        'title', 'name', 'notes', 'organization', 'tags', 'groups', 'resources'
      ]
      const filteredOutItems: string[] = [
        'license_title', 'relationships_as_object', 'private', 'num_tags', 'state', 'creator_user_id',
        'type', 'license_id', 'relationships_as_subject', 'isopen', 'url', 'owner_org', 'extras',
        'license_url', 'id', 'revision_id'
      ]

      const itemsToRemove = alreadyIncludedItems.concat(filteredOutItems)

      for (const [key, value] of Object.entries(localData)) {
        if (itemsToRemove.includes(key)) {
          delete localData[key]
        }
        if (key.includes('.')) {
          delete localData[key]
          localData[key.replace(/\./gi, '')] = value
        }
      }

      if(data.extras) {
        for (const extra of data.extras) {
          if (!extra.key.includes('id')) {
            localData[extra.key.replace(/\./gi, '')] = extra.value
          }
        }
      }

      return localData
    }
}
export = CkanScrapper
