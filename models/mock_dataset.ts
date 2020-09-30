let mock_dataset = {
  name: "Ocorrências Criminais - Sinesp",
  organization: "Ministério da Justiça e Segurança Pública - MJ",
  group: "",
  tags: [
    "DGI",
    "DNSP",
    "Dados Nacionais de Segurança Pública",
    "Dados Oficiais",
    "senasp",
    "sinesp",
  ],
  source:
    "http://dados.mj.gov.br/dataset/sistema-nacional-de-estatisticas-de-seguranca-publica",
  author: "Secretaria Nacional de Segurança Pública",
  mainteiner: "Rafael Rodrigues de Sousa",
  version: "1.0",
  updated_at: "September 1, 2020, 5:39 PM (UTC-03:00)",
  created_at: "January 25, 2019, 10:30 PM (UTC-02:00)",
  Data: [
    {
      name: "Dicionário de Dados",
      description: "",
      format: ".pdf",
      download_url:
        "http://dados.mj.gov.br/dataset/210b9ae2-21fc-4986-89c6-2006eb4db247/resource/fca1cb9b-1bfb-4090-bdca-5171ed3b9fa4/download/dicionario-de-dados-convertido.pdf",
    },
    {
      name: "Dados Nacionais de Segurança Pública - Municípios",
      description: "Indicadores de segurança pública por Município.",
      format: ".xlsx",
      download_url:
        "http://dados.mj.gov.br/dataset/210b9ae2-21fc-4986-89c6-2006eb4db247/resource/03af7ce2-174e-4ebd-b085-384503cfb40f/download/indicadoressegurancapublicamunicabr20.xlsx",
    },
    {
      name: "Dados Nacionais de Segurança Pública - UF",
      description: "Indicadores de segurança pública por Unidade da Federação.",
      format: ".xlsx",
      download_url:
        "http://dados.mj.gov.br/dataset/210b9ae2-21fc-4986-89c6-2006eb4db247/resource/feeae05e-faba-406c-8a4a-512aec91a9d1/download/indicadoressegurancapublicaufabr20.xlsx",
    },
  ],
};

module.exports = mock_dataset;
