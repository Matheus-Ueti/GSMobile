import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../constants/colors';
import { leituraService, alertaService, eventoService } from '../services/api';
import { LeituraSensor, Alerta, Evento } from '../types';

export const DashboardScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leituras, setLeituras] = useState<LeituraSensor[]>([]);
  const [alertasAtivos, setAlertasAtivos] = useState<Alerta[]>([]);
  const [eventosRecentes, setEventosRecentes] = useState<Evento[]>([]);

  const loadData = async () => {
    try {
      const [leiturasResponse, alertasResponse, eventosResponse] = await Promise.all([
        leituraService.getRecent(),
        alertaService.getActive(),
        eventoService.getRecent(),
      ]);

      setLeituras(leiturasResponse.data || []);
      setAlertasAtivos(alertasResponse.data || []);
      setEventosRecentes(eventosResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getAlertaStatus = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'crítico':
      case 'alto':
        return 'danger';
      case 'médio':
        return 'warning';
      default:
        return 'normal';
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>EcoSafe Dashboard</Text>
      <Text style={styles.subtitle}>Monitoramento Ambiental em Tempo Real</Text>

      {/* Resumo de Alertas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas Ativos ({alertasAtivos.length})</Text>
        {alertasAtivos.length === 0 ? (
          <Card title="Nenhum alerta ativo" subtitle="Sistema funcionando normalmente" status="success" />
        ) : (
          alertasAtivos.slice(0, 3).map((alerta) => (
            <Card
              key={alerta.id_alerta}
              title={alerta.mensagem}
              subtitle={`Urgência: ${alerta.nivel_urgencia} • ${formatarData(alerta.data_hora)}`}
              status={getAlertaStatus(alerta.nivel_urgencia)}
            />
          ))
        )}
      </View>

      {/* Leituras Recentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leituras Recentes</Text>
        {leituras.slice(0, 5).map((leitura) => (
          <Card
            key={leitura.id_leitura}
            title={`Sensor ${leitura.id_sensor}`}
            subtitle={formatarData(leitura.data_hora)}
          >
            <Text style={styles.valorLeitura}>
              Valor: {leitura.valor_lido}
            </Text>
          </Card>
        ))}
      </View>

      {/* Eventos Recentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos Recentes</Text>
        {eventosRecentes.slice(0, 3).map((evento) => (
          <Card
            key={evento.id_evento}
            title={evento.tipo_evento}
            subtitle={`Risco: ${evento.nivel_risco} • ${formatarData(evento.data_evento)}`}
            status={getAlertaStatus(evento.nivel_risco)}
          >
            <Text style={styles.detalhes}>{evento.detalhes}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 16,
    marginBottom: 12,
  },
  valorLeitura: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detalhes: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
}); 