import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { MOCK_EVENTOS, MOCK_LOCAIS } from '../services/mockData';
import { Evento, Local } from '../types';
import { COLORS } from '../constants/colors';

export const EventosScreen: React.FC = () => {
  // Estados básicos
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  
  // Estados do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [formData, setFormData] = useState({
    tipo_evento: '',
    id_local: 0,
    nivel_risco: 'baixo',
    detalhes: '',
  });

  // Carregamento dos dados
  const carregarDados = async () => {
    try {
      setEventos(MOCK_EVENTOS);
      setLocais(MOCK_LOCAIS);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar eventos');
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
  const abrirModal = (evento?: Evento) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        tipo_evento: evento.tipo_evento,
        id_local: evento.id_local,
        nivel_risco: evento.nivel_risco,
        detalhes: evento.detalhes,
      });
    } else {
      setEditingEvento(null);
      setFormData({
        tipo_evento: '',
        id_local: locais.length > 0 ? locais[0].id_local : 0,
        nivel_risco: 'baixo',
        detalhes: '',
      });
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setEditingEvento(null);
  };

  const salvarEvento = () => {
    if (!formData.tipo_evento || formData.id_local === 0) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const mensagem = editingEvento ? 'Evento atualizado!' : 'Evento criado!';
    Alert.alert('Sucesso', mensagem);
    fecharModal();
    carregarDados();
  };

  const excluirEvento = (evento: Evento) => {
    Alert.alert(
      'Confirmar',
      `Excluir "${evento.tipo_evento}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          Alert.alert('Sucesso', 'Evento excluído!');
          carregarDados();
        }}
      ]
    );
  };

  // Funções auxiliares
  const obterStatusCor = (nivel: string) => {
    if (nivel === 'crítico' || nivel === 'alto') return 'danger';
    if (nivel === 'médio') return 'warning';
    if (nivel === 'baixo') return 'success';
    return 'normal';
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const obterLocal = (id: number) => {
    return locais.find(local => local.id_local === id);
  };

  const obterIcone = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('enchente')) return 'water';
    if (tipoLower.includes('incêndio')) return 'flame';
    if (tipoLower.includes('vento')) return 'cloudy';
    return 'warning';
  };

  // Dados para os seletores
  const tiposEvento = ['Enchente', 'Incêndio Florestal', 'Vento Forte', 'Tempestade'];
  const niveisRisco = ['baixo', 'médio', 'alto', 'crítico'];

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return <Loading message="Carregando eventos..." />;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Eventos</Text>
        <TouchableOpacity style={styles.botaoAdicionar} onPress={() => abrirModal()}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView
        style={styles.lista}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizarLista} />}
      >
        {eventos.map((evento) => {
          const local = obterLocal(evento.id_local);
          return (
            <Card
              key={evento.id_evento}
              title={evento.tipo_evento}
              subtitle={`${local?.nome || 'Local'} • ${formatarData(evento.data_evento)}`}
              status={obterStatusCor(evento.nivel_risco)}
              onPress={() => abrirModal(evento)}
            >
              <View style={styles.infoEvento}>
                <View style={styles.detalhesEvento}>
                  <View style={styles.containerRisco}>
                    <Ionicons name={obterIcone(evento.tipo_evento)} size={16} color={COLORS.textSecondary} />
                    <Text style={styles.textoRisco}>
                      {evento.nivel_risco.toUpperCase()}
                    </Text>
                  </View>
                  {evento.detalhes && (
                    <Text style={styles.textoDetalhes} numberOfLines={2}>
                      {evento.detalhes}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => excluirEvento(evento)}>
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
                {editingEvento ? 'Editar' : 'Novo'} Evento
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.corpoModal}>
              
              {/* Seletor de Tipo */}
              <Text style={styles.label}>Tipo de Evento</Text>
              <View style={styles.gridTipos}>
                {tiposEvento.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.botaoTipo,
                      formData.tipo_evento === tipo && styles.botaoTipoSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, tipo_evento: tipo })}
                  >
                    <Ionicons 
                      name={obterIcone(tipo)} 
                      size={18} 
                      color={formData.tipo_evento === tipo ? 'white' : COLORS.text} 
                    />
                    <Text style={[
                      styles.textoTipo,
                      formData.tipo_evento === tipo && styles.textoTipoSelecionado,
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Campo Personalizado */}
              <Text style={styles.label}>Ou digite um tipo:</Text>
              <TextInput
                style={styles.campoTexto}
                value={formData.tipo_evento}
                onChangeText={(text) => setFormData({ ...formData, tipo_evento: text })}
                placeholder="Ex: Deslizamento, Seca..."
              />

              {/* Seletor de Local */}
              <Text style={styles.label}>Local</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {locais.map((local) => (
                  <TouchableOpacity
                    key={local.id_local}
                    style={[
                      styles.chipLocal,
                      formData.id_local === local.id_local && styles.chipLocalSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, id_local: local.id_local })}
                  >
                    <Text style={[
                      styles.textoChipLocal,
                      formData.id_local === local.id_local && styles.textoChipLocalSelecionado,
                    ]}>
                      {local.nome}
                    </Text>
                    <Text style={[
                      styles.subtextoChipLocal,
                      formData.id_local === local.id_local && styles.textoChipLocalSelecionado,
                    ]}>
                      {local.cidade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Seletor de Risco */}
              <Text style={styles.label}>Nível de Risco</Text>
              <View style={styles.gridRisco}>
                {niveisRisco.map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.botaoRisco,
                      formData.nivel_risco === nivel && styles.botaoRiscoSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, nivel_risco: nivel })}
                  >
                    <Text style={[
                      styles.textoRisco,
                      formData.nivel_risco === nivel && styles.textoRiscoSelecionado,
                    ]}>
                      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Campo Detalhes */}
              <Text style={styles.label}>Detalhes</Text>
              <TextInput
                style={styles.areaTexto}
                value={formData.detalhes}
                onChangeText={(text) => setFormData({ ...formData, detalhes: text })}
                placeholder="Descreva o evento..."
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            {/* Botões */}
            <View style={styles.acoesModal}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={fecharModal}>
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarEvento}>
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
  infoEvento: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  detalhesEvento: {
    flex: 1,
  },
  containerRisco: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  textoRisco: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  textoDetalhes: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
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
  campoTexto: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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

  // Seletores
  gridTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: '45%',
  },
  botaoTipoSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoTipo: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },
  textoTipoSelecionado: {
    color: 'white',
  },

  // Chips de local
  chipLocal: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 120,
  },
  chipLocalSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoChipLocal: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  subtextoChipLocal: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  textoChipLocalSelecionado: {
    color: 'white',
  },

  // Seletor de risco
  gridRisco: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoRisco: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botaoRiscoSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoRiscoSelecionado: {
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