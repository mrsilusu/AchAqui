# 🏪 AchAqui - Marketplace de Serviços Locais em Angola

**AchAqui** é uma plataforma mobile-first que conecta clientes com prestadores de serviços locais em Angola. Focado em simplicidade, rapidez e integração com WhatsApp.

## 🎯 Visão Geral

Um marketplace descentralizado para serviços essenciais:
- **Oficinas e Mecânica** 🔧
- **Técnicos** (elétrica, encanamento, etc.) ⚡
- **Clínicas e Saúde** 🏥
- **Serviços Domésticos** 🏠
- **Beleza e Cabeleleito** 💇
- **Transporte e Logística** 🚚

## ✨ Características Principais

### Para Clientes
- ✅ Busca rápida de serviços por localização
- ✅ Contato direto via WhatsApp com prestadores
- ✅ Avaliações e recomendações de outros clientes
- ✅ Histórico de serviços contratados
- ✅ Agendamento simples (dia e hora)

### Para Prestadores
- ✅ Perfil comercial simples e gratuito
- ✅ Recebimento de clientes via WhatsApp
- ✅ Gerenciamento de avaliações
- ✅ Histórico de serviços realizados
- ✅ Estatísticas básicas de negócio

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: Supabase (Postgres)
- **Cache**: Redis
- **Authentication**: Supabase Auth (JWT)
- **API**: RESTful

### Frontend Mobile
- **Framework**: React Native (Expo)
- **State Management**: Redux
- **HTTP Client**: Axios
- **Maps**: React Native Maps
- **UI Components**: Expo & react-native-ui-lib

### Integração WhatsApp
- **Meta WhatsApp Business API**
- **Webhooks** para mensagens de entrada
- **Notificações** de serviços disponíveis

### DevOps
- **Containerização**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (futura)
- **Hosting**: (a definir)

## 📁 Estrutura do Projeto

```
AchAqui/
├── apps/
│   ├── mobile/
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── navigation/
│   │   │   └── utils/
│   │   ├── app.json
│   │   ├── package.json
│   │   └── .env
│   └── web/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── WHATSAPP.md
│   ├── SETUP.md
│   └── CONTRIBUTE.md
├── design/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- Git
- Expo CLI: `npm install -g expo-cli`
- Projeto Supabase Cloud (obrigatório)

### 1. Instalação

```bash
git clone https://github.com/mrsilusu/AchAqui.git
cd AchAqui
cp .env.example .env
cd backend && npm install && cd ..
cd apps/mobile && npm install && cd ..
```

### 2. Iniciar Ambiente (100% online)

1. Configure o Supabase Cloud e execute o schema em [docs/SUPABASE.sql](docs/SUPABASE.sql)
2. Atualize `.env` com `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
3. Inicie o backend localmente apenas para desenvolvimento (sem DB local)

```bash
cd backend && npm run dev

# Terminal diferente:
cd apps/mobile && expo start
```

## 📱 Fluxo de Uso

**Cliente:**
1. Buscar serviço por localização
2. Ver prestadores com avaliações
3. Contactar via WhatsApp
4. Deixar avaliação após serviço

**Prestador:**
1. Registar com foto e descrição
2. Receber mensagens de clientes
3. Gerenciar avaliações

## 📞 Integração WhatsApp

- **Fase 1**: Click-to-WhatsApp (botão abre conversa)
- **Fase 2**: WhatsApp Business API (notificações)
- **Fase 3**: Chatbot automático

Veja [docs/WHATSAPP.md](docs/WHATSAPP.md).

## 📄 Licença

MIT

---

**Feito com ❤️ para Angola** 🇦🇴