import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../constants/colors';
import { MOCK_SENSORES } from '../services/mockData';
import { Sensor } from '../types';

type StatusSensor = 'ativo' | 'inativo' | 'manutenção';

export const SensoresScreen: React.FC = () => {
  // Estados básicos
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  
  // Estados do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    localizacao: '',
    unidade_medida: '',
    status: 'ativo' as StatusSensor
  });

  // Carregamento dos dados
  const carregarDados = async () => {
    try {
      setSensores(MOCK_SENSORES);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar sensores');
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
  const abrirModal = (sensor?: Sensor) => {
    if (sensor) {
      setEditingSensor(sensor);
      setFormData({
        tipo: sensor.tipo,
        localizacao: sensor.localizacao,
        unidade_medida: sensor.unidade_medida,
        status: sensor.status as StatusSensor,
      });
    } else {
      setEditingSensor(null);
      setFormData({
        tipo: '',
        localizacao: '',
        unidade_medida: '',
        status: 'ativo',
      });
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setEditingSensor(null);
  };

  const salvarSensor = () => {
    if (!formData.tipo || !formData.localizacao || !formData.unidade_medida) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const mensagem = editingSensor ? 'Sensor atualizado!' : 'Sensor criado!';
    Alert.alert('Sucesso', mensagem);
    fecharModal();
    carregarDados();
  };

  const excluirSensor = (sensor: Sensor) => {
    Alert.alert(
      'Confirmar',
      `Excluir sensor "${sensor.tipo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          Alert.alert('Sucesso', 'Sensor excluído!');
          carregarDados();
        }}
      ]
    );
  };

  // Funções auxiliares
  const obterStatusCor = (status: string) => {
    if (status === 'ativo') return 'success';
    if (status === 'inativo') return 'danger';
    if (status === 'manutenção') return 'warning';
    return 'normal';
  };

  // Dados para os seletores
  const tiposSensor = ['Temperatura', 'Umidade', 'Pressão', 'CO2', 'Luz'];
  const unidadesMedida = ['°C', '%', 'Pa', 'ppm', 'lux', 'mg/L'];
  const statusOpcoes: StatusSensor[] = ['ativo', 'inativo', 'manutenção'];

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return <Loading message="Carregando sensores..." />;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Sensores</Text>
        <TouchableOpacity style={styles.botaoAdicionar} onPress={() => abrirModal()}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView
        style={styles.lista}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizarLista} />}
      >
        {sensores.map((sensor) => (
          <Card
            key={sensor.id_sensor}
            title={sensor.tipo}
            subtitle={`${sensor.localizacao} • ${sensor.unidade_medida}`}
            status={obterStatusCor(sensor.status)}
            onPress={() => abrirModal(sensor)}
          >
            <View style={styles.infoSensor}>
              <Text style={styles.textoStatus}>
                Status: {sensor.status.toUpperCase()}
              </Text>
              <TouchableOpacity onPress={() => excluirSensor(sensor)}>
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            
            {/* Cabeçalho do Modal */}
            <View style={styles.headerModal}>
              <Text style={styles.tituloModal}>
                {editingSensor ? 'Editar' : 'Novo'} Sensor
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.corpoModal}>
              
              {/* Tipos Predefinidos */}
              <Text style={styles.label}>Tipo do Sensor</Text>
              <View style={styles.gridTipos}>
                {tiposSensor.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.botaoTipo,
                      formData.tipo === tipo && styles.botaoTipoSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, tipo })}
                  >
                    <Text style={[
                      styles.textoTipo,
                      formData.tipo === tipo && styles.textoTipoSelecionado,
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tipo Personalizado */}
              <Text style={styles.label}>Ou digite um tipo:</Text>
              <TextInput
                style={styles.campoTexto}
                value={formData.tipo}
                onChangeText={(text) => setFormData({ ...formData, tipo: text })}
                placeholder="Ex: pH, Oxigênio..."
              />

              {/* Campo Localização */}
              <Text style={styles.label}>Localização</Text>
              <TextInput
                style={styles.campoTexto}
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                placeholder="Ex: Sala A, Estação 01..."
              />

              {/* Unidades Predefinidas */}
              <Text style={styles.label}>Unidade de Medida</Text>
              <View style={styles.gridUnidades}>
                {unidadesMedida.map((unidade) => (
                  <TouchableOpacity
                    key={unidade}
                    style={[
                      styles.botaoUnidade,
                      formData.unidade_medida === unidade && styles.botaoUnidadeSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, unidade_medida: unidade })}
                  >
                    <Text style={[
                      styles.textoUnidade,
                      formData.unidade_medida === unidade && styles.textoUnidadeSelecionado,
                    ]}>
                      {unidade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Unidade Personalizada */}
              <Text style={styles.label}>Ou digite uma unidade:</Text>
              <TextInput
                style={styles.campoTexto}
                value={formData.unidade_medida}
                onChangeText={(text) => setFormData({ ...formData, unidade_medida: text })}
                placeholder="Ex: m/s, kg/m³..."
              />

              {/* Status */}
              <Text style={styles.label}>Status</Text>
              <View style={styles.gridStatus}>
                {statusOpcoes.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.botaoStatus,
                      formData.status === status && styles.botaoStatusSelecionado,
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text style={[
                      styles.textoStatus,
                      formData.status === status && styles.textoStatusSelecionado,
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarSensor}>
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
  infoSensor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  textoStatus: {
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
  campoTexto: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  // Seletores
  gridTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoTipo: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: '30%',
    alignItems: 'center',
  },
  botaoTipoSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoTipo: {
    fontSize: 14,
    color: COLORS.text,
  },
  textoTipoSelecionado: {
    color: 'white',
  },

  gridUnidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoUnidade: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: '25%',
    alignItems: 'center',
  },
  botaoUnidadeSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoUnidade: {
    fontSize: 14,
    color: COLORS.text,
  },
  textoUnidadeSelecionado: {
    color: 'white',
  },

  gridStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botaoStatus: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botaoStatusSelecionado: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textoStatusSelecionado: {
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