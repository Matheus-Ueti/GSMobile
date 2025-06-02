import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const { height, width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);
  
  const { login, carregando } = useAuth();
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Ops!', 'Preenche os campos aí');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Coloca um @ no email');
      return;
    }

    const sucesso = await login(email, senha);
    
    if (!sucesso) {
      Alert.alert('Deu ruim', 'Email ou senha incorretos');
    }
  };

  const loginDemo = () => {
    console.log('🔧 loginDemo clicado - carregando:', carregando);
    setEmail('admin@ecosafe.com');
    setSenha('123456');
    console.log('✅ Campos preenchidos');
  };

  const Container = isWeb ? View : KeyboardAvoidingView;
  const containerProps = isWeb ? {} : {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS === 'ios' ? 0 : 20,
  };

  return (
    <Container 
      style={styles.container} 
      {...containerProps}
    >
      <LinearGradient
        colors={['#1976D2', COLORS.primary, '#0D47A1']}
        style={styles.fundo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.conteudo,
              isWeb && styles.conteudoWeb,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.topo}>
              <View style={styles.logo}>
                <Ionicons name="leaf" size={60} color={COLORS.textLight} />
              </View>
              <Text style={styles.titulo}>EcoSafe</Text>
              <Text style={styles.subtitulo}>
                Sistema de Monitoramento Ambiental
              </Text>
            </View>

            <View style={[styles.formulario, isWeb && styles.formularioWeb]}>
              <View style={styles.bemVindo}>
                <Text style={styles.bemVindoTitulo}>Bem-vindo!</Text>
                <Text style={styles.bemVindoTexto}>
                  Faça login para continuar
                </Text>
              </View>

              <View style={styles.campo}>
                <View style={[
                  styles.input,
                  emailFocus && styles.inputFocado
                ]}>
                  <Ionicons 
                    name="mail" 
                    size={20} 
                    color={emailFocus ? COLORS.primary : COLORS.textSecondary} 
                    style={styles.icone}
                  />
                  <TextInput
                    style={styles.texto}
                    placeholder="Email"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.campo}>
                <View style={[
                  styles.input,
                  senhaFocus && styles.inputFocado
                ]}>
                  <Ionicons 
                    name="lock-closed" 
                    size={20} 
                    color={senhaFocus ? COLORS.primary : COLORS.textSecondary} 
                    style={styles.icone}
                  />
                  <TextInput
                    style={styles.texto}
                    placeholder="Senha"
                    placeholderTextColor={COLORS.textSecondary}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                    autoComplete="password"
                    textContentType="password"
                    onFocus={() => setSenhaFocus(true)}
                    onBlur={() => setSenhaFocus(false)}
                    returnKeyType="done"
                    onSubmitEditing={fazerLogin}
                  />
                  <TouchableOpacity 
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                    style={styles.olho}
                  >
                    <Ionicons 
                      name={mostrarSenha ? "eye" : "eye-off"} 
                      size={20} 
                      color={COLORS.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.botao, carregando && styles.botaoDesabilitado]}
                onPress={fazerLogin}
                disabled={carregando}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#1976D2']}
                  style={styles.botaoGradiente}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {carregando ? (
                    <View style={styles.carregando}>
                      <Animated.View style={styles.spinner}>
                        <Ionicons name="sync" size={20} color={COLORS.textLight} />
                      </Animated.View>
                      <Text style={styles.botaoTexto}>Entrando...</Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="log-in" size={20} color={COLORS.textLight} />
                      <Text style={styles.botaoTexto}>Entrar</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.botaoDemo}
                onPress={() => {
                  console.log('🎯 Botão demo clicado - estado carregando:', carregando);
                  loginDemo();
                }}
                disabled={carregando}
              >
                <Ionicons name="flash" size={16} color={COLORS.primary} />
                <Text style={styles.botaoDemoTexto}>Preencher Demo</Text>
              </TouchableOpacity>

              <View style={styles.info}>
                <Text style={styles.infoTexto}>
                  💡 Use qualquer email e senha
                </Text>
                <Text style={styles.infoSubTexto}>
                  Ou clique em "Preencher Demo" para testar
                </Text>
              </View>
            </View>

            <View style={styles.rodape}>
              <Text style={styles.rodapeTexto}>
                EcoSafe v1.0 • Mobile Development
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fundo: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  scrollWeb: {
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  conteudoWeb: {
    flex: 'none' as any,
    width: Math.min(width * 0.9, 400),
    maxWidth: 400,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formulario: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  formularioWeb: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bemVindo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bemVindoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  bemVindoTexto: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  campo: {
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputFocado: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  icone: {
    marginRight: 12,
  },
  texto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    outlineStyle: 'none' as any,
  },
  olho: {
    padding: 5,
  },
  botao: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoGradiente: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  botaoTexto: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  carregando: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  botaoDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  botaoDemoTexto: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  info: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  infoTexto: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  infoSubTexto: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rodape: {
    alignItems: 'center',
    marginTop: 30,
  },
  rodapeTexto: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
}); 