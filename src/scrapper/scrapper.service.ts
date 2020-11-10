import { Injectable, Logger } from '@nestjs/common'
//import { log } from '../lib/dataset/log'
import { siteMetaData } from './config/site_metadata'
import { DatasetsService } from '../datasets/datasets.service'

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(DatasetsService.name)

  constructor(private readonly datasetsService: DatasetsService) {}

  startScrapping(): string {
    return 'scrapping process started'
    this.scrappe().catch((err) => err)
  }

  async scrappe(): Promise<void> {
    for (const [_key, config] of Object.entries(siteMetaData)) {
      const page = new config.site_type(config)
      //const page = await pageModelFactory.create_page();
      const iterator = page.scrappe()

      let newDatasetCounter = 0
      let errorsCounter = 0
      for await (const name of iterator) {
        const normalizedName = name.replace(/ /gi, '_')
        const uniqueName = config.site_name + normalizedName
        const persistedDataset = await this.datasetsService.findByUniqueName(uniqueName)
        if (!persistedDataset) {
          const dataset = await page.getDataset(name).catch(err => {
            this.logger.error({err, name})
            errorsCounter++
          })
          if (!dataset) {
            continue
          }
          const res = await this.datasetsService.createDataset(dataset).catch(err => {
            this.logger.error({err, dataset})
            errorsCounter++
          })

          if (res) { newDatasetCounter++ }
        }
      }

      this.logger.log(`scrapped ${config.site_name}, saved ${newDatasetCounter} new datasets and got ${errorsCounter} errors`)
    }
  }
}
