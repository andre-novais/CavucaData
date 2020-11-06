//async scrappe() {
//  for (const [_key, config] of Object.entries(siteMetaData)) {
//    const pageModelFactory = new PageModelFactory(config);
//    const page = await pageModelFactory.create_page();
//    const iterator = page.listingPage.scrappe();
//
//    for await (const name of iterator) {
//      const normalizedName = name.replace(/ /gi, '_');
//      const uniqueName = config.site_name + normalizedName;
//      const persistedDataset = await this.datasetsService.findByUniqueName(uniqueName);
//
//      if (!persistedDataset) {
//        this.logger.log(name)
//        this.logger.log(uniqueName)
//        const dataset = await page.listingPage.getDataset(name);
//        if (!dataset) {
//          continue
//        }
//
//        const res = await this.datasetsService.createDataset(dataset);
//        this.logger.log(res);
//      }
//    }
//  }
//}
//
//import { remote } from 'webdriverio';
//import { wdioConfig } from '../config/wdio.conf';
//interface PageModel {
//  listingPage: ListingPageModel;
//}
//
//interface ListingPageModel {
//  scrappe: Function;
//  getDataset: Function;
//}
//
//class PageModelFactory {
//  _config: object;
//  _siteType: string;
//
//  constructor(config) {
//    this._config = config;
//    this._siteType = config['site_type'];
//  }
//
//  async create_page(): Promise<PageModel> {
//    class Page implements PageModel {
//      listingPage: ListingPageModel;
//
//      constructor(listingPageModel, datasetPageModel, config, browser) {
//        this.listingPage = new listingPageModel(config, datasetPageModel, browser);
//      }
//    }
//
//    const listingPage = require(`./page_models/${this._siteType}Listing.page`);
//    const datasetPage = require(`./page_models/${this._siteType}DataSet.page`);
//
//    const browser = await remote(wdioConfig);
//    return new Page(listingPage, datasetPage, this._config, browser);
//  }
//}
//export = PageModelFactory;
//
