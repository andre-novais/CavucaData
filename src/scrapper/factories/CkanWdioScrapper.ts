import { remote } from 'webdriverio';
import { wdioConfig } from '../config/wdio.conf';
import listingPage from '../page_models/CkanListing.page'
import datasetPage from '../page_models/CkanDataSet.page'

interface PageModel {
  listingPage: ListingPageModel;
  scrappe: Function;
  getDataset: Function;
}

interface ListingPageModel {
  scrappe: Function;
  getDataset: Function;
}

class CkanWdioScrapper {
  _config: object;
  _siteType: string;

  constructor(config) {
    this._config = config;
    this._siteType = config['site_type'];
  }

  async create_page(): Promise<PageModel> {
    class Page implements PageModel {
      listingPage: ListingPageModel;

      constructor(listingPageModel, datasetPageModel, config, browser) {
        this.listingPage = new listingPageModel(config, datasetPageModel, browser);
      }

      scrappe() {
        return this.listingPage.scrappe()
      }

      async getDataset() {
        return await this.listingPage.getDataset()
      }
    }

    const browser = await remote(wdioConfig);
    return new Page(listingPage, datasetPage, this._config, browser);
  }
}
export = CkanWdioScrapper;
