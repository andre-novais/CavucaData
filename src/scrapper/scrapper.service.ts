import { Injectable, Logger } from '@nestjs/common';
import Launcher from '@wdio/cli';
import PageModelFactory = require('./PageModelFactory');
import { log } from '../lib/dataset/log';
import { siteMetaData } from './config/site_metadata';
import { DatasetsService } from '../datasets/datasets.service';

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(DatasetsService.name);

  constructor(private readonly datasetsService: DatasetsService) {}

  call() {
    const wdio = new Launcher(`./dist/scrapper/config/wdio.conf.js`, {});
    wdio.run();
  }

  async startScrapping() {
    this.scrappe().catch((err) => null);
    return 'scrapping process started';
  }

  async scrappe() {
    for (const [_key, config] of Object.entries(siteMetaData)) {
      const pageModelFactory = new PageModelFactory(config);
      const page = await pageModelFactory.create_page();
      const iterator = page.listingPage.scrappe();

      for await (const name of iterator) {
        const normalizedName = name.replace(/ /gi, '_');
        const uniqueName = config.site_name + normalizedName;
        const persistedDataset = await this.datasetsService.findByUniqueName(uniqueName);

        if (!persistedDataset) {
          this.logger.log(name)
          this.logger.log(uniqueName)
          const dataset = await page.listingPage.getDataset(name);
          if (!dataset) {
            continue
          }

          const res = await this.datasetsService.createDataset(dataset);
          this.logger.log(res);
        }
      }
    }
  }
}
