import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const SobreScreen: React.FC = () => {
  const versaoApp = '1.0.0';
  const buildNumber = '2024.01.15';
  const versaoReactNative = '0.73.2';
  const versaoExpo = '50.0.0';

  const desenvolvedores = [
    { nome: 'João Silva', papel: 'Desenvolvedor Frontend', email: 'joao@ecosafe.com' },
    { nome: 'Maria Santos', papel: 'Desenvolvedora Backend', email: 'maria@ecosafe.com' },
    { nome: 'Carlos Oliveira', papel: 'Designer UX/UI', email: 'carlos@ecosafe.com' },
  ];

  const tecnologias = [
    { nome: 'React Native', versao: '0.73.2', icone: 'logo-react' },
    { nome: 'Expo', versao: '50.0.0', icone: 'phone-portrait' },
    { nome: 'TypeScript', versao: '5.3.0', icone: 'code-slash' },
    { nome: 'Java Spring', versao: '3.2.0', icone: 'server' },
    { nome: 'PostgreSQL', versao: '15.0', icone: 'server' },
  ];

  const recursos = [
    { titulo: 'Monitoramento em Tempo Real', icone: 'time' },
    { titulo: 'Sistema de Alertas Inteligente', icone: 'warning' },
    { titulo: 'Gestão de Sensores IoT', icone: 'hardware-chip' },
    { titulo: 'Relatórios Automáticos', icone: 'document-text' },
    { titulo: 'Interface Intuitiva', icone: 'phone-portrait' },
    { titulo: 'Backup de Dados', icone: 'cloud-upload' },
  ];

  const estatisticas = [
    { titulo: 'Sensores Suportados', valor: '500+', icone: 'hardware-chip' },
    { titulo: 'Usuários Ativos', valor: '1,200+', icone: 'people' },
    { titulo: 'Alertas Processados', valor: '10,000+', icone: 'notifications' },
    { titulo: 'Dados Coletados', valor: '50GB+', icone: 'server' },
  ];

  const abrirLink = (url: string) => {
    Linking.openURL(url).catch(() => 
      Alert.alert('Erro', 'Não foi possível abrir o link')
    );
  };

  const enviarEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o cliente de email')
    );
  };

  const compartilharApp = () => {
    Alert.alert('Compartilhar', 'Link do EcoSafe copiado para a área de transferência!');
  };

  const avaliarApp = () => {
    Alert.alert('Avaliação', 'Obrigado pelo feedback! Você será redirecionado para a loja.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.nomeApp}>EcoSafe</Text>
        <Text style={styles.tagline}>Sistema de Monitoramento Ambiental</Text>
        <Text style={styles.versao}>Versão {versaoApp} • Build {buildNumber}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Sobre o Projeto</Text>
        <View style={styles.descricaoCard}>
          <Text style={styles.descricaoTexto}>
            O EcoSafe é um sistema completo de monitoramento ambiental desenvolvido para detectar e alertar sobre riscos ambientais como enchentes, incêndios florestais e ventos fortes.
          </Text>
          <Text style={styles.descricaoTexto}>
            Criado como projeto acadêmico para a disciplina de Desenvolvimento Mobile, o app integra sensores IoT com uma interface moderna e intuitiva.
          </Text>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Recursos Principais</Text>
        <View style={styles.recursosGrid}>
          {recursos.map((recurso, index) => (
            <View key={index} style={styles.recursoCard}>
              <Ionicons name={recurso.icone as any} size={24} color={COLORS.primary} />
              <Text style={styles.recursoTexto}>{recurso.titulo}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          {estatisticas.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icone as any} size={28} color={COLORS.primary} />
              <Text style={styles.statValor}>{stat.valor}</Text>
              <Text style={styles.statTitulo}>{stat.titulo}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Tecnologias Utilizadas</Text>
        {tecnologias.map((tech, index) => (
          <View key={index} style={styles.techItem}>
            <Ionicons name={tech.icone as any} size={24} color={COLORS.primary} />
            <View style={styles.techTextos}>
              <Text style={styles.techNome}>{tech.nome}</Text>
              <Text style={styles.techVersao}>v{tech.versao}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Equipe de Desenvolvimento</Text>
        {desenvolvedores.map((dev, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.devItem}
            onPress={() => enviarEmail(dev.email)}
          >
            <View style={styles.devAvatar}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.devTextos}>
              <Text style={styles.devNome}>{dev.nome}</Text>
              <Text style={styles.devPapel}>{dev.papel}</Text>
              <Text style={styles.devEmail}>{dev.email}</Text>
            </View>
            <Ionicons name="mail" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Links e Recursos</Text>
        
        <TouchableOpacity 
          style={styles.linkBtn} 
          onPress={() => abrirLink('https://github.com/ecosafe/mobile')}
        >
          <Ionicons name="logo-github" size={20} color={COLORS.primary} />
          <Text style={styles.linkTexto}>Código Fonte no GitHub</Text>
          <Ionicons name="open" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkBtn} 
          onPress={() => abrirLink('https://ecosafe.com/docs')}
        >
          <Ionicons name="document-text" size={20} color={COLORS.primary} />
          <Text style={styles.linkTexto}>Documentação</Text>
          <Ionicons name="open" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkBtn} 
          onPress={() => abrirLink('https://ecosafe.com/api')}
        >
          <Ionicons name="server" size={20} color={COLORS.primary} />
          <Text style={styles.linkTexto}>API Documentation</Text>
          <Ionicons name="open" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={compartilharApp}>
          <Ionicons name="share" size={20} color={COLORS.primary} />
          <Text style={styles.linkTexto}>Compartilhar App</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={avaliarApp}>
          <Ionicons name="star" size={20} color={COLORS.warning} />
          <Text style={styles.linkTexto}>Avaliar na Loja</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTexto}>
          © 2024 EcoSafe Team • Desenvolvido com ❤️ para o meio ambiente
        </Text>
        <Text style={styles.footerSubTexto}>
          Mobile Application Development • Universidade XYZ
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
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nomeApp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  versao: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  secao: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  descricaoCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
  },
  descricaoTexto: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  recursosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recursoCard: {
    backgroundColor: COLORS.surface,
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  recursoTexto: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 8,
  },
  statTitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  techTextos: {
    flex: 1,
    marginLeft: 15,
  },
  techNome: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  techVersao: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  devItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  devAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  devTextos: {
    flex: 1,
  },
  devNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  devPapel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  devEmail: {
    fontSize: 12,
    color: COLORS.primary,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  linkTexto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  footer: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  footerTexto: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  footerSubTexto: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
}); 