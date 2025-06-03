// Cores do app - aqui eu defino todas as cores que vou usar
// Aprendi que é melhor centralizar as cores em um arquivo só
export const COLORS = {
  // Cores principais
  primary: '#1565C0',      // Azul principal do app
  secondary: '#2E7D32',    // Verde para elementos secundários
  
  // Cores de fundo
  background: '#ECEFF1',   // Cinza claro para o fundo das telas
  surface: '#FFFFFF',      // Branco para cards e componentes
  
  // Cores para status e alertas
  warning: '#F9A825',      // Amarelo para avisos
  danger: '#C62828',       // Vermelho para erros e perigo
  success: '#2E7D32',      // Verde para sucesso
  info: '#1565C0',         // Azul para informações
  
  // Cores de texto
  text: '#263238',         // Cor principal do texto (cinza escuro)
  textSecondary: '#546E7A', // Cor para textos secundários (cinza médio)
  textLight: '#FFFFFF',    // Texto branco para fundos escuros
  
  // Outros
  overlay: 'rgba(0, 0, 0, 0.5)',  // Fundo escuro semi-transparente para modais
  shadowColor: '#000000',          // Cor das sombras
  
  // FIXME: Talvez eu deveria adicionar mais tons de cinza aqui?
  // TODO: Verificar se essas cores estão acessíveis para daltônicos
}; 