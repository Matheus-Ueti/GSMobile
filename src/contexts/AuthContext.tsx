import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiService } from '../services/api';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  estaLogado: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth precisa estar dentro do AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true); // Inicia como true para verificar login

  // Verificar se há usuário logado ao inicializar
  useEffect(() => {
    verificarStatusAuth();
  }, []);

  const verificarStatusAuth = async () => {
    try {
      setCarregando(true);
      const { isAuthenticated, user } = await apiService.checkAuthStatus();
      
      if (isAuthenticated && user) {
        setUsuario(user);
        console.log('👤 Usuário já logado:', user.email);
      } else {
        setUsuario(null);
        console.log('🚫 Nenhum usuário logado');
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    
    try {
      const result = await apiService.login(email, senha);
      
      if (result.success && result.user) {
        setUsuario(result.user);
        console.log('🎉 Login bem-sucedido:', result.user.email);
        return true;
      } else {
        console.error('❌ Falha no login:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const cadastrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    
    try {
      const result = await apiService.cadastrar(nome, email, senha);
      
      if (result.success && result.user) {
        setUsuario(result.user);
        console.log('🎉 Cadastro bem-sucedido:', result.user.email);
        return true;
      } else {
        console.error('❌ Falha no cadastro:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUsuario(null);
      console.log('🚪 Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpa o estado local
      setUsuario(null);
    }
  };

  const value: AuthContextType = {
    usuario,
    estaLogado: !!usuario,
    login,
    cadastrar,
    logout,
    carregando,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 