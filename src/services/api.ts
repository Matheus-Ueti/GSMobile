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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chaves para armazenamento local
const STORAGE_KEYS = {
  TOKEN: '@ecosafe:token',
  USER: '@ecosafe:user',
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
    console.error('Erro na API:', error);
    
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
   * Login no backend Java
   */
  async login(email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    try {
      console.log('🚀 Fazendo login com backend Java:', email);
      
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
        
        console.log('✅ Login bem-sucedido');
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
      console.error('❌ Erro no login:', error);
      
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Erro ao fazer login. Verifique suas credenciais.';
      
      return {
        success: false,
        message
      };
    }
  },

  /**
   * Cadastro no backend Java
   */
  async cadastrar(nome: string, email: string, senha: string): Promise<{ success: boolean; user?: Usuario; message?: string }> {
    try {
      console.log('🚀 Fazendo cadastro com backend Java:', email);
      
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
        
        console.log('✅ Cadastro bem-sucedido');
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
      console.error('❌ Erro no cadastro:', error);
      
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Erro ao criar conta. Tente novamente.';
      
      return {
        success: false,
        message
      };
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      // Chamar endpoint de logout no backend (opcional)
      await api.post('/auth/logout').catch(() => {
        // Ignorar erro se o backend não tiver endpoint de logout
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Sempre limpar o storage local
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
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
      
      if (!token || !userJson) {
        return { isAuthenticated: false };
      }

      const user = JSON.parse(userJson);
      
      // Verificar se o token ainda é válido
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