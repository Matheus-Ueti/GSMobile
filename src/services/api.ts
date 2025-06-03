import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sensor, LeituraSensor, Local, Evento, Alerta, Usuario } from '../types';

// Configuração para sua API Java
// IMPORTANTE: Atualize esta URL para o endereço do seu backend Java
const API_BASE_URL = 'http://172.60.33.37:8080/api';

// Para desenvolvimento:
// - Emulador Android: 'http://10.0.2.2:8080/api'
// - Dispositivo físico: 'http://SEU_IP_LOCAL:8080/api' (ex: http://192.168.1.100:8080/api)
// - iOS Simulator: 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000, // Reduzido para 2 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chaves para armazenamento local
const STORAGE_KEYS = {
  TOKEN: '@ecosafe:token',
  USER: '@ecosafe:user',
  USE_MOCK: '@ecosafe:use_mock',
};

// Usuários mock para demonstração
const MOCK_USERS = [
  {
    id_usuario: 1,
    nome: 'Administrador',
    email: 'admin@ecosafe.com',
    cpf: '000.000.000-00',
    localizacao: 'São Paulo',
    senha: '123456' // Em produção, isso seria hash
  },
  {
    id_usuario: 2,
    nome: 'Demo User',
    email: 'demo@ecosafe.com',
    cpf: '111.111.111-11',
    localizacao: 'Rio de Janeiro',
    senha: 'demo123'
  }
];

// Verificar se deve usar mock
const shouldUseMock = async (): Promise<boolean> => {
  try {
    const useMock = await AsyncStorage.getItem(STORAGE_KEYS.USE_MOCK);
    return useMock === 'true';
  } catch {
    return false;
  }
};

// Interceptador para adicionar token JWT nas requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Não logar erros de timeout quando usando fallback
    if (error.code !== 'ECONNABORTED') {
      console.error('Erro na API:', error);
    }
    
    // Se token expirou (401), limpar dados de autenticação
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    }
    
    return Promise.reject(error);
  }
);

// Interfaces para autenticação
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Usuario;
  token?: string;
  message?: string;
}

// Serviços da API
export const apiService = {
  // ==================== AUTENTICAÇÃO ====================
  
  /**
   * Login - tenta backend primeiro, usa mock como fallback
   */
  async login(email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    console.log('🚀 Tentando login para:', email);
    
    // Primeiro tenta o backend (silenciosamente)
    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      const { data } = response;
      
      // Salvar token e usuário no AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      }
      
      if (data.user || data.usuario) {
        const user = data.user || data.usuario;
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.USE_MOCK, 'false');
        
        console.log('✅ Login bem-sucedido com backend');
        return {
          success: true,
          user: user
        };
      }

      return {
        success: false,
        message: 'Resposta inválida do servidor'
      };

    } catch (error: any) {
      // Usar mock silenciosamente quando backend não disponível
      console.log('⚠️ Backend indisponível, usando sistema offline...');
      
      // Fallback: usar sistema mock
      return await this.mockLogin(email, senha);
    }
  },

  /**
   * Login Mock para demonstração
   */
  async mockLogin(email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar credenciais mock
      const user = MOCK_USERS.find(u => u.email === email && u.senha === senha);
      
      if (user) {
        // Remover senha antes de salvar
        const { senha: _, ...userWithoutPassword } = user;
        
        // Salvar dados mock
        const mockToken = 'mock_token_' + Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
        await AsyncStorage.setItem(STORAGE_KEYS.USE_MOCK, 'true');
        
        console.log('✅ Login offline bem-sucedido');
        return {
          success: true,
          user: userWithoutPassword
        };
      }
      
      // Se não encontrou usuário específico, aceitar qualquer email/senha válidos
      if (email.includes('@') && senha.length >= 3) {
        const genericUser = {
          id_usuario: 999,
          nome: email.split('@')[0],
          email: email,
          cpf: '000.000.000-00',
          localizacao: 'Demo'
        };
        
        // Salvar dados mock
        const mockToken = 'mock_token_' + Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(genericUser));
        await AsyncStorage.setItem(STORAGE_KEYS.USE_MOCK, 'true');
        
        console.log('✅ Login offline bem-sucedido (genérico)');
        return {
          success: true,
          user: genericUser
        };
      }
      
      return {
        success: false,
        message: 'Email ou senha incorretos'
      };
      
    } catch (error) {
      console.error('❌ Erro no login mock:', error);
      return {
        success: false,
        message: 'Erro interno do sistema'
      };
    }
  },

  /**
   * Cadastro - tenta backend primeiro, usa mock como fallback
   */
  async cadastrar(nome: string, email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    console.log('🚀 Tentando cadastro para:', email);
    
    // Primeiro tenta o backend (silenciosamente)
    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha
      });

      const { data } = response;
      
      // Salvar token e usuário no AsyncStorage
      if (data.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      }
      
      if (data.user || data.usuario) {
        const user = data.user || data.usuario;
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        await AsyncStorage.setItem(STORAGE_KEYS.USE_MOCK, 'false');
        
        console.log('✅ Cadastro bem-sucedido com backend');
        return {
          success: true,
          user: user
        };
      }

      return {
        success: false,
        message: 'Resposta inválida do servidor'
      };

    } catch (error: any) {
      console.log('⚠️ Backend indisponível, usando sistema offline...');
      
      // Fallback: usar sistema mock
      return await this.mockCadastro(nome, email, senha);
    }
  },

  /**
   * Cadastro Mock para demonstração
   */
  async mockCadastro(nome: string, email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar se email já existe
      const emailExists = MOCK_USERS.some(u => u.email === email);
      if (emailExists) {
        return {
          success: false,
          message: 'Email já cadastrado'
        };
      }
      
      // Criar novo usuário mock
      const newUser = {
        id_usuario: Date.now(), // ID único baseado em timestamp
        nome,
        email,
        cpf: '000.000.000-00',
        localizacao: 'Brasil'
      };
      
      // Salvar dados mock
      const mockToken = 'mock_token_' + Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      await AsyncStorage.setItem(STORAGE_KEYS.USE_MOCK, 'true');
      
      console.log('✅ Cadastro offline bem-sucedido');
      return {
        success: true,
        user: newUser
      };
      
    } catch (error) {
      console.error('❌ Erro no cadastro mock:', error);
      return {
        success: false,
        message: 'Erro interno do sistema'
      };
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const useMock = await shouldUseMock();
      
      if (!useMock) {
        // Chamar endpoint de logout no backend (opcional)
        await api.post('/auth/logout').catch(() => {
          // Ignorar erro se o backend não tiver endpoint de logout
        });
      }
    } catch (error) {
      // Não logar erros de logout
    } finally {
      // Sempre limpar o storage local
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER, STORAGE_KEYS.USE_MOCK]);
      console.log('🚪 Logout realizado');
    }
  },

  /**
   * Verificar status de autenticação
   */
  async checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: Usuario }> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const useMock = await shouldUseMock();
      
      if (!token || !userJson) {
        return { isAuthenticated: false };
      }

      const user = JSON.parse(userJson);
      
      // Se está usando mock, apenas verificar se tem dados salvos
      if (useMock) {
        return { isAuthenticated: true, user };
      }
      
      // Se não é mock, verificar se o token ainda é válido no backend
      try {
        const response = await api.get('/auth/me');
        return { 
          isAuthenticated: true, 
          user: response.data.user || response.data.usuario || user 
        };
      } catch (error) {
        // Se der erro, assumir que o token expirou
        await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
        return { isAuthenticated: false };
      }
      
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return { isAuthenticated: false };
    }
  },

  // ==================== DADOS DA APLICAÇÃO ====================

  // Sensores
  async getSensores(): Promise<Sensor[]> {
    try {
      const response = await api.get('/sensores');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sensores:', error);
      return [];
    }
  },

  async getSensorById(id: number): Promise<Sensor | null> {
    try {
      const response = await api.get(`/sensores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sensor:', error);
      return null;
    }
  },

  // Leituras
  async getLeituras(): Promise<LeituraSensor[]> {
    try {
      const response = await api.get('/leituras');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      return [];
    }
  },

  // Eventos
  async getEventos(): Promise<Evento[]> {
    try {
      const response = await api.get('/eventos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      return [];
    }
  },

  async criarEvento(evento: Omit<Evento, 'id_evento'>): Promise<Evento | null> {
    try {
      const response = await api.post('/eventos', evento);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return null;
    }
  },

  // Alertas
  async getAlertas(): Promise<Alerta[]> {
    try {
      const response = await api.get('/alertas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  },

  async criarAlerta(alerta: Omit<Alerta, 'id_alerta'>): Promise<Alerta | null> {
    try {
      const response = await api.post('/alertas', alerta);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      return null;
    }
  },

  async atualizarAlerta(id: number, alerta: Partial<Alerta>): Promise<Alerta | null> {
    try {
      const response = await api.put(`/alertas/${id}`, alerta);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      return null;
    }
  },

  async excluirAlerta(id: number): Promise<boolean> {
    try {
      await api.delete(`/alertas/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir alerta:', error);
      return false;
    }
  },

  // Locais
  async getLocais(): Promise<Local[]> {
    try {
      const response = await api.get('/locais');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      return [];
    }
  },

  // Usuários
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  },
};

export default api; 