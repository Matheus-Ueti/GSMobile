import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const PreferenciasScreen: React.FC = () => {
  const [temaBruto, setTemaBruto] = useState(false);
  const [modoOffline, setModoOffline] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [salvarLocalBackup, setSalvarLocalBackup] = useState(true);
  const [compressaoDados, setCompressaoDados] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [intervaloAtualizacao, setIntervaloAtualizacao] = useState('30s');

  const intervalos = [
    { label: '10 segundos', valor: '10s' },
    { label: '30 segundos', valor: '30s' },
    { label: '1 minuto', valor: '1m' },
    { label: '5 minutos', valor: '5m' },
  ];

  const temas = [
    { label: 'Padrão EcoSafe', valor: 'padrao' },
    { label: 'Tema Escuro', valor: 'escuro' },
    { label: 'Alto Contraste', valor: 'contraste' },
  ];

  const configuracoes = [
    {
      titulo: 'Tema Escuro',
      descricao: 'Interface com cores escuras',
      valor: temaBruto,
      onChange: setTemaBruto,
      icone: 'moon'
    },
    {
      titulo: 'Modo Offline',
      descricao: 'Trabalhar sem internet',
      valor: modoOffline,
      onChange: setModoOffline,
      icone: 'cloud-offline'
    },
    {
      titulo: 'Sincronização Automática',
      descricao: 'Atualizar dados automaticamente',
      valor: autoSync,
      onChange: setAutoSync,
      icone: 'sync'
    },
    {
      titulo: 'Backup Local',
      descricao: 'Salvar dados no celular',
      valor: salvarLocalBackup,
      onChange: setSalvarLocalBackup,
      icone: 'save'
    },
    {
      titulo: 'Compressão de Dados',
      descricao: 'Economizar banda de internet',
      valor: compressaoDados,
      onChange: setCompressaoDados,
      icone: 'contract'
    },
    {
      titulo: 'Modo Desenvolvedor',
      descricao: 'Mostrar logs de debug',
      valor: debugMode,
      onChange: setDebugMode,
      icone: 'code-slash'
    },
  ];

  const selecionarIntervalo = () => {
    Alert.alert(
      'Intervalo de Atualização',
      'Escolha com que frequência buscar novos dados',
      intervalos.map(intervalo => ({
        text: intervalo.label,
        onPress: () => {
          setIntervaloAtualizacao(intervalo.valor);
          Alert.alert('Atualizado!', `Intervalo definido para ${intervalo.label}`);
        }
      }))
    );
  };

  const selecionarTema = () => {
    Alert.alert(
      'Tema do App',
      'Escolha a aparência do EcoSafe',
      temas.map(tema => ({
        text: tema.label,
        onPress: () => Alert.alert('Tema Alterado!', `Tema ${tema.label} ativado`)
      }))
    );
  };

  const resetarConfiguracoes = () => {
    Alert.alert(
      'Resetar Configurações',
      'Isso vai voltar tudo pro padrão. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetar', 
          style: 'destructive', 
          onPress: () => {
            setTemaBruto(false);
            setModoOffline(false);
            setAutoSync(true);
            setSalvarLocalBackup(true);
            setCompressaoDados(false);
            setDebugMode(false);
            setIntervaloAtualizacao('30s');
            Alert.alert('Pronto!', 'Configurações resetadas');
          }
        }
      ]
    );
  };

  const exportarConfiguracoes = () => {
    Alert.alert('Exportado!', 'Configurações salvas no arquivo config_ecosafe.json');
  };

  const importarConfiguracoes = () => {
    Alert.alert('Importar', 'Escolha um arquivo de configuração para carregar');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={40} color={COLORS.primary} />
        <Text style={styles.titulo}>Preferências</Text>
        <Text style={styles.subtitulo}>Personalize como o app funciona</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Configurações Gerais</Text>
        {configuracoes.map((config, index) => (
          <View key={index} style={styles.configItem}>
            <View style={styles.configLeft}>
              <Ionicons name={config.icone as any} size={24} color={COLORS.primary} />
              <View style={styles.configTextos}>
                <Text style={styles.configTitulo}>{config.titulo}</Text>
                <Text style={styles.configDescricao}>{config.descricao}</Text>
              </View>
            </View>
            <Switch
              value={config.valor}
              onValueChange={config.onChange}
              trackColor={{ false: COLORS.background, true: COLORS.primary }}
              thumbColor={config.valor ? COLORS.surface : COLORS.textSecondary}
            />
          </View>
        ))}
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Configurações Avançadas</Text>
        
        <TouchableOpacity style={styles.opcaoBtn} onPress={selecionarIntervalo}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Intervalo de Atualização</Text>
            <Text style={styles.opcaoValor}>Atual: {intervalos.find(i => i.valor === intervaloAtualizacao)?.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcaoBtn} onPress={selecionarTema}>
          <Ionicons name="color-palette" size={20} color={COLORS.primary} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Tema da Interface</Text>
            <Text style={styles.opcaoValor}>Atual: Padrão EcoSafe</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcaoBtn} onPress={() => Alert.alert('Cache', 'Cache limpo com sucesso!')}>
          <Ionicons name="trash" size={20} color={COLORS.warning} />
          <View style={styles.opcaoTextos}>
            <Text style={styles.opcaoTitulo}>Limpar Cache</Text>
            <Text style={styles.opcaoValor}>Liberar espaço de armazenamento</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Backup e Importação</Text>
        
        <TouchableOpacity style={styles.acaoBtn} onPress={exportarConfiguracoes}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
          <Text style={styles.acaoTexto}>Exportar Configurações</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acaoBtn} onPress={importarConfiguracoes}>
          <Ionicons name="cloud-upload" size={20} color={COLORS.primary} />
          <Text style={styles.acaoTexto}>Importar Configurações</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.acaoBtnDanger} onPress={resetarConfiguracoes}>
          <Ionicons name="refresh" size={20} color={COLORS.danger} />
          <Text style={styles.acaoTextoDanger}>Resetar Tudo</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
        <View style={styles.infoTextos}>
          <Text style={styles.infoTitulo}>Status do Sistema</Text>
          <Text style={styles.infoDescricao}>
            • Versão: 1.0.0{'\n'}
            • Build: 2024.01.15{'\n'}
            • Armazenamento: 45MB usado{'\n'}
            • Última sync: Agora
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  secao: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  configLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  configTextos: {
    marginLeft: 15,
    flex: 1,
  },
  configTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  configDescricao: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  opcaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  opcaoTextos: {
    flex: 1,
    marginLeft: 15,
  },
  opcaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  opcaoValor: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  acaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  acaoBtnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  acaoTexto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  acaoTextoDanger: {
    flex: 1,
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTextos: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoDescricao: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
}); 