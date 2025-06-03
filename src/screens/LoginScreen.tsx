import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const { height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  
  // Estados de interface
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Contexto e animação
  const { login, carregando } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Animação inicial
  useEffect(() => {
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

  // Atualizar campo
  const atualizarCampo = (campo: string, valor: string) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  // Fazer login
  const fazerLogin = async () => {
    const { email, senha } = formData;
    
    if (!email || !senha) {
      Alert.alert('Ops!', 'Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Digite um email válido');
      return;
    }

    const sucesso = await login(email, senha);
    
    if (!sucesso) {
      Alert.alert('Erro', 'Email ou senha incorretos');
    }
  };

  // Preencher demo
  const preencherDemo = () => {
    setFormData({
      email: 'admin@ecosafe.com',
      senha: '123456',
    });
  };

  // Ir para cadastro
  const irParaCadastro = () => {
    navigation.navigate('Cadastro');
  };

  // Configuração do container
  const Container = isWeb ? View : KeyboardAvoidingView;
  const containerProps = isWeb ? {} : {
    behavior: Platform.OS === 'ios' ? 'padding' as const : 'height' as const,
    keyboardVerticalOffset: Platform.OS === 'ios' ? 0 : 20,
  };

  return (
    <Container style={styles.container} {...containerProps}>
      <LinearGradient
        colors={['#1976D2', COLORS.primary, '#0D47A1']}
        style={styles.background}
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
              styles.content,
              isWeb && styles.contentWeb,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="leaf" size={60} color="white" />
              </View>
              <Text style={styles.titulo}>EcoSafe</Text>
              <Text style={styles.subtitulo}>
                Sistema de Monitoramento Ambiental
              </Text>
            </View>

            {/* Formulário */}
            <View style={[styles.form, isWeb && styles.formWeb]}>
              <View style={styles.welcome}>
                <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
                <Text style={styles.welcomeText}>
                  Faça login para continuar
                </Text>
              </View>

              {/* Campo Email */}
              <CampoTexto
                icon="mail"
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => atualizarCampo('email', text)}
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />

              {/* Campo Senha */}
              <CampoSenha
                icon="lock-closed"
                placeholder="Senha"
                value={formData.senha}
                onChangeText={(text) => atualizarCampo('senha', text)}
                focused={focusedField === 'senha'}
                onFocus={() => setFocusedField('senha')}
                onBlur={() => setFocusedField(null)}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmitEditing={fazerLogin}
              />

              {/* Botão Login */}
              <TouchableOpacity 
                style={[styles.botaoLogin, carregando && styles.botaoDesabilitado]}
                onPress={fazerLogin}
                disabled={carregando}
              >
                <Text style={styles.textoBotaoLogin}>
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>

              {/* Botão Preencher Demo */}
              <TouchableOpacity 
                style={styles.botaoDemo}
                onPress={preencherDemo}
                disabled={carregando}
              >
                <Ionicons name="flash" size={18} color="#2196F3" style={styles.iconDemo} />
                <Text style={styles.textoBotaoDemo}>
                  Preencher Demo
                </Text>
              </TouchableOpacity>

              {/* Link para Cadastro */}
              <TouchableOpacity style={styles.linkCadastro} onPress={irParaCadastro}>
                <Text style={styles.textoLinkCadastro}>
                  Não tem uma conta? <Text style={styles.textoLinkCadastroBold}>Criar conta</Text>
                </Text>
              </TouchableOpacity>

              {/* Texto explicativo */}
              <View style={styles.textoExplicativo}>
                <Text style={styles.textoInfo}>💡 Use qualquer email e senha</Text>
                <Text style={styles.textoInfo}>Ou clique em "Preencher Demo" para testar</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </Container>
  );
};

// Componente Campo de Texto
const CampoTexto: React.FC<{
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  keyboardType?: any;
  autoCapitalize?: any;
  textContentType?: any;
}> = ({ icon, placeholder, value, onChangeText, focused, onFocus, onBlur, keyboardType, autoCapitalize, textContentType }) => (
  <View style={styles.campo}>
    <View style={[styles.input, focused && styles.inputFocused]}>
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={focused ? COLORS.primary : COLORS.textSecondary} 
        style={styles.icon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textContentType={textContentType}
        autoCorrect={false}
      />
    </View>
  </View>
);

// Componente Campo de Senha
const CampoSenha: React.FC<{
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmitEditing?: () => void;
}> = ({ icon, placeholder, value, onChangeText, focused, onFocus, onBlur, showPassword, onTogglePassword, onSubmitEditing }) => (
  <View style={styles.campo}>
    <View style={[styles.input, focused && styles.inputFocused]}>
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={focused ? COLORS.primary : COLORS.textSecondary} 
        style={styles.icon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry={!showPassword}
        textContentType="password"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
      />
      <TouchableOpacity onPress={onTogglePassword} style={styles.botaoOlho}>
        <Ionicons 
          name={showPassword ? 'eye' : 'eye-off'} 
          size={20} 
          color={COLORS.textSecondary} 
        />
      </TouchableOpacity>
    </View>
  </View>
);

// Estilos organizados
const styles = StyleSheet.create({
  // Principal
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    minHeight: height,
  },

  // Scroll
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scrollWeb: {
    paddingVertical: 40,
  },

  // Conteúdo
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  contentWeb: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  // Cabeçalho
  header: {
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
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Formulário
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  formWeb: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Boas-vindas
  welcome: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Campos
  campo: {
    marginBottom: 16,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: 'white',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  botaoOlho: {
    padding: 5,
  },

  // Botões
  botaoLogin: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoLogin: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Botão Demo
  botaoDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  iconDemo: {
    marginRight: 8,
  },
  textoBotaoDemo: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },

  // Links
  linkCadastro: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  textoLinkCadastro: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  textoLinkCadastroBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  // Texto explicativo
  textoExplicativo: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textoInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 