import { remote } from 'webdriverio';
import { wdioConfig } from './config/wdio.conf';
interface PageModel {
  listingPage: ListingPageModel;
}

interface ListingPageModel {
  scrappe: Function;
  getDataset: Function;
}

class PageModelFactory {
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
    }

    const listingPage = require(`./page_models/${this._siteType}Listing.page`);
    const datasetPage = require(`./page_models/${this._siteType}DataSet.page`);

    const browser = await remote(wdioConfig);
    return new Page(listingPage, datasetPage, this._config, browser);
  }
}
export = PageModelFactory;
