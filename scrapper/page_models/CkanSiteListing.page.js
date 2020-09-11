class CkanSiteListing {
  constructor() {
    this._url = "http://dados.gov.br/dataset";
    this._dataBtn = "Dados";
  }
  get DataButton() {
    return $(`*=${this._dataBtn}`);
  }
  get datasetLinks() {
    return $(".dataset-heading");
  }
  get searchBar() {
    return $("[name=query]");
  }
  get searchBtn() {
    return $(".fa-search");
  }
  get productWithVariationBtn() {
    return $(".fa-chevron-down");
  }
  get loginBtn() {
    return $("*=Entrar");
  }
  get personalizationText() {
    return $("h4=Como você prefere?");
  }

  enter() {
    console.log(this._url);
    browser.url(this._url);
    this.waitForLoad();
    let links = $$(".dataset-heading > a").map((elem) => {
      return elem.getAttribute("innerText");
    });
    return links;
  }

  search(input) {
    this.searchBar.setValue(input);
    this.searchBtn.click();
    this.waitForLoad();
  }

  waitForLoad() {
    this.DataButton.waitForClickable();
  }
}

module.exports = new CkanSiteListing();
