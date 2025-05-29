import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const NotificacoesScreen: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [alertasCriticos, setAlertasCriticos] = useState(true);
  const [alertasNormais, setAlertasNormais] = useState(true);
  const [novosEventos, setNovosEventos] = useState(false);
  const [relatorios, setRelatorios] = useState(true);

  const configuracoes = [
    {
      titulo: 'Push Notifications',
      descricao: 'Notificações no celular',
      valor: pushNotifications,
      onChange: setPushNotifications,
      icone: 'phone-portrait'
    },
    {
      titulo: 'Email',
      descricao: 'Notificações por email',
      valor: emailNotifications,
      onChange: setEmailNotifications,
      icone: 'mail'
    },
    {
      titulo: 'Alertas Críticos',
      descricao: 'Sensores com valores perigosos',
      valor: alertasCriticos,
      onChange: setAlertasCriticos,
      icone: 'warning'
    },
    {
      titulo: 'Alertas Normais',
      descricao: 'Todos os outros alertas',
      valor: alertasNormais,
      onChange: setAlertasNormais,
      icone: 'information-circle'
    },
    {
      titulo: 'Novos Eventos',
      descricao: 'Quando eventos são criados',
      valor: novosEventos,
      onChange: setNovosEventos,
      icone: 'calendar'
    },
    {
      titulo: 'Relatórios',
      descricao: 'Relatórios semanais e mensais',
      valor: relatorios,
      onChange: setRelatorios,
      icone: 'document-text'
    },
  ];

  const historico = [
    {
      id: 1,
      titulo: 'Alerta Crítico',
      descricao: 'Sensor de temperatura com valor alto',
      tempo: '2 min atrás',
      icone: 'warning',
      cor: COLORS.danger,
      lida: false
    },
    {
      id: 2,
      titulo: 'Novo Evento',
      descricao: 'Evento de chuva registrado',
      tempo: '15 min atrás',
      icone: 'calendar',
      cor: COLORS.primary,
      lida: false
    },
    {
      id: 3,
      titulo: 'Relatório Semanal',
      descricao: 'Relatório da semana disponível',
      tempo: '1 hora atrás',
      icone: 'document-text',
      cor: COLORS.secondary,
      lida: true
    },
    {
      id: 4,
      titulo: 'Sensor Offline',
      descricao: 'Sensor #12 não está respondendo',
      tempo: '3 horas atrás',
      icone: 'hardware-chip',
      cor: COLORS.warning,
      lida: true
    },
    {
      id: 5,
      titulo: 'Backup Concluído',
      descricao: 'Backup dos dados realizado com sucesso',
      tempo: '1 dia atrás',
      icone: 'cloud-upload',
      cor: COLORS.success,
      lida: true
    },
  ];

  const marcarTodasComoLidas = () => {
    Alert.alert('Sucesso!', 'Todas as notificações foram marcadas como lidas');
  };

  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que quer apagar todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => Alert.alert('Pronto!', 'Histórico limpo') }
      ]
    );
  };

  const testarNotificacao = () => {
    Alert.alert('Teste!', 'Notificação de teste enviada');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={40} color={COLORS.primary} />
        <Text style={styles.titulo}>Notificações</Text>
        <Text style={styles.subtitulo}>Configure como quer receber os alertas</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Configurações</Text>
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
        <View style={styles.headerSecao}>
          <Text style={styles.tituloSecao}>Ações Rápidas</Text>
        </View>
        
        <TouchableOpacity style={styles.acaoBtn} onPress={testarNotificacao}>
          <Ionicons name="flash" size={20} color={COLORS.primary} />
          <Text style={styles.acaoTexto}>Enviar Teste</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acaoBtn} onPress={marcarTodasComoLidas}>
          <Ionicons name="checkmark-done" size={20} color={COLORS.success} />
          <Text style={styles.acaoTexto}>Marcar Todas como Lidas</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.acaoBtnDanger} onPress={limparHistorico}>
          <Ionicons name="trash" size={20} color={COLORS.danger} />
          <Text style={styles.acaoTextoDanger}>Limpar Histórico</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Histórico</Text>
        {historico.map((notif) => (
          <View key={notif.id} style={[styles.notifItem, !notif.lida && styles.naoLida]}>
            <View style={[styles.iconeBg, { backgroundColor: `${notif.cor}20` }]}>
              <Ionicons name={notif.icone as any} size={20} color={notif.cor} />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitulo}>{notif.titulo}</Text>
              <Text style={styles.notifDescricao}>{notif.descricao}</Text>
              <Text style={styles.notifTempo}>{notif.tempo}</Text>
            </View>
            {!notif.lida && <View style={styles.indicadorNaoLida} />}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTexto}>
          💡 Dica: Mantenha as notificações críticas ativadas para não perder alertas importantes
        </Text>
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
  headerSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    position: 'relative',
  },
  naoLida: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconeBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notifContent: {
    flex: 1,
  },
  notifTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notifDescricao: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  notifTempo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  indicadorNaoLida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  footer: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  footerTexto: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 