import { Sensor, LeituraSensor, Local, Evento, Alerta, Usuario } from '../types';

// Dados mock para demonstração
export const MOCK_LOCAIS: Local[] = [
  {
    id_local: 1,
    nome: 'Centro de São Paulo',
    cidade: 'São Paulo',
    estado: 'SP',
    coordenadas: '-23.5505,-46.6333',
  },
  {
    id_local: 2,
    nome: 'Zona Sul do Rio',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    coordenadas: '-22.9068,-43.1729',
  },
  {
    id_local: 3,
    nome: 'Porto Alegre Centro',
    cidade: 'Porto Alegre',
    estado: 'RS',
    coordenadas: '-30.0346,-51.2177',
  },
];

export const MOCK_SENSORES: Sensor[] = [
  {
    id_sensor: 1,
    tipo: 'Sensor de Umidade',
    localizacao: 'Centro de São Paulo - Marginal',
    unidade_medida: '%',
    status: 'ativo',
  },
  {
    id_sensor: 2,
    tipo: 'Sensor de Temperatura',
    localizacao: 'Zona Sul do Rio - Copacabana',
    unidade_medida: '°C',
    status: 'ativo',
  },
  {
    id_sensor: 3,
    tipo: 'Sensor de Pressão Atmosférica',
    localizacao: 'Porto Alegre Centro',
    unidade_medida: 'hPa',
    status: 'manutenção',
  },
  {
    id_sensor: 4,
    tipo: 'Sensor de Velocidade do Vento',
    localizacao: 'Centro de São Paulo - Viaduto',
    unidade_medida: 'km/h',
    status: 'ativo',
  },
  {
    id_sensor: 5,
    tipo: 'Sensor de Pluviometria',
    localizacao: 'Zona Sul do Rio - Ipanema',
    unidade_medida: 'mm',
    status: 'inativo',
  },
];

export const MOCK_LEITURAS: LeituraSensor[] = [
  {
    id_leitura: 1,
    id_sensor: 1,
    valor_lido: 85.5,
    data_hora: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min atrás
  },
  {
    id_leitura: 2,
    id_sensor: 2,
    valor_lido: 28.3,
    data_hora: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min atrás
  },
  {
    id_leitura: 3,
    id_sensor: 4,
    valor_lido: 45.2,
    data_hora: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min atrás
  },
  {
    id_leitura: 4,
    id_sensor: 1,
    valor_lido: 90.1,
    data_hora: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 min atrás
  },
  {
    id_leitura: 5,
    id_sensor: 5,
    valor_lido: 12.7,
    data_hora: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
  },
];

export const MOCK_EVENTOS: Evento[] = [
  {
    id_evento: 1,
    tipo_evento: 'Enchente',
    id_local: 1,
    nivel_risco: 'alto',
    data_evento: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
    detalhes: 'Nível do rio acima do normal após fortes chuvas. Monitoramento contínuo necessário.',
  },
  {
    id_evento: 2,
    tipo_evento: 'Vento Forte',
    id_local: 2,
    nivel_risco: 'médio',
    data_evento: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h atrás
    detalhes: 'Ventos de até 60km/h registrados na região costeira.',
  },
  {
    id_evento: 3,
    tipo_evento: 'Incêndio Florestal',
    id_local: 3,
    nivel_risco: 'crítico',
    data_evento: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h atrás
    detalhes: 'Foco de incêndio detectado na região metropolitana. Bombeiros acionados.',
  },
];

export const MOCK_ALERTAS: Alerta[] = [
  {
    id_alerta: 1,
    id_evento: 1,
    mensagem: 'ALERTA: Risco de enchente detectado na região central de São Paulo',
    nivel_urgencia: 'alto',
    data_hora: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1h atrás
  },
  {
    id_alerta: 2,
    id_evento: 3,
    mensagem: 'CRÍTICO: Incêndio florestal em expansão - Evacuação necessária',
    nivel_urgencia: 'crítico',
    data_hora: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10h atrás
  },
  {
    id_alerta: 3,
    id_evento: 2,
    mensagem: 'ATENÇÃO: Ventos fortes podem causar danos materiais',
    nivel_urgencia: 'médio',
    data_hora: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5h atrás
  },
];

export const MOCK_USUARIOS: Usuario[] = [
  {
    id_usuario: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-01',
    localizacao: 'São Paulo, SP',
  },
  {
    id_usuario: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    cpf: '987.654.321-09',
    localizacao: 'Rio de Janeiro, RJ',
  },
];

// Função para simular delay de rede
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para gerar IDs únicos
export const generateId = () => Math.floor(Math.random() * 10000) + 1000; 