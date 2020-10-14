class CkanListing {
  _baseUrl: string;
  _root_link_href: string;
  _dataSetPage: any;
  browser: WebdriverIO.BrowserObject;

  constructor(config: object, DataSetPage: any, browser: any) {
    this._baseUrl = config['base_url'];
    this._root_link_href = config['root_link_href'];
    this._dataSetPage = new DataSetPage(config, browser);
    this.browser = browser;
  }

  scrappe = async function* (this: CkanListing) {
    let completed: boolean;
    //let names: string[];

    await this.enter();
    while (true) {
      const nextPageBtn = await this.nextPageBtn();
      completed = await !nextPageBtn.isExisting();
      const names = await this.dataSetNames();
      for (const name of names) {
        //const data = await this.getDataset(name);
        //yield data;
        yield name;
      }
      if (completed) break;
      nextPageBtn.click();
      await this.waitForLoad();
    }
  };

  async getDataset(name: string) {
    const dataset = await this.browser.$(`*=${name}`);
    dataset.click();
    return await this._dataSetPage.getDataset();
  }

  private async rootBtn() {
    return await this.browser.$(`//a[@href='${this._root_link_href}']`);
  }
  private async dataSetNames() {
    const names: string[] = [];
    const namesElems = await this.browser.$$('.dataset-heading > a');
    for (const nameElem of namesElems) {
      const nameText = await nameElem.getText();
      names.push(nameText);
    }
    return names;
  }

  private async nextPageBtn() {
    return this.browser.$(`*=»`);
  }

  private async enter() {
    await this.browser.url(this._baseUrl);
    await this.waitForLoad();
  }

  private async waitForLoad() {
    const rootBtn = await this.rootBtn();
    rootBtn.waitForClickable();
  }
}

module.exports = CkanListing;
