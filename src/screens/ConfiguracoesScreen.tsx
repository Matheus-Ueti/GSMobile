import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { COLORS } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

export const ConfiguracoesScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o EcoSafe',
      'EcoSafe v1.0\n\nSistema completo de monitoramento ambiental em tempo real, voltado à prevenção de enchentes, incêndios florestais e ventos fortes.\n\nDesenvolvido como projeto acadêmico para a disciplina de Mobile Application Development.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Ajuda',
      'Como usar o EcoSafe:\n\n• Dashboard: Visualize resumo dos alertas e leituras\n• Sensores: Gerencie sensores ambientais\n• Alertas: Crie e monitore alertas\n• Eventos: Registre eventos ambientais\n\nPara mais informações, consulte a documentação.',
      [{ text: 'OK' }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      'Contato',
      'Entre em contato conosco:\n\nEmail: suporte@ecosafe.com\nTelefone: (11) 99999-9999\n\nEquipe de desenvolvimento:\n• Desenvolvedor Mobile\n• Analista de Sistemas',
      [{ text: 'OK' }]
    );
  };

  const handleAPIConfig = () => {
    Alert.alert(
      'Configuração da API',
      'URL atual: http://localhost:8080/api\n\nPara alterar a URL da API, acesse o arquivo src/services/api.ts e modifique a constante API_BASE_URL.',
      [{ text: 'OK' }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notificações',
      'As notificações push estão em desenvolvimento.\n\nEm breve você poderá receber alertas em tempo real sobre eventos ambientais críticos.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Política de Privacidade',
      'O EcoSafe respeita sua privacidade:\n\n• Dados coletados apenas para fins de monitoramento ambiental\n• Informações armazenadas com segurança\n• Não compartilhamos dados com terceiros\n• Acesso aos dados restrito a usuários autorizados',
      [{ text: 'OK' }]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Backup de Dados',
      'Funcionalidade em desenvolvimento.\n\nEm breve você poderá fazer backup dos dados de sensores, eventos e alertas.',
      [{ text: 'OK' }]
    );
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/seu-usuario/ecosafe-mobile');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      {/* Informações do Usuário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usuário</Text>
        
        <Card title={user?.nome || 'Usuário'} subtitle={user?.email}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userStatus}>● Online</Text>
            </View>
          </View>
        </Card>

        <Card title="Sair" onPress={handleLogout} status="danger">
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Fazer logout do aplicativo
            </Text>
            <Ionicons name="log-out" size={20} color={COLORS.danger} />
          </View>
        </Card>
      </View>

      {/* Informações do App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        
        <Card title="Sobre o EcoSafe" onPress={handleAbout}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Versão, informações do desenvolvedor e detalhes do projeto
            </Text>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          </View>
        </Card>

        <Card title="Ajuda" onPress={handleHelp}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Como usar o aplicativo e suas funcionalidades
            </Text>
            <Ionicons name="help-circle" size={20} color={COLORS.primary} />
          </View>
        </Card>

        <Card title="Contato" onPress={handleContact}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Entre em contato com a equipe de desenvolvimento
            </Text>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
          </View>
        </Card>
      </View>

      {/* Configurações Técnicas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações Técnicas</Text>
        
        <Card title="Configuração da API" onPress={handleAPIConfig}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              URL do servidor backend e configurações de conexão
            </Text>
            <Ionicons name="server" size={20} color={COLORS.primary} />
          </View>
        </Card>

        <Card title="Notificações" onPress={handleNotifications}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Configurar alertas e notificações push
            </Text>
            <Ionicons name="notifications" size={20} color={COLORS.warning} />
          </View>
        </Card>

        <Card title="Backup de Dados" onPress={handleBackup}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Fazer backup dos dados locais
            </Text>
            <Ionicons name="cloud-upload" size={20} color={COLORS.warning} />
          </View>
        </Card>
      </View>

      {/* Privacidade e Segurança */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidade</Text>
        
        <Card title="Política de Privacidade" onPress={handlePrivacy}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Como seus dados são coletados e utilizados
            </Text>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
          </View>
        </Card>
      </View>

      {/* Links Externos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        
        <Card title="Código Fonte" onPress={openGitHub}>
          <View style={styles.optionContent}>
            <Text style={styles.optionDescription}>
              Acesse o código fonte no GitHub
            </Text>
            <Ionicons name="logo-github" size={20} color={COLORS.text} />
          </View>
        </Card>
      </View>

      {/* Status do Sistema */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status do Sistema</Text>
        
        <Card title="Status dos Serviços" status="success">
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.statusText}>API Backend</Text>
              <Text style={styles.statusValue}>Online</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.statusText}>Banco de Dados</Text>
              <Text style={styles.statusValue}>Conectado</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="time" size={16} color={COLORS.warning} />
              <Text style={styles.statusText}>Última Sincronização</Text>
              <Text style={styles.statusValue}>Agora</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Informações Técnicas */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>EcoSafe Mobile v1.0</Text>
        <Text style={styles.footerText}>React Native • Expo • TypeScript</Text>
        <Text style={styles.footerText}>Desenvolvido para Mobile Application Development</Text>
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
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userStatus: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 