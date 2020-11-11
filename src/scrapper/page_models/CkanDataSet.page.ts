/**class CkanDataSet {
  private site_name: string;
  private browser: WebdriverIO.BrowserObject;

  constructor(config: object, browser) {
    this.site_name = config['site_name'];
    this.browser = browser;
  }

  async getDataset() {
    await this.waitForLoad();

    const authBugPresent = !(await this.browser.$('.secondary').catch((err) => null));
    if (authBugPresent) {
      await this.browser.back();
      return null;
    }

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
      unique_name: this.uniqueName(name),
      site_name: this.site_name
    };

    await this.browser.back();
    return dataSet;
  }

  private async name() {
    const nameElem = await (
      await (await (await this.browser.$('div.primary')).$('<article>')).$('<div>')
    ).$('<h1>');
    const text = await nameElem.getText();
    return text.trim();
  }

  private async description() {
    const descriptionElem = await this.browser.$('.notes > p');
    const hasDescription = await descriptionElem.isExisting();
    if (!hasDescription) {
      return null;
    }

    const description = (await descriptionElem.getText()).trim();
    return description;
  }

  private async organization() {
    const organizationElem = await (
      await (await (await this.browser.$('aside.secondary')).$('div.module-narrow')).$(
        '.module-content'
      )
    ).$('.heading');

    const organization = (await organizationElem.getText()).trim();
    return organization;
  }

  private async tags() {
    const dataSetHasTagsElem = await this.browser.$('.tag-list');
    const dataSetHasTags = await dataSetHasTagsElem.isExisting();

    if (!dataSetHasTags) return null;

    const dataSetTags: string[] = [];
    const tagList = await this.browser.$('.tag-list');
    const tags = await tagList.$$('li > a');
    for (const tag of tags) {
      dataSetTags.push((await tag.getText()).trim());
    }

    return dataSetTags;
  }

  private async aditionalInfo() {
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

  private async resources() {
    const resources: object[] = [];
    const resourceListItems = await this.browser.$$('.resource-item');

    for (const item of resourceListItems) {
      const resource = await this.getResourceData(item);
      resources.push(resource);
    }

    return resources;
  }

  private async getResourceData(elem: WebdriverIO.Element) {
    const name = await this.getResourceName(elem).catch(() => null);
    const description = await this.getResourceDescription(elem).catch(() => null);
    const url = await this.getResourceUrl(elem).catch(() => null);
    const type = await this.getResourceType(elem);

    const resource = {
      name: name,
      description: description,
      url: url,
      type: type
    };

    return resource;
  }

  private async getResourceName(elem: WebdriverIO.Element) {
    const headingElem = await elem.$('.heading');
    const title = await headingElem.getAttribute('title');

    return title.trim();
  }

  private async getResourceDescription(elem: WebdriverIO.Element) {
    const descriptionElem = await elem.$('.description');
    const text = await descriptionElem.getText();

    return text.trim();
  }

  private async getResourceUrl(elem: WebdriverIO.Element) {
    const resourceUrlElem = await elem.$('.resource-url-analytics');
    const resourceUrlBugPresent = !(await resourceUrlElem.isExisting());
    if (resourceUrlBugPresent) {
      return null;
    }

    return resourceUrlElem!.getAttribute('href');
  }

  private async getResourceType(elem: WebdriverIO.Element) {
    const resourceTypeElem = await elem.$('.format-label');

    return resourceTypeElem.getAttribute('data-format');
  }

  private async groups() {
    const groupsElem = await this.browser.$("//a[contains(@href,'/dataset/groups/')]");
    await groupsElem.click();
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
    const dataSetGroups: String[] = [];
    for (const elem of dataSetGroupsChildren) {
      const group = (await elem.getText()).trim();
      dataSetGroups.push(group);
    }

    this.browser.back();
    await this.waitForLoad();
    return dataSetGroups;
  }

  private async sourceUrl() {
    return this.browser.getUrl();
  }

  private uniqueName(name: String) {
    let displayName = name.replace(/ /gi, '_');
    if (displayName.length > 77) {
      displayName = displayName.substring(0, 77) + '...';
    }

    return this.site_name + displayName;
  }

  private async waitForLoad() {
    await this.browser.waitUntil(async () => {
      if (await this.rootBtn()) {
        return true;
      } else {
        return false;
      }
    });

    const rootBtn = await this.rootBtn();
    rootBtn!.waitForClickable();
  }

  private async rootBtn() {
    return await this.browser.$("//a[contains(@href,'/dataset/groups/')]").catch((err) => null);
  }
}

export = CkanDataSet;
**/
