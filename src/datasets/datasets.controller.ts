import { Controller, Get } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { Param, ParseIntPipe, Logger } from '@nestjs/common';
import { filter } from 'lodash';

@Controller('datasets')
export class DatasetsController {
  private readonly logger = new Logger(DatasetsController.name);
  private readonly CATEGORIES: object = {
    'SITE': 'site_name',
    'GROUP': 'groups',
    'ORGANIZATION': 'organization',
    'TAG': 'tags'
  }

  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  async listDatasets() {
    return await this.datasetsService.listDatasets()
  }

  @Get('sites')
  async listSites() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['SITE'])
  }

  @Get('sites/:site_name')
  async listDatasetsBySite(@Param('site_name') site_name: string) {
    const category = this.CATEGORIES['SITE']
    const filter = {}
    filter[category] = site_name
    return await this.datasetsService.listDatasetsByFilter(filter)
  }

  @Get('tags')
  async listTags() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['TAG'])
  }

  @Get('tags/:tag')
  async listDatasetsByTag(@Param('tag') tag: string) {
    const category = this.CATEGORIES['TAG']
    const filter = {}
    filter[category] = tag
    return await this.datasetsService.listDatasetsByFilter(filter)
  }

  @Get('groups')
  async listGroups() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['GROUP'])
  }

  @Get('groups/:group')
  async listDatasetsByGroup(@Param('group') group: string) {
    const category = this.CATEGORIES['GROUP']
    const filter = {}
    filter[category] = group
    return await this.datasetsService.listDatasetsByFilter(filter)
  }

  @Get('organizations')
  async listOrganizations() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['ORGANIZATION'])
  }

  @Get('organizations/:organization')
  async listDatasetsByOrganization(@Param('organization') organization: string) {
    const category = this.CATEGORIES['ORGANIZATION']
    const filter = {}
    filter[category] = organization
    return await this.datasetsService.listDatasetsByFilter(filter)
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.datasetsService.findById(id);
  }
}
