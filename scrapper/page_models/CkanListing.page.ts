class CkanListing {
  _baseUrl: string;
  _root_link_href: string;
  _dataSetPage: any;

  constructor(config: object, DataSetPage: any) {
    this._baseUrl = config["base_url"];
    this._root_link_href = config["root_link_href"];
    this._dataSetPage = new DataSetPage(config);
  }
  get rootBtn() {
    return $(`//a[@href='${this._root_link_href}']`);
  }
  get dataSetLinks() {
    let links: string[] = [];
    $$(".dataset-heading > a").forEach((elem) => {
      links.push(elem.getAttribute("innerText"));
    });
    return links;
  }

  get nextPageBtn() {
    return $(`*=»`);
  }

  enter() {
    browser.url(this._baseUrl);
    this.waitForLoad();
  }

  getDataSet(link: string) {
    $(`*=${link}`).click();
    return this._dataSetPage.getDataSet();
  }

  waitForLoad() {
    this.rootBtn.waitForClickable();
  }

  scrappe = function* (this: CkanListing) {
    let completed: boolean;
    let links: string[];
    this.enter();

    while (true) {
      completed = !this.nextPageBtn.isExisting();
      links = this.dataSetLinks;
      for (let link of links) {
        yield this.getDataSet(link);
      }
      if (completed) break;
      this.nextPageBtn.click();
    }
  };
}

module.exports = CkanListing;
