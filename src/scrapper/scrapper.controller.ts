import { Controller, Post } from '@nestjs/common'
import { ScrapperService } from './scrapper.service'

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Post()
  Scrappe(): string {
    this.scrapperService.startScrapping()
    return 'scrapping process initialized'
  }
}
