import { Controller, Get, Res } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { Param, ParseIntPipe, Logger, Query } from '@nestjs/common';

@Controller('datasets')
export class DatasetsController {
  private readonly logger = new Logger(DatasetsController.name);
  private readonly CATEGORIES: object = {
    SITE: 'site_name',
    GROUP: 'groups',
    ORGANIZATION: 'organization',
    TAG: 'tags'
  };

  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  async listDatasets() {
    return await this.datasetsService.listDatasets();
  }

  @Get('sites')
  async listSites() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['SITE']);
  }

  @Get('sites/:site_name')
  async listDatasetsBySite(@Param('site_name') site_name: string) {
    const category = this.CATEGORIES['SITE'];
    const filter = {};
    filter[category] = site_name;

    return await this.datasetsService.listDatasetsByFilter(filter);
  }

  @Get('tags')
  async listTags() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['TAG']);
  }

  @Get('tags/:tag')
  async listDatasetsByTag(@Param('tag') tag: string) {
    const category = this.CATEGORIES['TAG'];
    const filter = {};
    filter[category] = tag;

    return await this.datasetsService.listDatasetsByFilter(filter);
  }

  @Get('groups')
  async listGroups() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['GROUP']);
  }

  @Get('groups/:group')
  async listDatasetsByGroup(@Param('group') group: string) {
    const category = this.CATEGORIES['GROUP'];
    const filter = {};
    filter[category] = group;

    return await this.datasetsService.listDatasetsByFilter(filter);
  }

  @Get('organizations')
  async listOrganizations() {
    return await this.datasetsService.listFilterOptionsByCategory(this.CATEGORIES['ORGANIZATION']);
  }

  @Get('organizations/:organization')
  async listDatasetsByOrganization(@Param('organization') organization: string) {
    const category = this.CATEGORIES['ORGANIZATION'];
    const filter = {};
    filter[category] = organization;

    return await this.datasetsService.listDatasetsByFilter(filter);
  }

  @Get('search')
  async elasticSearch(
    @Query('q') query,
    @Query('tags') tags,
    @Query('organizations') organizations,
    @Query('groups') groups,
    @Query('sites') sites,
    @Query('resourceTypes') resourceTypes
  ) {
    const searchTerms = {
      query: query,
      tags: tags,
      organizations: organizations,
      groups: groups,
      sites: sites,
      resourceTypes: resourceTypes
    }
    return await this.datasetsService.search(searchTerms);
  }

  @Get('clearDb')
  async clear() {
    await this.datasetsService.clearDb()
  }

  @Get('test')
  async test() {
    return await this.datasetsService.createDataset({"tags":["Cultura","Incentivo","Incentivo à Cultura","Projetos Culturais","Pronac","SALIC","SEFIC"],"resources":[{"name":"Documentação da API","description":"","url":"http://api.salic.cultura.gov.br/doc/","type":"html"},{"name":"Projetos em formato JSON","description":"Fornece uma lista das informações relacionadas aos projetos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos?format=json","type":"json"},{"name":"Propostas em formato JSON","description":"Fornece uma lista das informações relacionadas às propostas culturais...","url":"http://api.salic.cultura.gov.br/v1/propostas?format=json","type":"json"},{"name":"Proponentes em formato JSON","description":"Fornece uma lista das informações relacionadas aos proponentes cadastrados no...","url":"http://api.salic.cultura.gov.br/v1/proponentes?format=json","type":"json"},{"name":"Incentivadores em formato JSON","description":"Fornece uma lista das informações relacionadas aos incentivadores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/incentivadores?format=json","type":"json"},{"name":"Fornecedores em formato JSON","description":"Fornece uma lista das informações relacionadas aos fornecedores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/fornecedores?format=json","type":"json"},{"name":"Áreas de atuação em formato JSON","description":"Fornece uma lista das informações relacionadas às áreas de atuação dos...","url":"http://api.salic.cultura.gov.br/v1/projetos/areas?format=json","type":"json"},{"name":"Segmentos Culturais em formato JSON","description":"Fornece uma lista das informações relacionadas aos segmentos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos/segmentos?format=json","type":"json"},{"name":"Projetos em formato XML","description":"Fornece uma lista das informações relacionadas aos projetos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos?format=xml","type":"xml"},{"name":"Propostas em formato XML","description":"Fornece uma lista das informações relacionadas às propostas culturais...","url":"http://api.salic.cultura.gov.br/v1/propostas?format=xml","type":"xml"},{"name":"Proponentes em formato XML","description":"Fornece uma lista das informações relacionadas aos proponentes cadastrados no...","url":"http://api.salic.cultura.gov.br/v1/proponentes?format=xml","type":"xml"},{"name":"Incentivadores em formato XML","description":"Fornece uma lista das informações relacionadas aos incentivadores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/incentivadores?format=xml","type":"xml"},{"name":"Fornecedores em formato JSON","description":"Fornece uma lista das informações relacionadas aos fornecedores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/fornecedores?format=xml","type":"xml"},{"name":"Áreas de atuação em formato XML","description":"Fornece uma lista das informações relacionadas às áreas de atuação dos...","url":"http://api.salic.cultura.gov.br/v1/projetos/areas?format=xml","type":"xml"},{"name":"Segmentos Culturais em formato XML","description":"Fornece uma lista das informações relacionadas aos segmentos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos/segmentos?format=xml","type":"xml"},{"name":"Projetos em formato CSV","description":"Fornece uma lista das informações relacionadas aos projetos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos?format=csv","type":"csv"},{"name":"Propostas em formato CSV","description":"Fornece uma lista das informações relacionadas às propostas culturais...","url":"http://api.salic.cultura.gov.br/v1/propostas?format=csv","type":"csv"},{"name":"Proponentes em formato CSV","description":"Fornece uma lista das informações relacionadas aos proponentes cadastrados no...","url":"http://api.salic.cultura.gov.br/v1/proponentes?format=csv","type":"csv"},{"name":"Incentivadores em formato CSV","description":"Fornece uma lista das informações relacionadas aos incentivadores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/incentivadores?format=csv","type":"csv"},{"name":"Fornecedores em formato CSV","description":"Fornece uma lista das informações relacionadas aos fornecedores cadastrados...","url":"http://api.salic.cultura.gov.br/v1/fornecedores?format=csv","type":"csv"},{"name":"Áreas de atuação em formato CSV","description":"Fornece uma lista das informações relacionadas às áreas de atuação dos...","url":"http://api.salic.cultura.gov.br/v1/projetos/areas?format=csv","type":"csv"},{"name":"Segmentos Culturais em formato CSV","description":"Fornece uma lista das informações relacionadas aos segmentos culturais...","url":"http://api.salic.cultura.gov.br/v1/projetos/segmentos?format=csv","type":"csv"}],"groups":null,"name":"Projetos_do_Programa_Nacional_de_Apoio_à_Cultura_-_Lei_Rouanet_-_SALIC","description":"Dados Abertos do Sistema de Apoio às Leis de Incentivo à Cultura.","organization":"Ministério da Cultura - MinC","aditionalInfo":{"Fonte":"http://rouanet.cultura.gov.br/","Versão":"1.0","Última Atualização":"October 8, 2020, 3:32 PM (UTC-03:00)","Criado":"January 5, 2018, 2:35 PM (UTC-02:00)"},"unique_name":"uniãoProjetos_do_Programa_Nacional_de_Apoio_à_Cultura_-_Lei_Rouanet_-_SALIC","site_name":"união"})
  }

  @Get('teste2')
  async teste2() {
    return await this.datasetsService.teste2()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.datasetsService.findById(id);
  }

  @Get(':id/:resource_index/download')
  async download(
    @Res() res,
    @Param('id') id: string,
    @Param('resource_index', ParseIntPipe) resource_index: number
  ) {
    const url = await this.datasetsService.findDownloadUrl(id, resource_index);
    res.redirect(url);
  }
}
