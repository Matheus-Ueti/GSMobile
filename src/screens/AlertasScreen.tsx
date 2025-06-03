import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MOCK_ALERTAS, MOCK_EVENTOS } from '../services/mockData';
import { Alerta, Evento } from '../types';
import { COLORS } from '../constants/colors';

export const AlertasScreen: React.FC = () => {
  // Estados básicos
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  
  // Estados do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlerta, setEditingAlerta] = useState<Alerta | null>(null);
  const [formData, setFormData] = useState({
    id_evento: 0,
    mensagem: '',
    nivel_urgencia: 'baixo',
  });
  const carregarDados = async () => {
    try {
      setAlertas(MOCK_ALERTAS);
      setEventos(MOCK_EVENTOS);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const atualizarLista = () => {
    setRefreshing(true);
    carregarDados();
  };

  // Gerenciamento do modal
  const abrirModal = (alerta?: Alerta) => {
    if (alerta) {
      setEditingAlerta(alerta);
      setFormData({
        id_evento: alerta.id_evento,
        mensagem: alerta.mensagem,
        nivel_urgencia: alerta.nivel_urgencia,
      });
    } else {
      setEditingAlerta(null);
      setFormData({
        id_evento: eventos.length > 0 ? eventos[0].id_evento : 0,
        mensagem: '',
        nivel_urgencia: 'baixo',
      });
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setEditingAlerta(null);
  };

  const salvarAlerta = () => {
    if (!formData.mensagem || formData.id_evento === 0) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const mensagem = editingAlerta ? 'Alerta atualizado!' : 'Alerta criado!';
    Alert.alert('Sucesso', mensagem);
    fecharModal();
    carregarDados();
  };

  const excluirAlerta = (alerta: Alerta) => {
    Alert.alert(
      'Confirmar',
      'Excluir este alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          Alert.alert('Sucesso', 'Alerta excluído!');
          carregarDados();
        }}
      ]
    );
  };

  // Funções auxiliares
  const obterStatusCor = (nivel: string) => {
    if (nivel === 'crítico') return 'danger';
    if (nivel === 'alto') return 'warning';
    if (nivel === 'médio') return 'warning';
    return 'normal';
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const obterEvento = (id: number) => {
    return eventos.find(evento => evento.id_evento === id);
  };

  // Dados para os seletores
  const niveisUrgencia = ['baixo', 'médio', 'alto', 'crítico'];

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return <Loading message="Carregando alertas..." />;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Alertas</Text>
        <TouchableOpacity style={styles.botaoAdicionar} onPress={() => abrirModal()}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView
        style={styles.lista}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizarLista} />}
      >
        {alertas.map((alerta) => {
          const evento = obterEvento(alerta.id_evento);
          return (
            <Card
              key={alerta.id_alerta}
              title={alerta.mensagem}
              subtitle={`${evento?.tipo_evento || 'Evento'} • ${formatarData(alerta.data_hora)}`}
              status={obterStatusCor(alerta.nivel_urgencia)}
              onPress={() => abrirModal(alerta)}
            >
              <View style={styles.infoAlerta}>
                <View style={styles.detalhesAlerta}>
                  <Text style={styles.nivelUrgencia}>
                    Urgência: {alerta.nivel_urgencia.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => excluirAlerta(alerta)}>
                  <Ionicons name="trash" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            
            {/* Cabeçalho do Modal */}
            <View style={styles.headerModal}>
              <Text style={styles.tituloModal}>
                {editingAlerta ? 'Editar' : 'Novo'} Alerta
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.corpoModal}>
              
              {/* Seletor de Evento */}
              <Text style={styles.label}>Evento</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {eventos.map((evento) => (
                  <TouchableOpacity
                    key={evento.id_evento}
                    style={[
                      styles.chipEvento,
                      formData.id_evento === evento.id_evento && styles.chipEventoSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, id_evento: evento.id_evento })}
                  >
                    <Text style={[
                      styles.textoChipEvento,
                      formData.id_evento === evento.id_evento && styles.textoChipEventoSelecionado,
                    ]}>
                      {evento.tipo_evento}
                    </Text>
                    <Text style={[
                      styles.subtextoChipEvento,
                      formData.id_evento === evento.id_evento && styles.textoChipEventoSelecionado,
                    ]}>
                      {evento.nivel_risco}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Campo Mensagem */}
              <Text style={styles.label}>Mensagem</Text>
              <TextInput
                style={styles.areaTexto}
                value={formData.mensagem}
                onChangeText={(text) => setFormData({ ...formData, mensagem: text })}
                placeholder="Descreva o alerta..."
                multiline
                numberOfLines={3}
              />

              {/* Seletor de Urgência */}
              <Text style={styles.label}>Nível de Urgência</Text>
              <View style={styles.gridUrgencia}>
                {niveisUrgencia.map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.botaoUrgencia,
                      formData.nivel_urgencia === nivel && styles.botaoUrgenciaSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, nivel_urgencia: nivel })}
                  >
                    <Text style={[
                      styles.textoUrgencia,
                      formData.nivel_urgencia === nivel && styles.textoUrgenciaSelecionado,
                    ]}>
                      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Botões */}
            <View style={styles.acoesModal}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={fecharModal}>
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlerta}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos organizados
const styles = StyleSheet.create({
  // Principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  botaoAdicionar: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
  },

  // Lista
  lista: {
    flex: 1,
  },
  infoAlerta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  detalhesAlerta: {
    flex: 1,
  },
  nivelUrgencia: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  // Modal
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteudoModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '85%',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  corpoModal: {
    padding: 16,
  },

  // Formulário
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '500',
  },
  areaTexto: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Chips de evento
  chipEvento: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 120,
  },
  chipEventoSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoChipEvento: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  subtextoChipEvento: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  textoChipEventoSelecionado: {
    color: 'white',
  },

  // Seletor de urgência
  gridUrgencia: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoUrgencia: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botaoUrgenciaSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoUrgencia: {
    fontSize: 14,
    color: COLORS.text,
  },
  textoUrgenciaSelecionado: {
    color: 'white',
  },

  // Botões do modal
  acoesModal: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  botaoCancelar: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    fontSize: 16,
    color: '#666',
  },
  botaoSalvar: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  textoBotaoSalvar: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
}); 