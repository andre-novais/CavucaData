//import CkanWdioScrapper from '../factories/CkanWdioFactory'
import CkanScrapper from '../api_models/CkanScrapper'

export interface SiteConfig {
  site_type: any,
  base_url: string,
  site_name: string,
  image_base_url: string,
  site_display_name: string
}

export const siteMetaData = {
  prefeitura_belo_horizonte: {
    site_type: CkanScrapper,
    base_url: 'https://dados.pbh.gov.br',
    site_name: 'prefeitura_belo_horizonte',
    image_base_url: 'https://ckan.pbh.gov.br/uploads/group/',
    site_display_name: 'Prefeitura de Belo Horizonte'
  },
  governo_federal: {
    site_type: CkanScrapper,
    base_url: 'https://dados.gov.br',
    site_name: 'governo_federal',
    image_base_url: '',
    site_display_name: 'Governo Federal'
  },
  governo_estadual_alagoas: {
    site_type: CkanScrapper,
    base_url: 'http://dados.al.gov.br',
    site_name: 'governo_estadual_alagoas',
    image_base_url: '',
    site_display_name: 'Governo de Alagoas'
  },
  prefeitura_fortaleza: {
    site_type: CkanScrapper,
    base_url: 'http://dados.fortaleza.ce.gov.br',
    site_name: 'prefeitura_fortaleza',
    image_base_url: '',
    site_display_name: 'Prefeitura de Fortaleza'
  },
  governo_distrito_federal: {
    site_type: CkanScrapper,
    base_url: 'http://dados.df.gov.br',
    site_name: 'governo_distrito_federal',
    image_base_url: '',
    site_display_name: 'Governo do Distrito Federal'
  },
  governo_espirito_santo: {
    site_type: CkanScrapper,
    base_url: 'https://dados.es.gov.br',
    site_name: 'governo_espirito_santo',
    image_base_url: '',
    site_display_name: 'Governo do Espirito Santo'
  },
  governo_pernambuco: {
    site_type: CkanScrapper,
    base_url: 'https://dados.pe.gov.br',
    site_name: 'governo_pernambuco',
    image_base_url: '',
    site_display_name: 'Governo de Pernambuco'
  },
  prefeitura_recife: {
    site_type: CkanScrapper,
    base_url: 'http://dados.recife.pe.gov.br',
    site_name: 'prefeitura_recife',
    image_base_url: '',
    site_display_name: 'Prefeitura de Recife'
  },
  governo_rio_grande_do_sul: {
    site_type: CkanScrapper,
    base_url: 'https://dados.rs.gov.br',
    site_name: 'governo_rio_grande_do_sul',
    image_base_url: '',
    site_display_name: 'Governo do Rio Grande do Sul'
  },
  governo_santa_catarina: {
    site_type: CkanScrapper,
    base_url: 'http://dados.sc.gov.br',
    site_name: 'governo_santa_catarina',
    image_base_url: '',
    site_display_name: 'Governo de Santa Catarina'
  },
  prefeitura_porto_alegre: {
    site_type: CkanScrapper,
    base_url: 'http://datapoa.com.br',
    site_name: 'prefeitura_porto_alegre',
    image_base_url: '',
    site_display_name: 'Prefeitura de Porto Alegre'
  },
  governo_sao_paulo: {
    site_type: CkanScrapper,
    base_url: 'http://catalogo.governoaberto.sp.gov.br',
    site_name: 'governo_sao_paulo',
    image_base_url: '',
    site_display_name: 'Governo de São Paulo'
  },
  tce_rs: {
    site_type: CkanScrapper,
    base_url: 'http://dados.tce.rs.gov.br',
    site_name: 'tce_rs',
    image_base_url: '',
    site_display_name: 'Tribunal de Contas do Rio Grande do Sul'
  },
  prefeitura_sao_paulo: {
    site_type: CkanScrapper,
    base_url: 'http://dados.prefeitura.sp.gov.br',
    site_name: 'prefeitura_sao_paulo',
    image_base_url: '',
    site_display_name: 'Prefeitura de São Paulo'
  },
  prefeitura_natal: {
    site_type: CkanScrapper,
    base_url: 'http://dados.natal.br',
    site_name: 'prefeitura_natal',
    image_base_url: '',
    site_display_name: 'Prefeitura de Natal'
  },
  portal_transparencia_pernambuco: {
    site_type: CkanScrapper,
    base_url: 'http://web.transparencia.pe.gov.br/ckan',
    site_name: 'portal_transparencia_pernambuco',
    image_base_url: '',
    site_display_name: 'Portal de Transparência de Pernambuco'
  }
}
