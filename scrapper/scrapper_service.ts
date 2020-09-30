import PageModelFactory = require("./PageModelFactory");
import DataSet = require("../models/dataset/DataSet");

class ScrapperService {
  _site_metadata: object;

  constructor(site_metadata) {
    this._site_metadata = site_metadata;
  }

  call() {
    for (var [key, config] of Object.entries(this._site_metadata)) {
      const page = new PageModelFactory(config).create_page();
      let completed: boolean = false;
      const iterator = page.iterator();

      while (true) {
        const page_return = iterator.next();
        completed = !!page_return.done;
        if (completed) break;
        const data = page_return.value;
        DataSet.create(data);
      }
    }
  }
}

export = ScrapperService;
