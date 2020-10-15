import { Controller, Get, Post } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Post()
  Scrappe() {
    this.scrapperService.call();
    return 'scrapping process initialized';
  }

  @Get()
  startScrappingService() {
    return this.scrapperService.startScrapping();
  }
}
