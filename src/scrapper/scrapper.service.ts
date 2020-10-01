import { Injectable } from '@nestjs/common';
import Launcher from '@wdio/cli';

@Injectable()
export class ScrapperService {
  call() {
    const wdio = new Launcher(`./dist/scrapper/config/wdio.conf.js`, {});
    wdio.run();
  }
}
