# EcoSafe Mobile 🌿

Sistema completo de monitoramento ambiental em tempo real, voltado à prevenção de enchentes, incêndios florestais e ventos fortes.

## 📱 Sobre o Projeto

O EcoSafe é um aplicativo mobile desenvolvido em React Native para a disciplina de **Mobile Application Development**. O sistema permite monitorar sensores ambientais, gerenciar alertas e acompanhar eventos climáticos em tempo real.

### 🎯 Funcionalidades Principais

- **Dashboard**: Visão geral dos alertas ativos e leituras recentes
- **Sensores**: Gerenciamento completo de sensores ambientais (CRUD)
- **Alertas**: Criação e monitoramento de alertas de emergência (CRUD)
- **Eventos**: Registro e acompanhamento de eventos ambientais (CRUD)
- **Configurações**: Informações do app e configurações do sistema

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem de programação
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP para API
- **Expo Vector Icons** - Ícones do aplicativo

## 🎨 Design System

### Paleta de Cores

- **Azul Petróleo** (#1565C0) - Cor primária
- **Verde Natural** (#2E7D32) - Cor secundária
- **Cinza Neutro** (#ECEFF1) - Background
- **Amarelo Alerta** (#F9A825) - Alertas de atenção
- **Vermelho Crítico** (#C62828) - Alertas críticos
- **Branco** (#FFFFFF) - Superfícies

## 📂 Estrutura do Projeto

```
EcoSafe/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   ├── constants/
│   │   └── colors.ts
│   ├── navigation/
│   │   └── TabNavigator.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── SensoresScreen.tsx
│   │   ├── AlertasScreen.tsx
│   │   ├── EventosScreen.tsx
│   │   └── ConfiguracoesScreen.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── mockData.ts
│   └── types/
│       └── index.ts
├── App.tsx
├── package.json
└── README.md
```

## 🗄️ Banco de Dados

O aplicativo utiliza uma API RESTful que conecta com um banco de dados contendo as seguintes entidades:

- **Sensor**: Dispositivos de monitoramento ambiental
- **LeituraSensor**: Valores captados pelos sensores
- **Local**: Localizações geográficas
- **Evento**: Eventos ambientais registrados
- **Alerta**: Notificações de emergência
- **Usuario**: Usuários do sistema

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### Passos para execução

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd EcoSafe
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o projeto**
   ```bash
   npm start
   ```

4. **Execute no dispositivo**
   - Abra o Expo Go no seu dispositivo
   - Escaneie o QR Code exibido no terminal
   - O aplicativo será carregado automaticamente

## 🌐 Configuração da API

### Dados Mock (Padrão)

Por padrão, o aplicativo utiliza dados simulados para demonstração. Para alterar isso:

1. Abra o arquivo `src/services/api.ts`
2. Altere `USE_MOCK_DATA = false`
3. Configure a `API_BASE_URL` com o endereço do seu backend

### API Real

Para conectar com uma API real, certifique-se de que ela tenha os seguintes endpoints:

```
GET    /api/sensores
POST   /api/sensores
PUT    /api/sensores/:id
DELETE /api/sensores/:id

GET    /api/alertas
POST   /api/alertas
PUT    /api/alertas/:id
DELETE /api/alertas/:id

GET    /api/eventos
POST   /api/eventos
PUT    /api/eventos/:id
DELETE /api/eventos/:id

GET    /api/leituras/recentes
GET    /api/eventos/recentes
GET    /api/alertas/ativos
```

## 📊 Funcionalidades Implementadas

### ✅ Requisitos Atendidos

- **[10 pts] Navegação**: 5 telas com navegação fluida via React Navigation
- **[40 pts] CRUD**: Operações completas para Sensores, Alertas e Eventos
- **[10 pts] Estilização**: Design personalizado com paleta de cores definida
- **[20 pts] Arquitetura**: Código bem organizado com separação de responsabilidades
- **[20 pts] Demonstração**: App funcionando completamente

### 🔍 Destaques Técnicos

- **TypeScript**: Tipagem forte em todo o projeto
- **Componentização**: Componentes reutilizáveis (Card, Loading)
- **Estados**: Gerenciamento adequado com React Hooks
- **Responsividade**: Interface adaptada para diferentes tamanhos
- **Feedback Visual**: Loading states e tratamento de erros
- **Dados Mock**: Simulação completa da API para testes

## 📱 Screenshots

### Dashboard
- Visão geral dos alertas ativos
- Leituras recentes dos sensores
- Eventos ambientais

### Sensores
- Lista de todos os sensores
- Criação/edição de sensores
- Controle de status (ativo/inativo/manutenção)

### Alertas
- Alertas categorizados por urgência
- Criação de novos alertas
- Associação com eventos

### Eventos
- Registro de eventos ambientais
- Classificação por nível de risco
- Detalhes e localização

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor Mobile**: [Seu Nome]
- **Disciplina**: Mobile Application Development
- **Instituição**: [Nome da Instituição]

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de Mobile Application Development.

---

**EcoSafe Mobile v1.0** - Sistema de Monitoramento Ambiental
Desenvolvido com ❤️ usando React Native + Expo 