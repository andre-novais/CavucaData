import * as fetch from 'node-fetch'
import * as _ from 'lodash'

interface ApiScrapper {
  _config: any;
  scrappe: Function;
  getDataset: Function;
}

class CkanScrapper {
  _config: any;
  _siteType: string;
  _datasets: any[];

  constructor(config) {
    this._config = config;
    this._siteType = config['site_type'];
    this._datasets = []
  }

  scrappe = async function*(this: CkanScrapper) {
    const ROWS_PER_ITERATION = 1000

    let numRows = ROWS_PER_ITERATION
    let iterCount = 0
    while(numRows >= ROWS_PER_ITERATION) {
      const url = `${this._config.base_url}/api/3/action/package_search?rows=${ROWS_PER_ITERATION}&start=${ROWS_PER_ITERATION * (iterCount)}`

      const response = await (await fetch(url)).json()
      const datasets: any[] = response.result.results

      this._datasets = datasets
      numRows = datasets.length
      iterCount++

      for (const dataset of this._datasets) {
        yield dataset.title
      }
    }
  }

    async getDataset(title) {
      const data = this._datasets.find(dataset => dataset.title == title)

      const dataset = {
        name: data.title,
        description: data.notes,
        organization: this.getOrganization(data),
        tags: data.tags.map(tag => tag.display_name),
        groups: data.groups.map(group => {
          return {
            name: group.title,
            description: group.description,
            image_id: group.image_display_url
          }
        }),
        resources: data.resources.map(resource => {
          return {
            name: resource.name,
            description: resource.description,
            url: resource.url,
            format: resource.format,
            type: resource.resource_type,
            created_at: resource.created
          }
        }),
        source_url: `${this._config.base_url}/dataset/${data.name}`,
        unique_name: this._config.site_name + data.title.replace(/ /gi, '_'),
        aditionalInfo: this.getAditionalInfo(data),
        site_name: this._config.site_name
      }

      return dataset
    }

    getOrganization(data) {
      if(!data.organization) { return null }

      return {
        name: data.organization.title,
        description: data.organization.description,
        image_url: data.organization.image_url
      }
    }

    getAditionalInfo(data) {
      const localData = _.cloneDeep(data)

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
export = CkanScrapper;
