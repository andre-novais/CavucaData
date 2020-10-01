import PageModelFactory = require('./PageModelFactory');
import { create } from '../models/dataset/DataSet';

import { siteMetaData } from './config/site_metadata';

describe('Running this to access the browser', () => {
  it('guess js is not an automation language', () => {
    for (const [_key, config] of Object.entries(siteMetaData)) {
      const page = new PageModelFactory(config).create_page();
      let completed = false;
      const iterator = page.iterator();

      while (true) {
        const page_return = iterator.next();
        completed = !!page_return.done;
        if (completed) break;
        const data = page_return.value;
        create(data);
      }
    }
  });
});
