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

    await this.enter();
    while (true) {
      const nextPageBtn = await this.nextPageBtn();

      const names = await this.dataSetNames();
      for (const name of names) {
        yield name;
      }

      completed = !(await nextPageBtn.isExisting());
      if (completed) {
        await this.browser.closeWindow();
        break;
      }

      await nextPageBtn.click();
      await this.waitForLoad();
    }
  };

  async getDataset(name: string) {
    const dataset = await this.browser.$(`*=${name}`);
    await dataset.click();
    return await this._dataSetPage.getDataset();
  }

  private async enter() {
    await this.browser.url(this._baseUrl);
    await this.waitForLoad();
  }

  private async nextPageBtn() {
    return await this.browser.$(`*=»`);
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

  private async waitForLoad() {
    const rootBtn = await this.rootBtn();
    rootBtn.waitForClickable();
  }

  private async rootBtn() {
    return await this.browser.$(`//a[@href='${this._root_link_href}']`);
  }
}

module.exports = CkanListing;
