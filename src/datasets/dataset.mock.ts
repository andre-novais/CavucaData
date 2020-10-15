export const datasetMock: any = {
  tags: ['UFOB', 'bens móveis', 'educação', 'educação superior', 'patrimônio da união'],
  resources: [
    {
      resource1: {
        name: 'Bens móveis',
        description: 'Relação dos bens móveis da UFOB até 1 de junho de 2018.',
        url:
          'https://ufob.edu.br/acessoainformacao/index.php/dados-abertos?download=12:bens-moveis',
        type: 'csv'
      },
      resource2: {
        name: 'Relação dos Bens Móveis 2020',
        description: 'Relação dos Bens Móveis 2020',
        url:
          'https://ufob.edu.br/acessoainformacao/index.php/dados-abertos?download=208:relacao-do-patrimonio',
        type: 'csv'
      }
    }
  ],
  groups: null,
  name: 'Patrimônio',
  description: 'Lista de mobiliário e equipamentos pertencentes à UFOB até julho de 2018.',
  organization: 'Universidade Federal do Oeste da Bahia - UFOB',
  aditionalInfo: {
    Fonte: 'https://ufob.edu.br/acessoainformacao/index.php/dados-abertos?download=12:bens-moveis',
    Autor: 'Pró-Reitoria de Administração e Infraestrutura',
    Mantenedor: 'Pró-Reitoria de Tecnologia da Informação e Comunicação',
    Versão: '1.0',
    'Última Atualização': 'October 10, 2020, 7:38 PM (UTC-03:00)',
    Criado: 'August 30, 2018, 11:22 AM (UTC-03:00)',
    Autarquia: 'Federal',
    'Frequência de atualização': 'Anual',
    'Granularidade temporal': '1 de junho de 2018',
    'Natureza dos dados': 'Administrativa',
    VGE: '/vocab.e.gov.br/2011/03/vcge#patrimonio-uniao'
  },
  unique_name: 'uniãoPatrimônio',
  site_name: 'união'
};
