import axios from 'axios';
import { Sensor, LeituraSensor, Local, Evento, Alerta, Usuario } from '../types';
import { MOCK_SENSORES, MOCK_LEITURAS, MOCK_LOCAIS, MOCK_EVENTOS, MOCK_ALERTAS, MOCK_USUARIOS, delay, generateId } from './mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API - altere a URL conforme sua API Java
const API_BASE_URL = 'http://localhost:8080/api'; // Ajuste conforme sua API
const USE_MOCK_DATA = true; // Mude para false quando a API estiver disponível

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Armazenamento local simulado para os dados mock
let mockSensores = [...MOCK_SENSORES];
let mockLeituras = [...MOCK_LEITURAS];
let mockLocais = [...MOCK_LOCAIS];
let mockEventos = [...MOCK_EVENTOS];
let mockAlertas = [...MOCK_ALERTAS];
let mockUsuarios = [...MOCK_USUARIOS];

// Funções auxiliares para dados mock
const createMockResponse = <T>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

// Tipos para o CRUD
export interface Sensor {
  id: string;
  nome: string;
  tipo: 'temperatura' | 'umidade' | 'ph' | 'qualidade_ar';
  valor: number;
  unidade: string;
  status: 'ativo' | 'inativo' | 'erro';
  localizacao: string;
  dataUltimaLeitura: string;
  limiteMin: number;
  limiteMax: number;
}

export interface Alerta {
  id: string;
  sensorId: string;
  sensorNome: string;
  tipo: 'critico' | 'aviso' | 'info';
  titulo: string;
  descricao: string;
  dataHora: string;
  lido: boolean;
  valor?: number;
  limite?: number;
}

export interface Configuracao {
  id: string;
  categoria: 'geral' | 'notificacoes' | 'sensores';
  chave: string;
  valor: any;
  descricao: string;
}

// Keys para AsyncStorage
const KEYS = {
  SENSORES: '@ecosafe:sensores',
  ALERTAS: '@ecosafe:alertas', 
  CONFIGURACOES: '@ecosafe:configuracoes',
  USUARIOS: '@ecosafe:usuarios'
};

// Dados iniciais para demonstração
const SENSORES_MOCK: Sensor[] = [
  {
    id: '1',
    nome: 'Sensor Temperatura Principal',
    tipo: 'temperatura',
    valor: 24.5,
    unidade: '°C',
    status: 'ativo',
    localizacao: 'Sala Principal',
    dataUltimaLeitura: new Date().toISOString(),
    limiteMin: 18,
    limiteMax: 30
  },
  {
    id: '2', 
    nome: 'Monitor Umidade',
    tipo: 'umidade',
    valor: 65,
    unidade: '%',
    status: 'ativo',
    localizacao: 'Laboratório',
    dataUltimaLeitura: new Date().toISOString(),
    limiteMin: 40,
    limiteMax: 80
  },
  {
    id: '3',
    nome: 'Medidor pH',
    tipo: 'ph',
    valor: 7.2,
    unidade: 'pH',
    status: 'erro',
    localizacao: 'Tanque A',
    dataUltimaLeitura: new Date(Date.now() - 300000).toISOString(),
    limiteMin: 6.0,
    limiteMax: 8.0
  }
];

const ALERTAS_MOCK: Alerta[] = [
  {
    id: '1',
    sensorId: '3',
    sensorNome: 'Medidor pH',
    tipo: 'critico',
    titulo: 'Sensor pH Offline',
    descricao: 'Sensor não responde há 5 minutos',
    dataHora: new Date().toISOString(),
    lido: false
  },
  {
    id: '2',
    sensorId: '2',
    sensorNome: 'Monitor Umidade', 
    tipo: 'aviso',
    titulo: 'Umidade Alta',
    descricao: 'Umidade acima de 70%',
    dataHora: new Date(Date.now() - 600000).toISOString(),
    lido: true,
    valor: 75,
    limite: 70
  }
];

// Classe principal da API
class ApiService {
  
  // ========== SENSORES ==========
  
  async getSensores(): Promise<Sensor[]> {
    try {
      const dados = await AsyncStorage.getItem(KEYS.SENSORES);
      if (!dados) {
        // Se não existir, criar dados iniciais
        await this.initSensores();
        return SENSORES_MOCK;
      }
      return JSON.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar sensores:', error);
      return SENSORES_MOCK;
    }
  }

  async getSensorById(id: string): Promise<Sensor | null> {
    const sensores = await this.getSensores();
    return sensores.find(s => s.id === id) || null;
  }

  async createSensor(sensor: Omit<Sensor, 'id'>): Promise<Sensor> {
    const sensores = await this.getSensores();
    const novoSensor: Sensor = {
      ...sensor,
      id: Date.now().toString(),
    };
    
    sensores.push(novoSensor);
    await AsyncStorage.setItem(KEYS.SENSORES, JSON.stringify(sensores));
    
    return novoSensor;
  }

  async updateSensor(id: string, dados: Partial<Sensor>): Promise<Sensor | null> {
    const sensores = await this.getSensores();
    const index = sensores.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    sensores[index] = { ...sensores[index], ...dados };
    await AsyncStorage.setItem(KEYS.SENSORES, JSON.stringify(sensores));
    
    return sensores[index];
  }

  async deleteSensor(id: string): Promise<boolean> {
    const sensores = await this.getSensores();
    const novosSensores = sensores.filter(s => s.id !== id);
    
    if (novosSensores.length === sensores.length) return false;
    
    await AsyncStorage.setItem(KEYS.SENSORES, JSON.stringify(novosSensores));
    return true;
  }

  // ========== ALERTAS ==========

  async getAlertas(): Promise<Alerta[]> {
    try {
      const dados = await AsyncStorage.getItem(KEYS.ALERTAS);
      if (!dados) {
        await this.initAlertas();
        return ALERTAS_MOCK;
      }
      return JSON.parse(dados);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return ALERTAS_MOCK;
    }
  }

  async createAlerta(alerta: Omit<Alerta, 'id'>): Promise<Alerta> {
    const alertas = await this.getAlertas();
    const novoAlerta: Alerta = {
      ...alerta,
      id: Date.now().toString(),
    };
    
    alertas.unshift(novoAlerta); // Adiciona no início
    await AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(alertas));
    
    return novoAlerta;
  }

  async marcarAlertaLido(id: string): Promise<boolean> {
    const alertas = await this.getAlertas();
    const index = alertas.findIndex(a => a.id === id);
    
    if (index === -1) return false;
    
    alertas[index].lido = true;
    await AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(alertas));
    
    return true;
  }

  async deleteAlerta(id: string): Promise<boolean> {
    const alertas = await this.getAlertas();
    const novosAlertas = alertas.filter(a => a.id !== id);
    
    if (novosAlertas.length === alertas.length) return false;
    
    await AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(novosAlertas));
    return true;
  }

  // ========== CONFIGURAÇÕES ==========

  async getConfiguracoes(): Promise<Configuracao[]> {
    try {
      const dados = await AsyncStorage.getItem(KEYS.CONFIGURACOES);
      return dados ? JSON.parse(dados) : [];
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return [];
    }
  }

  async setConfiguracao(chave: string, valor: any, categoria: string = 'geral'): Promise<void> {
    const configs = await this.getConfiguracoes();
    const index = configs.findIndex(c => c.chave === chave);
    
    const config: Configuracao = {
      id: index >= 0 ? configs[index].id : Date.now().toString(),
      categoria: categoria as any,
      chave,
      valor,
      descricao: `Configuração: ${chave}`
    };
    
    if (index >= 0) {
      configs[index] = config;
    } else {
      configs.push(config);
    }
    
    await AsyncStorage.setItem(KEYS.CONFIGURACOES, JSON.stringify(configs));
  }

  async getConfiguracao(chave: string): Promise<any> {
    const configs = await this.getConfiguracoes();
    const config = configs.find(c => c.chave === chave);
    return config?.valor;
  }

  // ========== STATS ==========

  async getEstatisticas() {
    const sensores = await this.getSensores();
    const alertas = await this.getAlertas();
    
    return {
      totalSensores: sensores.length,
      sensoresAtivos: sensores.filter(s => s.status === 'ativo').length,
      sensoresComErro: sensores.filter(s => s.status === 'erro').length,
      totalAlertas: alertas.length,
      alertasNaoLidos: alertas.filter(a => !a.lido).length,
      alertasCriticos: alertas.filter(a => a.tipo === 'critico').length,
    };
  }

  // ========== INICIALIZAÇÃO ==========

  async initSensores(): Promise<void> {
    await AsyncStorage.setItem(KEYS.SENSORES, JSON.stringify(SENSORES_MOCK));
  }

  async initAlertas(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(ALERTAS_MOCK));
  }

  // ========== SIMULAÇÃO DE DADOS REAL-TIME ==========

  async simularLeituras(): Promise<void> {
    const sensores = await this.getSensores();
    
    for (const sensor of sensores) {
      if (sensor.status === 'ativo') {
        // Simula variação nos valores
        const variacao = (Math.random() - 0.5) * 2;
        const novoValor = Math.max(
          sensor.limiteMin, 
          Math.min(sensor.limiteMax + 5, sensor.valor + variacao)
        );
        
        await this.updateSensor(sensor.id, {
          valor: Math.round(novoValor * 10) / 10,
          dataUltimaLeitura: new Date().toISOString()
        });
        
        // Gerar alerta se necessário
        if (novoValor > sensor.limiteMax || novoValor < sensor.limiteMin) {
          await this.createAlerta({
            sensorId: sensor.id,
            sensorNome: sensor.nome,
            tipo: novoValor > sensor.limiteMax + 2 || novoValor < sensor.limiteMin - 2 ? 'critico' : 'aviso',
            titulo: `${sensor.nome} fora do limite`,
            descricao: `Valor ${novoValor}${sensor.unidade} está ${novoValor > sensor.limiteMax ? 'acima' : 'abaixo'} do limite`,
            dataHora: new Date().toISOString(),
            lido: false,
            valor: novoValor,
            limite: novoValor > sensor.limiteMax ? sensor.limiteMax : sensor.limiteMin
          });
        }
      }
    }
  }

  // ========== LIMPEZA ==========

  async limparDados(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.SENSORES, KEYS.ALERTAS, KEYS.CONFIGURACOES]);
  }

  async resetarDados(): Promise<void> {
    await this.limparDados();
    await this.initSensores();
    await this.initAlertas();
  }
}

// Instância única da API
export const api = new ApiService();

// Funções de conveniência (mantendo compatibilidade)
export const login = async (email: string, senha: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Sempre aceita login
    }, 1000);
  });
};

export const getDados = async () => {
  return {
    sensores: await api.getSensores(),
    alertas: await api.getAlertas(),
    stats: await api.getEstatisticas()
  };
};

// Serviços para Sensores
export const sensorService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(500); // Simula delay de rede
      return createMockResponse(mockSensores);
    }
    return axiosApi.get<Sensor[]>('/sensores');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const sensor = mockSensores.find(s => s.id_sensor === id);
      return createMockResponse(sensor);
    }
    return axiosApi.get<Sensor>(`/sensores/${id}`);
  },
  
  create: async (sensor: Omit<Sensor, 'id_sensor'>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newSensor = {
        ...sensor,
        id_sensor: generateId(),
      };
      mockSensores.push(newSensor);
      return createMockResponse(newSensor);
    }
    return axiosApi.post<Sensor>('/sensores', sensor);
  },
  
  update: async (id: number, sensor: Partial<Sensor>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockSensores.findIndex(s => s.id_sensor === id);
      if (index !== -1) {
        mockSensores[index] = { ...mockSensores[index], ...sensor };
        return createMockResponse(mockSensores[index]);
      }
      throw new Error('Sensor não encontrado');
    }
    return axiosApi.put<Sensor>(`/sensores/${id}`, sensor);
  },
  
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockSensores.findIndex(s => s.id_sensor === id);
      if (index !== -1) {
        mockSensores.splice(index, 1);
        return createMockResponse(null);
      }
      throw new Error('Sensor não encontrado');
    }
    return axiosApi.delete(`/sensores/${id}`);
  },
};

// Serviços para Leituras de Sensores
export const leituraService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockLeituras);
    }
    return axiosApi.get<LeituraSensor[]>('/leituras');
  },
  
  getBySensor: async (sensorId: number) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const leituras = mockLeituras.filter(l => l.id_sensor === sensorId);
      return createMockResponse(leituras);
    }
    return axiosApi.get<LeituraSensor[]>(`/leituras/sensor/${sensorId}`);
  },
  
  getRecent: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      // Retorna as 10 leituras mais recentes
      const recentLeituras = mockLeituras
        .sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime())
        .slice(0, 10);
      return createMockResponse(recentLeituras);
    }
    return axiosApi.get<LeituraSensor[]>('/leituras/recentes');
  },
};

// Serviços para Locais
export const localService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return createMockResponse(mockLocais);
    }
    return axiosApi.get<Local[]>('/locais');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const local = mockLocais.find(l => l.id_local === id);
      return createMockResponse(local);
    }
    return axiosApi.get<Local>(`/locais/${id}`);
  },
  
  create: async (local: Omit<Local, 'id_local'>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newLocal = {
        ...local,
        id_local: generateId(),
      };
      mockLocais.push(newLocal);
      return createMockResponse(newLocal);
    }
    return axiosApi.post<Local>('/locais', local);
  },
  
  update: async (id: number, local: Partial<Local>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockLocais.findIndex(l => l.id_local === id);
      if (index !== -1) {
        mockLocais[index] = { ...mockLocais[index], ...local };
        return createMockResponse(mockLocais[index]);
      }
      throw new Error('Local não encontrado');
    }
    return axiosApi.put<Local>(`/locais/${id}`, local);
  },
  
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockLocais.findIndex(l => l.id_local === id);
      if (index !== -1) {
        mockLocais.splice(index, 1);
        return createMockResponse(null);
      }
      throw new Error('Local não encontrado');
    }
    return axiosApi.delete(`/locais/${id}`);
  },
};

// Serviços para Eventos
export const eventoService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockEventos);
    }
    return axiosApi.get<Evento[]>('/eventos');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const evento = mockEventos.find(e => e.id_evento === id);
      return createMockResponse(evento);
    }
    return axiosApi.get<Evento>(`/eventos/${id}`);
  },
  
  create: async (evento: Omit<Evento, 'id_evento'>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newEvento = {
        ...evento,
        id_evento: generateId(),
      };
      mockEventos.push(newEvento);
      return createMockResponse(newEvento);
    }
    return axiosApi.post<Evento>('/eventos', evento);
  },
  
  update: async (id: number, evento: Partial<Evento>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockEventos.findIndex(e => e.id_evento === id);
      if (index !== -1) {
        mockEventos[index] = { ...mockEventos[index], ...evento };
        return createMockResponse(mockEventos[index]);
      }
      throw new Error('Evento não encontrado');
    }
    return axiosApi.put<Evento>(`/eventos/${id}`, evento);
  },
  
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockEventos.findIndex(e => e.id_evento === id);
      if (index !== -1) {
        mockEventos.splice(index, 1);
        return createMockResponse(null);
      }
      throw new Error('Evento não encontrado');
    }
    return axiosApi.delete(`/eventos/${id}`);
  },
  
  getRecent: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      // Retorna os 5 eventos mais recentes
      const recentEventos = mockEventos
        .sort((a, b) => new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime())
        .slice(0, 5);
      return createMockResponse(recentEventos);
    }
    return axiosApi.get<Evento[]>('/eventos/recentes');
  },
};

// Serviços para Alertas
export const alertaService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockAlertas);
    }
    return axiosApi.get<Alerta[]>('/alertas');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const alerta = mockAlertas.find(a => a.id_alerta === id);
      return createMockResponse(alerta);
    }
    return axiosApi.get<Alerta>(`/alertas/${id}`);
  },
  
  create: async (alerta: Omit<Alerta, 'id_alerta'>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newAlerta = {
        ...alerta,
        id_alerta: generateId(),
      };
      mockAlertas.push(newAlerta);
      return createMockResponse(newAlerta);
    }
    return axiosApi.post<Alerta>('/alertas', alerta);
  },
  
  update: async (id: number, alerta: Partial<Alerta>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockAlertas.findIndex(a => a.id_alerta === id);
      if (index !== -1) {
        mockAlertas[index] = { ...mockAlertas[index], ...alerta };
        return createMockResponse(mockAlertas[index]);
      }
      throw new Error('Alerta não encontrado');
    }
    return axiosApi.put<Alerta>(`/alertas/${id}`, alerta);
  },
  
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockAlertas.findIndex(a => a.id_alerta === id);
      if (index !== -1) {
        mockAlertas.splice(index, 1);
        return createMockResponse(null);
      }
      throw new Error('Alerta não encontrado');
    }
    return axiosApi.delete(`/alertas/${id}`);
  },
  
  getActive: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      // Retorna alertas das últimas 24 horas
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const activeAlertas = mockAlertas.filter(a => 
        new Date(a.data_hora).getTime() > oneDayAgo
      );
      return createMockResponse(activeAlertas);
    }
    return axiosApi.get<Alerta[]>('/alertas/ativos');
  },
};

// Serviços para Usuários
export const usuarioService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockUsuarios);
    }
    return axiosApi.get<Usuario[]>('/usuarios');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const usuario = mockUsuarios.find(u => u.id_usuario === id);
      return createMockResponse(usuario);
    }
    return axiosApi.get<Usuario>(`/usuarios/${id}`);
  },
  
  create: async (usuario: Omit<Usuario, 'id_usuario'>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newUsuario = {
        ...usuario,
        id_usuario: generateId(),
      };
      mockUsuarios.push(newUsuario);
      return createMockResponse(newUsuario);
    }
    return axiosApi.post<Usuario>('/usuarios', usuario);
  },
  
  update: async (id: number, usuario: Partial<Usuario>) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockUsuarios.findIndex(u => u.id_usuario === id);
      if (index !== -1) {
        mockUsuarios[index] = { ...mockUsuarios[index], ...usuario };
        return createMockResponse(mockUsuarios[index]);
      }
      throw new Error('Usuário não encontrado');
    }
    return axiosApi.put<Usuario>(`/usuarios/${id}`, usuario);
  },
  
  delete: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const index = mockUsuarios.findIndex(u => u.id_usuario === id);
      if (index !== -1) {
        mockUsuarios.splice(index, 1);
        return createMockResponse(null);
      }
      throw new Error('Usuário não encontrado');
    }
    return axiosApi.delete(`/usuarios/${id}`);
  },
};

export default axiosApi; 