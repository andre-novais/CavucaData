import { Controller, Get, Res, Logger, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Param, ParseIntPipe, Query } from '@nestjs/common'
import { DatasetsService } from './datasets.service'
import { ElasticSearchService } from './elasticsearch.service'
import { Dataset, DatasetDto } from './dataset.schema'
import { Response } from 'express'

const Paginated = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const limit = parseInt(request.query.limit)
    const offset = parseInt(request.query.offset)

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
    return await this.datasetsService.listFilterOptionsByCategory('site_display_name')
  }

  @Get('sites/:site_display_name')
  async listDatasetsBySite(
    @Param('site_display_name') site_display_name: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
  const filter = { site_display_name }
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

  @Get('organizations')
  async listOrganizations(): Promise<string[]> {
    return await this.datasetsService.listFilterOptionsByCategory('organization')
  }

  @Get('organizations/:organization')
  async listDatasetsByOrganization(
    @Param('organization') organization: string,
    @Paginated() pagination: Pagination
): Promise<Dataset[]> {
    const filter = { 'organization.name': organization }
    return await this.datasetsService.listDatasetsByFilter({ filter, pagination })
  }

  @Get('search')
  async elasticSearch(
    @Query('q') query: string,
    @Query('tags') tags: string,
    @Query('organizations') organizations: string,
    @Query('sites') sites: string,
    @Query('formats') resourceFormats: string,
    @Paginated() pagination: Pagination
  ): Promise<DatasetDto[]> {
    this.logger.log({query})
    const searchParams = {
      query,
      tags,
      organizations,
      sites,
      resourceFormats
    }

    const esResponse = await this.elasticSearchService.search({ searchParams, pagination })
    return esResponse.hits.hits.map((esIndex: any) => esIndex._source)
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
    const filter = { 'site_display_name': 'Governo Federal'}
    const pagination: Pagination = {limit: 0, offset: 0}
    return await this.datasetsService.listDatasetsByFilter({filter, pagination} )
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
