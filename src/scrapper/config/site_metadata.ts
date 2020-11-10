//import CkanWdioScrapper from '../factories/CkanWdioFactory'
import CkanScrapper from '../api_models/CkanScrapper'

export interface SiteConfig {
  site_type: any,
  base_url: string,
  site_name: string
}

export const siteMetaData = {
  dados_pbh_gov_br: {
    site_type: CkanScrapper,
    base_url: 'https://dados.pbh.gov.br',
    site_name: 'prefeitura_belo_horizonte'
  },
  dados_gov_br: {
    site_type: CkanScrapper,
    base_url: 'https://dados.gov.br',
    site_name: 'união'
  }
}
