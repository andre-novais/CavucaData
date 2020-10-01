interface PageModel {
  iterator: Function;
}

interface ListingPageModel {
  scrappe: Function;
}

class PageModelFactory {
  _config: object;
  _siteType: string;

  constructor(config) {
    this._config = config;
    this._siteType = config['site_type'];
  }

  create_page(): PageModel {
    class Page implements PageModel {
      _listingPage: ListingPageModel;

      constructor(listingPageModel, datasetPageModel, config) {
        this._listingPage = new listingPageModel(config, datasetPageModel);
      }

      iterator = function*(this: Page) {
        const iterator = this._listingPage.scrappe();
        let completed = false;

        while (true) {
          const page_return = iterator.next();
          completed = !!page_return.done;
          if (completed) break;
          yield page_return.value;
        }
      };
    }

    const listingPage = require(`./page_models/${this._siteType}Listing.page`);
    const datasetPage = require(`./page_models/${this._siteType}DataSet.page`);

    return new Page(listingPage, datasetPage, this._config);
  }
}
export = PageModelFactory;
