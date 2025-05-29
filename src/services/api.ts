import axios from 'axios';
import { Sensor, LeituraSensor, Local, Evento, Alerta, Usuario } from '../types';
import { 
  MOCK_SENSORES, 
  MOCK_LEITURAS, 
  MOCK_LOCAIS, 
  MOCK_EVENTOS, 
  MOCK_ALERTAS, 
  MOCK_USUARIOS,
  delay,
  generateId 
} from './mockData';

// Configuração base da API - altere a URL conforme sua API Java
const API_BASE_URL = 'http://localhost:8080/api'; // Ajuste conforme sua API
const USE_MOCK_DATA = true; // Mude para false quando a API estiver disponível

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros
api.interceptors.response.use(
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

// Serviços para Sensores
export const sensorService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(500); // Simula delay de rede
      return createMockResponse(mockSensores);
    }
    return api.get<Sensor[]>('/sensores');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const sensor = mockSensores.find(s => s.id_sensor === id);
      return createMockResponse(sensor);
    }
    return api.get<Sensor>(`/sensores/${id}`);
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
    return api.post<Sensor>('/sensores', sensor);
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
    return api.put<Sensor>(`/sensores/${id}`, sensor);
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
    return api.delete(`/sensores/${id}`);
  },
};

// Serviços para Leituras de Sensores
export const leituraService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockLeituras);
    }
    return api.get<LeituraSensor[]>('/leituras');
  },
  
  getBySensor: async (sensorId: number) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const leituras = mockLeituras.filter(l => l.id_sensor === sensorId);
      return createMockResponse(leituras);
    }
    return api.get<LeituraSensor[]>(`/leituras/sensor/${sensorId}`);
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
    return api.get<LeituraSensor[]>('/leituras/recentes');
  },
};

// Serviços para Locais
export const localService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return createMockResponse(mockLocais);
    }
    return api.get<Local[]>('/locais');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const local = mockLocais.find(l => l.id_local === id);
      return createMockResponse(local);
    }
    return api.get<Local>(`/locais/${id}`);
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
    return api.post<Local>('/locais', local);
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
    return api.put<Local>(`/locais/${id}`, local);
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
    return api.delete(`/locais/${id}`);
  },
};

// Serviços para Eventos
export const eventoService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockEventos);
    }
    return api.get<Evento[]>('/eventos');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const evento = mockEventos.find(e => e.id_evento === id);
      return createMockResponse(evento);
    }
    return api.get<Evento>(`/eventos/${id}`);
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
    return api.post<Evento>('/eventos', evento);
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
    return api.put<Evento>(`/eventos/${id}`, evento);
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
    return api.delete(`/eventos/${id}`);
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
    return api.get<Evento[]>('/eventos/recentes');
  },
};

// Serviços para Alertas
export const alertaService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockAlertas);
    }
    return api.get<Alerta[]>('/alertas');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const alerta = mockAlertas.find(a => a.id_alerta === id);
      return createMockResponse(alerta);
    }
    return api.get<Alerta>(`/alertas/${id}`);
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
    return api.post<Alerta>('/alertas', alerta);
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
    return api.put<Alerta>(`/alertas/${id}`, alerta);
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
    return api.delete(`/alertas/${id}`);
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
    return api.get<Alerta[]>('/alertas/ativos');
  },
};

// Serviços para Usuários
export const usuarioService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      return createMockResponse(mockUsuarios);
    }
    return api.get<Usuario[]>('/usuarios');
  },
  
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const usuario = mockUsuarios.find(u => u.id_usuario === id);
      return createMockResponse(usuario);
    }
    return api.get<Usuario>(`/usuarios/${id}`);
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
    return api.post<Usuario>('/usuarios', usuario);
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
    return api.put<Usuario>(`/usuarios/${id}`, usuario);
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
    return api.delete(`/usuarios/${id}`);
  },
};

export default api; 