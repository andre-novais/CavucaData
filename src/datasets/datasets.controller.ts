import { Controller, Get, Res, Logger, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Param, ParseIntPipe, Body } from '@nestjs/common'
import { DatasetsService } from './datasets.service'
import { ElasticSearchService } from './elasticsearch.service'
import { Dataset, DatasetDto } from './dataset.schema'
import { Response } from 'express'

const Paginated = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const limit = request.body.limit
    const offset = request.body.offset

    return { limit, offset }
  }
)

export interface PaginationParams {
  pagination: {
    limit: number,
    offset: number
  }
}

type Pagination = PaginationParams['pagination']

@Controller('datasets')
export class DatasetsController {
  private readonly logger = new Logger(DatasetsController.name)

  constructor(
    private readonly datasetsService: DatasetsService,
    private readonly elasticSearchService: ElasticSearchService
    ) {}

  @Get()
  async listDatasets(
    @Paginated() pagination: Pagination
  ): Promise<Dataset[]> {
    return await this.datasetsService.listDatasets({ pagination })
  }

  @Get('sites')
  async listSites(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('site_name')
  }

  @Get('sites/:site_name')
  async listDatasetsBySite(
    @Param('site_name') site_name: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
  const filter = { site_name }
    return await this.datasetsService.listDatasetsByFilter({ filter, pagination })
  }

  @Get('tags')
  async listTags(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('tags')
  }

  @Get('tags/:tag')
  async listDatasetsByTag(
    @Param('tag') tag: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
  const filter = { 'tags': tag }
    return await this.datasetsService.listDatasetsByFilter({ filter, pagination })
  }

  @Get('groups')
  async listGroups(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('groups')
  }

  @Get('groups/:group')
  async listDatasetsByGroup(
    @Param('group') group: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
  const filter = { 'groups': group }
    return await this.datasetsService.listDatasetsByFilter({ filter, pagination })
  }

  @Get('organizations')
  async listOrganizations(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('organization')
  }

  @Get('organizations/:organization')
  async listDatasetsByOrganization(
    @Param('organization') organization: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
    const filter = { organization }
    return await this.datasetsService.listDatasetsByFilter({ filter, pagination })
  }

  @Get('search')
  async elasticSearch(
    @Body('q') query: string,
    @Body('tags') tags: string,
    @Body('organizations') organizations: string,
    @Body('groups') groups: string,
    @Body('sites') sites: string,
    @Body('formats') resourceFormats: string,
    @Paginated() pagination: Pagination
  ): Promise<DatasetDto[]> {
    this.logger.log({query})
    const searchParams = {
      query,
      tags,
      organizations,
      groups,
      sites,
      resourceFormats
    }

    const esResponse = await this.elasticSearchService.search({ searchParams, pagination })
    return esResponse.hits.hits.map(esIndex => esIndex._source)
  }

  @Get('clearDb')
  async clear(): Promise<void> {
    await this.datasetsService.clearDb()
    this.logger.log('db and es cleared')
  }

  @Get('count')
  async countDatasets(): Promise<number> {
    return await this.datasetsService.countDatasets()
  }

  @Get('test')
  async test(): Promise<any> {
    return await this.datasetsService.test()
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
