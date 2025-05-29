import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  estaLogado: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
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
  const [carregando, setCarregando] = useState(false);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && senha) {
      const novoUsuario: Usuario = {
        id: 1,
        nome: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
      };
      
      setUsuario(novoUsuario);
      setCarregando(false);
      return true;
    }
    
    setCarregando(false);
    return false;
  };

  const logout = () => {
    setUsuario(null);
  };

  const value: AuthContextType = {
    usuario,
    estaLogado: !!usuario,
    login,
    logout,
    carregando,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 