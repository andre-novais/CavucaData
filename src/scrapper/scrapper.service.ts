import { Injectable } from '@nestjs/common';
import Launcher from '@wdio/cli';
import PageModelFactory = require('./PageModelFactory');
import { log } from '../lib/dataset/log';
import { siteMetaData } from './config/site_metadata';
import { DatasetsService } from '../datasets/datasets.service';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly datasetsService: DatasetsService
  ) {}

  call() {
    const wdio = new Launcher(`./dist/scrapper/config/wdio.conf.js`, {});
    wdio.run();
  }

  async tesr() {
    this.rewq().catch((err) => null);
    return 'title';
  }

  async rewq() {
    for (const [_key, config] of Object.entries(siteMetaData)) {
      const pageModelFactory = new PageModelFactory(config);
      const page = await pageModelFactory.create_page();
      const iterator = page.listingPage.scrappe();

      for await (const name of iterator) {
        const normalizedName = name.replace(/ /gi, '_');
        const uniqueName = config.site_name + normalizedName;
        const persistedDataset = await this.datasetsService.findByUniqueName(uniqueName);
        if (!persistedDataset) {
          const dataset = await page.listingPage.getDataset(name);
          const res = await this.datasetsService.createDataset(dataset)
          log(res)
        }
      }
    }
  }
}
