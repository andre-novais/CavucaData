/**interface ApiScrapper {
  scrappe: Function,
  getDataset: Function
}

class CkanWdioScrapper {
  _config: any

  constructor(config) {
    this._config = config
  }

  async create_page(): Promise<ApiScrapper> {
    return new this._config.site_type(this._config)
  }
}
export = CkanWdioScrapper
**/
