class CkanDataSet {
  private site_name: string;
  private browser: WebdriverIO.BrowserObject;

  constructor(config: object, browser) {
    this.site_name = config['site_name'];
    this.browser = browser;
  }

  async getDataset() {
    await this.waitForLoad();
    const authBugPresentElem = await this.browser.$('.secondary').catch((err) => null);
    const authBugPresent = !authBugPresentElem;
    if (!authBugPresent) {
      await this.waitForLoad();
      const name = await this.name();
      const dataSet = {
        name: name,
        description: await this.description(),
        organization: await this.organization(),
        tags: await this.tags(),
        aditionalInfo: await this.aditionalInfo(),
        resources: await this.resources(),
        source_url: await this.sourceUrl(),
        groups: await this.groups(),
        unique_name: this.site_name + name,
        site_name: this.site_name
      };
      await this.browser.back();
      return dataSet;
    } else {
      await this.browser.back();
      return null;
    }
  }

  async rootBtn() {
    return await this.browser.$("//a[contains(@href,'/dataset/groups/')]").catch((err) => null);
  }

  async name() {
    const nameElem = await (
      await (await (await this.browser.$('div.primary')).$('<article>')).$('<div>')
    ).$('<h1>');
    const text = await nameElem.getText();
    return text.trim().replace(/ /gi, '_');
  }

  async description() {
    const hasDescriptionElem = await this.browser.$('.notes');
    const hasDescription = await hasDescriptionElem.isExisting();
    if (hasDescription) {
      const descriptionElem = await this.browser.$('.notes > p');
      const text = await descriptionElem.getText();
      return text.trim();
    }
    return null;
  }

  async organization() {
    const organizationElem = await (
      await (await (await this.browser.$('aside.secondary')).$('<div>')).$('.module-content')
    ).$('.heading');
    return (await organizationElem.getText()).trim();
  }

  async tags() {
    const dataSetHasTagsElem = await this.browser.$('.tag-list');
    const dataSetHasTags = await dataSetHasTagsElem.isExisting();

    if (!dataSetHasTags) return null;

    const dataSetTags: string[] = [];
    const tagsFatherElem = await this.browser.$('.tag-list');
    const tagsChildren = await tagsFatherElem.$$('li > a');
    for (const tag of tagsChildren) {
      dataSetTags.push((await tag.getText()).trim());
    }

    return dataSetTags;
  }

  async aditionalInfo() {
    const aditionalInfo = {};
    const aditionalInfoTable = await (
      await (await this.browser.$('.additional-info')).$('<table>')
    ).$('<tbody>');
    const aditionalInfoTableRows = await aditionalInfoTable.$$('tr');
    for (const row of aditionalInfoTableRows) {
      const itemNameElem = await row.$('.dataset-label');
      const itemName = (await itemNameElem.getText()).trim();
      const itemValueElem = await row.$('.dataset-details');
      const itemValue = (await itemValueElem.getText()).trim();
      aditionalInfo[itemName] = itemValue;
    }
    return aditionalInfo;
  }

  async resources() {
    const resources = {};
    let counter = 0
    const resourceListItems = await this.browser.$$('.resource-item');
    for (const item of resourceListItems) {
      const resource = await this.getResourceData(item);
      resources[`resource${++counter}`] = resource;
    }

    return resources;
  }

  async groups() {
    const groupsElem = await this.browser.$("//a[contains(@href,'/dataset/groups/')]");
    groupsElem.click();
    await this.waitForLoad();

    const dataSetHasGroups = !(await (await this.browser.$('.empty')).isExisting());
    if (!dataSetHasGroups) {
      await this.browser.back();
      await this.waitForLoad();
      return null;
    }

    const datasetGroups = await (
      await (await (await (await this.browser.$('.primary')).$('<article>')).$('<div>')).$('<form>')
    ).$('<ul>');

    const groupsBugPresent = !(await datasetGroups.isExisting());
    if (groupsBugPresent) {
      return null;
    }

    const dataSetGroupsChildren = await datasetGroups.$$('li > h3');
    const dataSetGroups: String[] = []
    for (const elem of dataSetGroupsChildren) {
      const group = (await elem.getText()).trim()
      dataSetGroups.push(group)
    }
    this.browser.back();
    await this.waitForLoad();
    return dataSetGroups;
  }

  async sourceUrl() {
    return this.browser.getUrl();
  }

  async getResourceData(elem: WebdriverIO.Element) {
    const name = await this.getResourceName(elem).catch(() => null);
    const description = await this.getResourceDescription(elem).catch(() => null);
    const url = await this.getResourceUrl(elem).catch(() => null);
    const typeMatch = url ? url.match(/\.(?!.*\.)([a-z]*)/) : null;
    const type = typeMatch ? typeMatch[0] : null;

    const resource = {
      name: name,
      description: description,
      url: url,
      type: type
    };

    return resource;
  }

  async getResourceName(elem: WebdriverIO.Element) {
    const headingElem = await elem.$('.heading');
    const title = await headingElem.getAttribute('title');

    return title.trim();
  }

  async getResourceDescription(elem: WebdriverIO.Element) {
    const descriptionElem = await elem.$('.description');
    const text = await descriptionElem.getText();

    return text.trim();
  }

  async getResourceUrl(elem: WebdriverIO.Element) {
    const resourceUrlElem = await elem.$('.resource-url-analytics');
    const resourceUrlBugPresent = !(await resourceUrlElem.isExisting());

    if (!resourceUrlBugPresent) {
      return resourceUrlElem!.getAttribute('href');
    }
    return null;
  }

  async waitForLoad() {
    await this.browser.waitUntil(async () => {
      if (await this.rootBtn()) {
        return true;
      } else {
        return false;
      }
    });
    const rootBtnElem = await this.rootBtn();
    rootBtnElem!.waitForClickable();
  }
}

module.exports = CkanDataSet;
