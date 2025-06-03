import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const { height, width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface CadastroScreenProps {
  navigation: any;
}

export const CadastroScreen: React.FC<CadastroScreenProps> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [nomeFocus, setNomeFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);
  const [confirmarSenhaFocus, setConfirmarSenhaFocus] = useState(false);
  
  const { cadastrar, carregando } = useAuth();
  
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

  const validarFormulario = () => {
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

  const fazerCadastro = async () => {
    console.log('🚀 Iniciando cadastro - Web:', isWeb);
    
    if (!validarFormulario()) {
      return;
    }

    console.log('📧 Tentando cadastro com:', email);
    const sucesso = await cadastrar(nome, email, senha);
    console.log('✅ Resultado do cadastro:', sucesso);
    
    if (!sucesso) {
      Alert.alert('Erro no cadastro', 'Não foi possível criar sua conta. Tente novamente.');
    } else {
      console.log('🎉 Cadastro bem-sucedido!');
      Alert.alert('Sucesso!', 'Conta criada com sucesso! Você já está logado.');
    }
  };

  const voltarParaLogin = () => {
    navigation.navigate('Login');
  };

  const Container = isWeb ? View : KeyboardAvoidingView;
  const containerProps = isWeb ? {} : {
    behavior: Platform.OS === 'ios' ? 'padding' as const : 'height' as const,
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
              <TouchableOpacity style={styles.voltarButton} onPress={voltarParaLogin}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
              
              <View style={styles.logo}>
                <Ionicons name="person-add" size={60} color={COLORS.textLight} />
              </View>
              <Text style={styles.titulo}>Criar Conta</Text>
              <Text style={styles.subtitulo}>
                Junte-se ao EcoSafe
              </Text>
            </View>

            <View style={[styles.formulario, isWeb && styles.formularioWeb]}>
              <View style={styles.bemVindo}>
                <Text style={styles.bemVindoTitulo}>Bem-vindo!</Text>
                <Text style={styles.bemVindoTexto}>
                  Preencha os dados para criar sua conta
                </Text>
              </View>

              {/* Campo Nome */}
              <View style={styles.campo}>
                <View style={[
                  styles.input,
                  nomeFocus && styles.inputFocado
                ]}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={nomeFocus ? COLORS.primary : COLORS.textSecondary} 
                    style={styles.icone}
                  />
                  <TextInput
                    style={styles.texto}
                    placeholder="Nome completo"
                    placeholderTextColor={COLORS.textSecondary}
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    onFocus={() => setNomeFocus(true)}
                    onBlur={() => setNomeFocus(false)}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Campo Email */}
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
                    keyboardType="email-address"
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

              {/* Campo Senha */}
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
                    placeholder="Senha (mín. 6 caracteres)"
                    placeholderTextColor={COLORS.textSecondary}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    onFocus={() => setSenhaFocus(true)}
                    onBlur={() => setSenhaFocus(false)}
                    returnKeyType="next"
                    blurOnSubmit={false}
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

              {/* Campo Confirmar Senha */}
              <View style={styles.campo}>
                <View style={[
                  styles.input,
                  confirmarSenhaFocus && styles.inputFocado
                ]}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={confirmarSenhaFocus ? COLORS.primary : COLORS.textSecondary} 
                    style={styles.icone}
                  />
                  <TextInput
                    style={styles.texto}
                    placeholder="Confirmar senha"
                    placeholderTextColor={COLORS.textSecondary}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry={!mostrarConfirmarSenha}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    onFocus={() => setConfirmarSenhaFocus(true)}
                    onBlur={() => setConfirmarSenhaFocus(false)}
                    returnKeyType="done"
                    onSubmitEditing={fazerCadastro}
                  />
                  <TouchableOpacity 
                    onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    style={styles.olho}
                  >
                    <Ionicons 
                      name={mostrarConfirmarSenha ? "eye" : "eye-off"} 
                      size={20} 
                      color={COLORS.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botão Cadastrar */}
              <TouchableOpacity
                style={[styles.botao, carregando && styles.botaoDesabilitado]}
                onPress={fazerCadastro}
                disabled={carregando}
              >
                <LinearGradient
                  colors={[COLORS.success, '#4CAF50']}
                  style={styles.botaoGradiente}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {carregando ? (
                    <View style={styles.carregando}>
                      <Animated.View style={styles.spinner}>
                        <Ionicons name="sync" size={20} color={COLORS.textLight} />
                      </Animated.View>
                      <Text style={styles.botaoTexto}>Criando conta...</Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="person-add" size={20} color={COLORS.textLight} />
                      <Text style={styles.botaoTexto}>Criar Conta</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link para Login */}
              <TouchableOpacity 
                style={styles.linkLogin}
                onPress={voltarParaLogin}
                disabled={carregando}
              >
                <Text style={styles.linkLoginTexto}>
                  Já tem uma conta? <Text style={styles.linkLoginDestaque}>Fazer login</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.info}>
                <Text style={styles.infoTexto}>
                  🛡️ Seus dados estão seguros conosco
                </Text>
                <Text style={styles.infoSubTexto}>
                  Ao criar uma conta, você concorda com nossos termos
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
    minHeight: height,
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
    width: Math.min(width * 0.9, 420),
    maxWidth: 420,
    minHeight: 'auto' as any,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  voltarButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    marginBottom: 25,
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
    marginBottom: 16,
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
    marginTop: 20,
    shadowColor: COLORS.success,
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
  linkLogin: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  linkLoginTexto: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  linkLoginDestaque: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
}); 