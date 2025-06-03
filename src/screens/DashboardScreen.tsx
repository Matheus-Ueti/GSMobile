import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, StyleSheet } from 'react-native';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../constants/colors';
import { MOCK_LEITURAS, MOCK_ALERTAS, MOCK_EVENTOS } from '../services/mockData';
import { LeituraSensor, Alerta, Evento } from '../types';

// Tela principal do app - aqui mostra um resumo de tudo
export const DashboardScreen: React.FC = () => {
  // Estados básicos (aprendi que useState é para guardar dados que mudam)
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leituras, setLeituras] = useState<LeituraSensor[]>([]);
  const [alertasAtivos, setAlertasAtivos] = useState<Alerta[]>([]);
  const [eventosRecentes, setEventosRecentes] = useState<Evento[]>([]);

  // Função para carregar os dados da tela
  const carregarDados = async () => {
    try {
      // Pego só os 5 primeiros para não sobrecarregar a tela
      setLeituras(MOCK_LEITURAS.slice(0, 5));
      setAlertasAtivos(MOCK_ALERTAS);
      setEventosRecentes(MOCK_EVENTOS.slice(0, 3));
    } catch (error) {
      // Se der erro, mostro uma mensagem para o usuário
      Alert.alert('Ops!', 'Erro ao carregar dados');
    } finally {
      // Sempre executa, deu certo ou não
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para quando o usuário puxa para baixo para atualizar
  const atualizarDados = () => {
    setRefreshing(true);
    carregarDados();
  };

  // Função que escolhe a cor baseada no nível de risco/urgência
  const obterCorDoStatus = (nivel: string) => {
    // Uso if/else porque acho mais fácil de entender que switch
    if (nivel === 'crítico' || nivel === 'alto') {
      return 'danger';  // Vermelho para coisas perigosas
    }
    if (nivel === 'médio') {
      return 'warning'; // Amarelo para avisos
    }
    return 'normal';    // Cor normal para o resto
  };

  // Função para deixar a data mais bonita
  const formatarData = (data: string) => {
    // TODO: Melhorar isso aqui, talvez usar uma biblioteca de datas
    return new Date(data).toLocaleString('pt-BR');
  };

  // useEffect executa quando o componente carrega
  useEffect(() => {
    carregarDados();
  }, []); // Array vazio significa que executa só uma vez

  // Se ainda está carregando, mostro a tela de loading
  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  // Aqui é o que aparece na tela
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizarDados} />}
    >
      {/* Cabeçalho da tela */}
      <Text style={styles.titulo}>EcoSafe Dashboard</Text>
      <Text style={styles.subtitulo}>Monitoramento Ambiental em Tempo Real</Text>

      {/* Seção de Alertas */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>
          Alertas Ativos ({alertasAtivos.length})
        </Text>
        {alertasAtivos.length === 0 ? (
          // Se não tem alertas, mostro que está tudo ok
          <Card 
            title="Nenhum alerta ativo" 
            subtitle="Sistema funcionando normalmente" 
            status="success" 
          />
        ) : (
          // Se tem alertas, mostro os 3 primeiros
          alertasAtivos.slice(0, 3).map((alerta) => (
            <Card
              key={alerta.id_alerta}
              title={alerta.mensagem}
              subtitle={`Urgência: ${alerta.nivel_urgencia} • ${formatarData(alerta.data_hora)}`}
              status={obterCorDoStatus(alerta.nivel_urgencia)}
            />
          ))
        )}
      </View>

      {/* Seção de Leituras */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Leituras Recentes</Text>
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

      {/* Seção de Eventos */}
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Eventos Recentes</Text>
        {eventosRecentes.slice(0, 3).map((evento) => (
          <Card
            key={evento.id_evento}
            title={evento.tipo_evento}
            subtitle={`Risco: ${evento.nivel_risco} • ${formatarData(evento.data_evento)}`}
            status={obterCorDoStatus(evento.nivel_risco)}
          >
            <Text style={styles.detalhes}>{evento.detalhes}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

// ESTILOS - Tentei organizar por seções para ficar mais fácil de entender
const styles = StyleSheet.create({
  // Estilo principal da tela
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Estilos do cabeçalho
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Estilos das seções
  secao: {
    marginBottom: 24,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 16,
    marginBottom: 12,
  },

  // Estilos do conteúdo dos cards
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

  // FIXME: Acho que poderia melhorar o espaçamento entre os elementos
  // TODO: Talvez adicionar mais cores diferentes para cada tipo de status
}); 