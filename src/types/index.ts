// Aqui eu defino todos os tipos de dados que o app vai usar
// O professor disse que TypeScript ajuda a evitar bugs

// Representa um sensor no sistema
export interface Sensor {
  id_sensor: number;        // ID único do sensor
  tipo: string;            // Tipo do sensor (temperatura, umidade, etc)
  localizacao: string;     // Onde o sensor está localizado
  unidade_medida: string;  // Unidade de medida (°C, %, etc)
  status: string;          // Se está ativo, inativo ou em manutenção
}

// Representa uma leitura feita por um sensor
export interface LeituraSensor {
  id_leitura: number;      // ID único da leitura
  id_sensor: number;       // Qual sensor fez essa leitura
  valor_lido: number;      // O valor que foi lido pelo sensor
  data_hora: string;       // Quando a leitura foi feita
}

// Representa um local/lugar do sistema
export interface Local {
  id_local: number;        // ID único do local
  nome: string;           // Nome do local (ex: "Laboratório A")
  cidade: string;         // Cidade onde fica
  estado: string;         // Estado onde fica
  coordenadas: string;    // Coordenadas GPS (lat, lng)
}

// Representa um evento ambiental
export interface Evento {
  id_evento: number;       // ID único do evento
  tipo_evento: string;     // Tipo do evento (enchente, incêndio, etc)
  id_local: number;        // Em qual local aconteceu
  nivel_risco: string;     // Baixo, médio, alto, crítico
  data_evento: string;     // Quando o evento aconteceu
  detalhes: string;        // Descrição detalhada do evento
}

// Representa um alerta enviado aos usuários
export interface Alerta {
  id_alerta: number;       // ID único do alerta
  id_evento: number;       // Qual evento gerou esse alerta
  mensagem: string;        // Mensagem do alerta
  nivel_urgencia: string;  // Baixo, médio, alto, crítico
  data_hora: string;       // Quando o alerta foi criado
}

// Representa um usuário do sistema
export interface Usuario {
  id_usuario: number;      // ID único do usuário
  nome: string;           // Nome completo
  email: string;          // Email para login
  cpf: string;            // CPF do usuário
  localizacao: string;    // Onde o usuário está localizado
}

// Relaciona usuários com alertas (quem recebeu qual alerta)
export interface UsuarioAlerta {
  id_usuario_alerta: number;    // ID único da relação
  id_usuario: number;           // Qual usuário
  id_alerta: number;            // Qual alerta
  status_visualizacao: string;  // Se já foi visto ou não
  data_envio: string;           // Quando foi enviado
}

// NOTE: Talvez eu deveria adicionar mais campos nos tipos?
// TODO: Verificar se todos os campos são realmente necessários 