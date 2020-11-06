import CkanWdioScrapper from '../factories/CkanWdioScrapper'

export const siteMetaData = {
  dados_pbh_gov_br: {
    site_type: CkanWdioScrapper,
    base_url: 'https://dados.pbh.gov.br/dataset?q=&sort=metadata_modified+desc',
    root_link_href: '/dataset',
    site_name: 'prefeitura_belo_horizonte'
  },
  dados_gov_br: {
    site_type: CkanWdioScrapper,
    base_url: 'https://dados.gov.br/dataset?q=&sort=metadata_modified+desc',
    root_link_href: '/dataset/',
    site_name: 'união'
  }
};
