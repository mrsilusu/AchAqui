# Guia de Instalação - AchAqui

## 📋 Pré-requisitos

- **Node.js**: v20+
- **npm**: v9+
- **Git**: Latest
- **Supabase Cloud** (obrigatório)
- **Expo CLI**: `npm install -g expo-cli`

### Verificar Instalações

```bash
node --version    # v20.x.x
npm --version     # v9.x.x ou superior
git --version     # git version x.x.x
expo --version    # Expo CLI x.x.x
```

---

## 🚀 Instalação Local (Sem Docker)

### 1. Clonar Repositório

```bash
git clone https://github.com/mrsilusu/AchAqui.git
cd AchAqui
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

**Editar `./.env`:**
```env
NODE_ENV=development
API_PORT=3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Deixe os tokens do WhatsApp vazios por enquanto
# Serão adicionados posteriormente durante fase 2
```

### 3. Configurar Supabase

1. Criar um projeto em https://supabase.com
2. Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`
3. Atualizar o arquivo `.env` com essas variaveis
4. Executar o schema SQL em [docs/SUPABASE.sql](SUPABASE.sql)

### 4. Cache (opcional, online)

Use Redis gerido (ex.: Upstash ou Redis Cloud). Se não usar cache agora, ignore.

### 5. Instalar Backend

```bash
cd backend
npm install
npm run dev
```

Backend rodará em: `http://localhost:3000`

**Testar:**
```bash
curl http://localhost:3000/health
# Resposta esperada:
# {"status":"OK","message":"API AchAqui está funcionando","timestamp":"..."}
```

### 6. Instalar Mobile

```bash
cd apps/mobile
cp .env.example .env
npm install
expo start
```

**Abrir App:**
- Android Emulator: Pressione `a`
- iPhone Simulator: Pressione `i`
- Física: Escanear QR com Expo Go app

---

## ☁️ Ambiente 100% Online

- Base de dados e autenticação: Supabase Cloud
- Cache (opcional): Redis Cloud/Upstash
- Backend: qualquer provedor (Render, Fly, Railway, Cloud Run)

---

## ✅ Verificação de Instalação

### Backend

```bash
curl http://localhost:3000/health

# Resposta esperada:
#{
#  "status": "OK",
#  "message": "API AchAqui está funcionando",
#  "timestamp": "2024-02-14T10:30:00.000Z"
#}
```

### Database

Verifique se as variaveis do Supabase estao definidas no `.env` e se o projeto esta ativo no painel do Supabase.

### Redis

```bash
# Verificar status
redis-cli ping
# Resposta: PONG
```

### Mobile

```bash
cd apps/mobile
npm start

# Escanear QR code ou:
# - Pressione 'a' para Android
# - Pressione 'i' para iOS
```

---

## 📱 Primeiras Interações

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+244923123456",
    "password": "senha123",
    "role": "client",
    "location": {
      "city": "Luanda",
      "province": "Luanda",
      "latitude": -8.8383,
      "longitude": 13.2344
    }
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Resposta conterá o token JWT
# Copiar e usar em próximas requisições
```

### 3. Buscar Serviços

```bash
curl "http://localhost:3000/api/services?category=Elétrica&city=Luanda"
```

---

## 🔧 Troubleshooting

### "Nao consigo conectar ao Supabase"

- Confirme `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` no `.env`
- Verifique se o projeto esta ativo no painel do Supabase

### "Port 3000 already in use"

```bash
# Encontrar processo usando 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente:
PORT=3001 npm run dev
```

### "Erro no npm install"

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### "Expo não funciona"

```bash
# Reinstalar Expo CLI globalmente
npm install -g expo-cli@latest

# Limpar cache Expo
expo creanup

# Tentar novamente
expo start --clear
```

---

## 📚 Estrutura de Pastas

```
AchAqui/
├── apps/
│   ├── mobile/                 # App React Native
│   │   ├── src/
│   │   │   ├── screens/         # Telas principais
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── services/        # Chamadas API
│   │   │   ├── stores/          # Redux estados
│   │   │   ├── navigation/      # Navegação
│   │   │   └── styles/          # Temas e estilos
│   │   ├── app.json
│   │   ├── App.js               # Entry point
│   │   └── package.json
│   └── web/                     # App Web (opcional)
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── config/            # Configurações
│   │   ├── models/            # Modelos de dados
│   │   ├── controllers/       # Lógica de rotas
│   │   ├── routes/            # Definição de rotas
│   │   ├── services/          # Lógica de negócio
│   │   ├── middlewares/       # Auth, validação
│   │   └── utils/             # Funções auxiliares
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
├── docs/                       # Documentação
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── WHATSAPP.md
│   ├── SETUP.md               # Este arquivo
│   └── CONTRIBUTE.md
│
├── design/                     # Design assets
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔐 Próximas Configurações

### Depois de instalar com sucesso:

1. **Configurar WhatsApp Business** (Fase 2)
   - Criar conta em WhatsApp Business
   - Obter credenciais
   - Atualizar `.env`

2. **Configurar Upload de Imagens** (Fase 2)
   - AWS S3 ou similar
   - Atualizar configurações

3. **CI/CD** (Fase 2)
   - Configurar GitHub Actions
   - Deploy automático

---

## 📖 Próximos Passos

- [ ] Ler [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] Ler [API.md](API.md)
- [ ] Executar testes no backend: `npm test`
- [ ] Criar primeiro serviço via API
- [ ] Testar busca de serviços no app

---

## 💬 Precisa de Ajuda?

- Abrir issue no GitHub
- Checar [CONTRIBUTE.md](CONTRIBUTE.md)
- Discord: (a adicionar quando houver comunidade)

---

**Última atualização**: Fevereiro 2026
