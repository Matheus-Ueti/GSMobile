import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

// Props que o componente Loading pode receber
interface LoadingProps {
  message?: string;     // Mensagem personalizada (opcional)
  size?: 'small' | 'large';  // Tamanho do spinner
}

// Componente para mostrar tela de carregamento
// Uso esse componente quando estou esperando dados carregarem
export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Carregando...', // Valor padrão se não for passado
  size = 'large' 
}) => {
  return (
    <View style={styles.container}>
      {/* ActivityIndicator é o spinner que gira */}
      <ActivityIndicator size={size} color={COLORS.primary} />
      
      {/* Texto que aparece embaixo do spinner */}
      <Text style={styles.mensagem}>{message}</Text>
    </View>
  );
};

// ESTILOS - Centraliza tudo na tela
const styles = StyleSheet.create({
  // Container principal - ocupa a tela toda e centraliza o conteúdo
  container: {
    flex: 1,                        // Ocupa todo o espaço disponível
    justifyContent: 'center',       // Centraliza verticalmente
    alignItems: 'center',           // Centraliza horizontalmente
    backgroundColor: COLORS.background,
  },
  
  // Estilo do texto da mensagem
  mensagem: {
    marginTop: 16,                  // Espaço entre o spinner e o texto
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  
  // TODO: Talvez adicionar uma animação no texto também?
  // FIXME: Será que 16 é o melhor marginTop para o texto?
}); 