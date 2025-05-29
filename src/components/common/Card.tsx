import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return COLORS.warning;
      case 'danger':
        return COLORS.danger;
      case 'success':
        return COLORS.success;
      default:
        return COLORS.primary;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={[styles.card, { borderLeftColor: getStatusColor() }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: COLORS.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  content: {
    marginTop: 8,
  },
}); 