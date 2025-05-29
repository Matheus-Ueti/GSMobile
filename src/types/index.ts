export interface Sensor {
  id_sensor: number;
  tipo: string;
  localizacao: string;
  unidade_medida: string;
  status: string;
}

export interface LeituraSensor {
  id_leitura: number;
  id_sensor: number;
  valor_lido: number;
  data_hora: string;
}

export interface Local {
  id_local: number;
  nome: string;
  cidade: string;
  estado: string;
  coordenadas: string;
}

export interface Evento {
  id_evento: number;
  tipo_evento: string;
  id_local: number;
  nivel_risco: string;
  data_evento: string;
  detalhes: string;
}

export interface Alerta {
  id_alerta: number;
  id_evento: number;
  mensagem: string;
  nivel_urgencia: string;
  data_hora: string;
}

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  localizacao: string;
}

export interface UsuarioAlerta {
  id_usuario_alerta: number;
  id_usuario: number;
  id_alerta: number;
  status_visualizacao: string;
  data_envio: string;
} 