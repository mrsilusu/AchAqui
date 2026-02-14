# Quick Start - AchAqui Dev

## 🚀 TL;DR (Too Long; Didn't Read)

```bash
# Clonar
git clone https://github.com/mrsilusu/AchAqui.git && cd AchAqui

# Copiar env
cp .env.example .env

# Opção A: Com Docker (recomendado)
docker-compose up -d
cd backend && npm install && npm run dev

# Opção B: Sem Docker
# Instalar MongoDB e Redis localmente
cd backend && npm install && npm run dev

# Terminal diferente - Mobile
cd mobile && npm install && expo start
```

---

## 📱 Estrutura Rápida

| Camada | Tecnologia | Local | Porta |
|--------|-----------|-------|-------|
| Frontend Mobile | React Native + Expo | `/mobile` | Expo (8081) |
| Backend API | Node.js + Express | `/backend` | :3000 |
| Database | MongoDB | Docker | 27017 |
| Cache | Redis | Docker | 6379 |

---

## 🔗 Links Importantes

| Link | URL |
|------|-----|
| **Documentação Completa** | [README.md](../README.md) |
| **Arquitetura** | [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| **API Endpoints** | [docs/API.md](../docs/API.md) |
| **WhatsApp Integration** | [docs/WHATSAPP.md](../docs/WHATSAPP.md) |
| **Setup Detalhado** | [docs/SETUP.md](./SETUP.md) |
| **Como Contribuir** | [docs/CONTRIBUTE.md](./CONTRIBUTE.md) |

---

## 🧪 Testes Rápidos

```bash
# Health check backend
curl http://localhost:3000/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"+244923123456","password":"123456","role":"client"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Buscar serviços
curl "http://localhost:3000/api/services?category=Elétrica"
```

---

## 📂 Arquivos Principais

```
.
├── README.md                    # Visão geral projeto
├── docker-compose.yml           # Orquestração containers
├── .env.example                 # Variáveis de ambiente
│
├── backend/
│   ├── src/index.js            # Entry point
│   ├── src/config/
│   │   ├── database.js
│   │   └── logger.js
│   ├── src/models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── Rating.js
│   ├── src/routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── service.routes.js
│   │   ├── rating.routes.js
│   │   └── whatsapp.routes.js
│   ├── package.json
│   └── Dockerfile
│
├── mobile/
│   ├── App.js                  # Entry point
│   ├── app.json                # Expo config
│   ├── src/
│   │   ├── navigation/RootNavigator.js
│   │   ├── screens/
│   │   │   ├── HomeScreen.js
│   │   │   ├── SearchScreen.js
│   │   │   ├── HistoryScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── services/api.js
│   │   ├── stores/index.js
│   │   └── styles/theme.js
│   └── package.json
│
└── docs/
    ├── ARCHITECTURE.md          # Design systems
    ├── API.md                   # Endpoints
    ├── WHATSAPP.md              # WhatsApp integration
    ├── SETUP.md                 # Installation guide
    ├── CONTRIBUTE.md            # Contributing guide
    └── QUICK.md                 # Este arquivo
```

---

## 🎯 Próximas Implementações

### Fase 1 (MVP) - 4-6 semanas
- [ ] Sistema de autenticação (JWT)
- [ ] CRUD de serviços
- [ ] Busca e mapa
- [ ] Click-to-WhatsApp
- [ ] Avaliações

### Fase 2 - 6-8 semanas
- [ ] Agendamento
- [ ] Notificações push
- [ ] Chat in-app
- [ ] WhatsApp Business API

### Fase 3 - 8-10 semanas
- [ ] Pagamento (Stripe/M-Pesa)
- [ ] KYC verification
- [ ] Chatbot com IA
- [ ] Admin dashboard

---

## 🛠️ Commands Úteis

```bash
# Backend
cd backend
npm run dev           # Start com nodemon
npm test              # Run tests
npm run lint          # Check code style
npm run lint:fix      # Fix style issues

# Mobile
cd mobile
expo start            # Start dev server
expo build:web       # Build para web
expo build:ios       # Build para iOS
expo build:android   # Build para Android

# Docker
docker-compose up    # Start services
docker-compose down  # Stop services
docker-compose logs  # View logs
docker-compose ps    # Check status
```

---

## 🌍 Ambiente por Região (Angola)

### Cidades Principais
- Luanda (maior, capital)
- Benguela
- Huambo
- Cabinda
- Bie

### Providências Configuradas
```javascript
// provinces.js
[
  'Luanda',
  'Bengo',
  'Cabinda',
  'Zaire',
  'Uíge',
  'Cuanza Norte',
  'Cuanza Sul',
  'Huambo',
  'Bie',
  'Moxico',
  'Lunda Norte',
  'Lunda Sul',
  'Cuando Cubango',
  'Namibe',
  'Benguela',
  'Huila'
]
```

---

## 💡 Dicas

1. **Sempre atualizar `main`** antes de criar feature branch
2. **Commits pequenos** e com messages claras
3. **Testes** antes de PR
4. **Ler docs** correspondentes
5. **Ask for help** se travar

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `PORT=3001 npm run dev` |
| MongoDB não conecta | `mongodb://localhost:27017` no .env |
| Expo não funciona | `expo creanup && expo start --clear` |
| npm install falha | `npm cache clean --force && rm -rf node_modules` |
| Git merge confuso | `git status` e resolve conflicts |

---

## 📞 Suporte

- 🐛 **Bug?** Abrir issue no GitHub
- 💬 **Dúvida?** Comentar na issue correspondente
- 📖 **Docs?** Checar [SETUP.md](./SETUP.md) e [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🤝 **Contribuir?** Ver [CONTRIBUTE.md](./CONTRIBUTE.md)

---

**Made with ❤️ for Angola** 🇦🇴
