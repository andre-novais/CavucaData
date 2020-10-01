class CkanDataSet {
  _root_link_href: string;
  _groupsBtn: string;

  constructor(config: object) {
    this._root_link_href = config['root_link_href'];
    this._groupsBtn = config['groupsBtn'];
  }

  get rootBtn() {
    return $(`//a[@href='${this._root_link_href}']`);
  }

  get name() {
    return $('.primary')
      .$('<article>')
      .$('<div>')
      .$('<h1>')
      .getAttribute('innerText')
      .trim();
  }

  get description() {
    const hasDescription = $('.notes').isExisting();
    if (hasDescription) {
      return $('.notes')
        .$('p')
        .getAttribute('innerText')
        .trim();
    }
    return null;
  }

  get organization() {
    return $('aside.secondary')
      .$('<div>')
      .$('.module-content')
      .$('.heading')
      .getAttribute('innerText')
      .trim();
  }

  get groups() {
    $("//a[contains(@href,'/dataset/groups/')]").click();
    this.waitForLoad();

    const dataSetHasGroups = !$('.empty').isExisting();
    const groupsBugPresent = !$('.primary')
      .$('<article>')
      .$('<div>')
      .$('<form>')
      .isExisting();

    if (!groupsBugPresent && dataSetHasGroups) {
      let dataSetGroups = $('.primary')
        .$('<article>')
        .$('<div>')
        .$('<form>')
        .$('<ul>')
        .$$('li > h3')
        .map(elem => elem.getAttribute('innerText').trim());
      browser.back();
      this.waitForLoad();
      return dataSetGroups;
    } else if (!dataSetHasGroups) {
      browser.back();
      this.waitForLoad();
      return null;
    } else {
      return null;
    }
  }

  get tags() {
    const dataSetHasTags = $('.tag-list').isExisting();
    if (!dataSetHasTags) return null;
    let dataSetTags: string[] = [];
    $('.tag-list')
      .$$('li > a')
      .forEach(elem => {
        dataSetTags.push(elem.getAttribute('innerText').trim());
      });
    return dataSetTags;
  }

  get aditionalInfo() {
    let aditionalInfo = {};
    $('.additional-info > table > tbody')
      .$$('tr')
      .forEach(elem => {
        const itemName = elem
          .$('.dataset-label')
          .getAttribute('innerText')
          .trim();
        const itemValue = elem
          .$('.dataset-details')
          .getAttribute('innerText')
          .trim();
        aditionalInfo[itemName] = itemValue;
      });
    return aditionalInfo;
  }

  get resources() {
    let resources = {};
    $('.resources')
      .$('.resource-list')
      .$$('.resource-item')
      .forEach(elem => {
        let resource = this.getResourceData(elem);
        resources[resource.name] = resource;
      });
    return resources;
  }

  get sourceUrl() {
    return browser.getUrl();
  }

  getResourceName(elem: WebdriverIO.Element) {
    return elem
      .$('.heading')
      .getAttribute('title')
      .trim();
  }

  getResourceDescription(elem: WebdriverIO.Element) {
    return elem
      .$('.description')
      .getAttribute('innerText')
      .trim();
  }

  getResourceUrl(elem: WebdriverIO.Element) {
    const resourceUrlBugPresent = !elem
      .$('.dropdown')
      .$('.dropdown-menu')
      .$('li > .resource-url-analytics')
      .isExisting();
    if (!resourceUrlBugPresent) {
      return elem
        .$('.dropdown')
        .$('.dropdown-menu')
        .$('li > .resource-url-analytics')
        .getAttribute('href');
    }
    return null;
  }

  waitForLoad() {
    this.rootBtn.waitForClickable();
  }

  getResourceData(elem: WebdriverIO.Element) {
    let name = this.getResourceName(elem);
    let description = this.getResourceDescription(elem);
    let url = this.getResourceUrl(elem);
    let typeMatch = url ? url.match(/\.(?!.*\.)([a-z]*)/) : null;
    let type = typeMatch ? typeMatch[0] : null;
    let resource = {
      name: name,
      description: description,
      url: url,
      type: type,
    };
    return resource;
  }

  getDataSet() {
    const authBugPresent = !$('.secondary').isExisting();
    if (!authBugPresent) {
      this.waitForLoad();
      let dataSet = {
        name: this.name,
        description: this.description,
        organization: this.organization,
        group: this.groups,
        tags: this.tags,
        aditionalInfo: this.aditionalInfo,
        resources: this.resources,
        source_url: this.sourceUrl,
      };
      browser.back();
      return dataSet;
    } else {
      browser.back();
      return null;
    }
  }
}

module.exports = CkanDataSet;
