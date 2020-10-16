import { Controller, Get } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { Param, ParseIntPipe } from '@nestjs/common';
import { get } from 'lodash';

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  async listDatasets() {
    return await this.datasetsService.listDatasets()
  }

  @Get('sites')
  async listSites() {
    return await this.datasetsService.listFilterOptionsByCategory('site_name')
  }

  @Get('sites/:site_name')
  async listDatasetsBySite(@Param('site_name') site_name: string) {
    return await this.datasetsService.listDatasetsByFilter({'site_name': site_name})
  }

  @Get('tags')
  async listTags() {
    return await this.datasetsService.listTags()
  }

  @Get('tags')
  async listDatasetsByTags() {
    return await this.datasetsService.listDatasetsByTags()
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.datasetsService.findById(id);
  }
}
