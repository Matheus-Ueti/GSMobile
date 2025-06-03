import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface CardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  status?: 'normal' | 'warning' | 'danger' | 'success';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  status = 'normal',
  style,
}) => {
  const obterCorStatus = () => {
    if (status === 'warning') return COLORS.warning;
    if (status === 'danger') return COLORS.danger;
    if (status === 'success') return COLORS.success;
    return COLORS.primary;
  };

  const ComponenteCard = onPress ? TouchableOpacity : View;

  return (
    <ComponenteCard 
      style={[styles.card, { borderLeftColor: obterCorStatus() }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>{title}</Text>
        {subtitle && <Text style={styles.subtitulo}>{subtitle}</Text>}
      </View>
      {children && <View style={styles.conteudo}>{children}</View>}
    </ComponenteCard>
  );
};

// Estilos organizados
const styles = StyleSheet.create({
  // Card principal
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Conteúdo
  header: {
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  conteudo: {
    marginTop: 8,
  },
}); 