import { Controller, Get, Res } from '@nestjs/common'
import { DatasetsService } from './datasets.service'
import { ElasticSearchService, DatasetIndex } from './elasticsearch.service'
import { Dataset } from './dataset.schema'
import { Param, ParseIntPipe, Query } from '@nestjs/common'
import { Response } from 'express'

@Controller('datasets')
export class DatasetsController {
  //private readonly logger = new Logger(DatasetsController.name);

  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly elasticSearchService: ElasticSearchService
    ) {}

  @Get()
  async listDatasets(): Promise<Dataset[]> {
    return await this.datasetsService.listDatasets()
  }

  @Get('sites')
  async listSites(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('site_name')
  }

  @Get('sites/:site_name')
  async listDatasetsBySite(@Param('site_name') site_name: string): Promise<Dataset[]> {
    return await this.datasetsService.listDatasetsByFilter({site_name})
  }

  @Get('tags')
  async listTags(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('tags')
  }

  @Get('tags/:tag')
  async listDatasetsByTag(@Param('tag') tag: string): Promise<Dataset[]> {
    return await this.datasetsService.listDatasetsByFilter({ 'tags': tag })
  }

  @Get('groups')
  async listGroups(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('groups')
  }

  @Get('groups/:group')
  async listDatasetsByGroup(@Param('group') group: string): Promise<Dataset[]> {
    return await this.datasetsService.listDatasetsByFilter({ 'groups': group })
  }

  @Get('organizations')
  async listOrganizations(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('organization')
  }

  @Get('organizations/:organization')
  async listDatasetsByOrganization(@Param('organization') organization: string): Promise<Dataset[]> {
    return await this.datasetsService.listDatasetsByFilter({organization})
  }

  @Get('search')
  async elasticSearch(
    @Query('q') query: string,
    @Query('tags') tags: string,
    @Query('organizations') organizations: string,
    @Query('groups') groups: string,
    @Query('sites') sites: string,
    @Query('resourceFormats') resourceFormats: string
  ): Promise<DatasetIndex[]> {
    const searchTerms = {
      query,
      tags,
      organizations,
      groups,
      sites,
      resourceFormats
    }
    const esResponse = await this.elasticSearchService.search(searchTerms)
    return esResponse.hits.hits.map(esIndex => esIndex._source)
  }

  @Get('clearDb')
  async clear(): Promise<void> {
    await this.datasetsService.clearDb()
  }

  @Get('count')
  async countDatasets(): Promise<number> {
    return await this.datasetsService.countDatasets()
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Dataset | null> {
    return await this.datasetsService.findById(id)
  }

  @Get(':id/:resource_index/download')
  async download(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('resource_index', ParseIntPipe) resource_index: number
  ): Promise<void> {
    const url = await this.datasetsService.findDownloadUrl(id, resource_index)
    res.redirect(url)
  }
}
