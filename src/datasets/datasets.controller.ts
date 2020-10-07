import { Controller, Get } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { Param, ParseIntPipe } from '@nestjs/common';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.datasetsService.findById(id);
  }
}
