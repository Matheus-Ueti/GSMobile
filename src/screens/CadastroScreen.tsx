import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const { height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface CadastroScreenProps {
  navigation: any;
}

export const CadastroScreen: React.FC<CadastroScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  
  // Estados de interface
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Contexto e animação
  const { cadastrar, carregando } = useAuth();
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

  // Validar formulário
  const validarFormulario = () => {
    const { nome, email, senha, confirmarSenha } = formData;

    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Ops!', 'Preencha todos os campos');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Digite um email válido');
      return false;
    }

    if (senha.length < 6) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem');
      return false;
    }

    return true;
  };

  // Fazer cadastro
  const fazerCadastro = async () => {
    if (!validarFormulario()) return;

    const { nome, email, senha } = formData;
    const sucesso = await cadastrar(nome, email, senha);
    
    if (!sucesso) {
      Alert.alert('Erro', 'Não foi possível criar sua conta');
    } else {
      Alert.alert('Sucesso!', 'Conta criada com sucesso!');
    }
  };

  // Voltar para login
  const voltarLogin = () => {
    navigation.navigate('Login');
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
              <TouchableOpacity style={styles.botaoVoltar} onPress={voltarLogin}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <View style={styles.logo}>
                <Ionicons name="person-add" size={60} color="white" />
              </View>
              <Text style={styles.titulo}>Criar Conta</Text>
              <Text style={styles.subtitulo}>Junte-se ao EcoSafe</Text>
            </View>

            {/* Formulário */}
            <View style={[styles.form, isWeb && styles.formWeb]}>
              <View style={styles.welcome}>
                <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
                <Text style={styles.welcomeText}>
                  Preencha os dados para criar sua conta
                </Text>
              </View>

              {/* Campo Nome */}
              <CampoTexto
                icon="person"
                placeholder="Nome completo"
                value={formData.nome}
                onChangeText={(text) => atualizarCampo('nome', text)}
                focused={focusedField === 'nome'}
                onFocus={() => setFocusedField('nome')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
                textContentType="name"
              />

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
              />

              {/* Campo Confirmar Senha */}
              <CampoSenha
                icon="lock-closed"
                placeholder="Confirmar senha"
                value={formData.confirmarSenha}
                onChangeText={(text) => atualizarCampo('confirmarSenha', text)}
                focused={focusedField === 'confirmarSenha'}
                onFocus={() => setFocusedField('confirmarSenha')}
                onBlur={() => setFocusedField(null)}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Botão Cadastrar */}
              <TouchableOpacity 
                style={[styles.botaoCadastrar, carregando && styles.botaoDesabilitado]} 
                onPress={fazerCadastro}
                disabled={carregando}
              >
                <Text style={styles.textoBotaoCadastrar}>
                  {carregando ? 'Criando conta...' : 'Criar Conta'}
                </Text>
              </TouchableOpacity>

              {/* Link para Login */}
              <TouchableOpacity style={styles.linkLogin} onPress={voltarLogin}>
                <Text style={styles.textoLinkLogin}>
                  Já tem uma conta? <Text style={styles.textoLinkLoginBold}>Entrar</Text>
                </Text>
              </TouchableOpacity>
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
}> = ({ icon, placeholder, value, onChangeText, focused, onFocus, onBlur, showPassword, onTogglePassword }) => (
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
    marginBottom: 30,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  logo: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },

  // Formulário
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  formWeb: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },

  // Boas-vindas
  welcome: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Campos
  campo: {
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
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
    padding: 4,
  },

  // Botões
  botaoCadastrar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoCadastrar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Link de login
  linkLogin: {
    marginTop: 20,
    alignItems: 'center',
  },
  textoLinkLogin: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  textoLinkLoginBold: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
}); 