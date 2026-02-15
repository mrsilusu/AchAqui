# Arquitetura do AchAqui

## Visão Geral

AchAqui é uma aplicação mobile-first baseada em arquitetura cliente-servidor, com foco em escalabilidade, simplicidade e integração com WhatsApp.

## Componentes Principais

### 1. Frontend Mobile (React Native + Expo)

```
┌─────────────────────────────────────┐
│      React Native App (Expo)        │
├─────────────────────────────────────┤
│  Navigation Layer                   │
│  ├─ Bottom Tab Navigation           │
│  └─ Stack Navigation                │
├─────────────────────────────────────┤
│  Screens/Features                   │
│  ├─ Home (Busca por localização)    │
│  ├─ Search (Busca por categoria)    │
│  ├─ History (Histórico de serviços) │
│  └─ Profile (Perfil do usuário)     │
├─────────────────────────────────────┤
│  Redux Store (State Management)     │
│  ├─ Auth Redux                      │
│  ├─ Services Redux                  │
│  └─ User Redux                      │
├─────────────────────────────────────┤
│  Services Layer                     │
│  ├─ API Client (Axios)              │
│  ├─ Location Service                │
│  └─ WhatsApp Integration            │
└─────────────────────────────────────┘
```

### 2. Backend API (Node.js + Express)

```
┌─────────────────────────────────────┐
│      Node.js/Express Server         │
├─────────────────────────────────────┤
│  Middleware Stack                   │
│  ├─ CORS                            │
│  ├─ Rate Limiter                    │
│  ├─ Error Handler                   │
│  └─ Authentication (Supabase Auth)  │
├─────────────────────────────────────┤
│  Routes                             │
│  ├─ /api/auth (Autenticação)        │
│  ├─ /api/users (Perfil)             │
│  ├─ /api/services (Serviços)        │
│  ├─ /api/ratings (Avaliações)       │
│  └─ /api/whatsapp (Integração)      │
├─────────────────────────────────────┤
│  Controllers (Lógica de Negócio)    │
├─────────────────────────────────────┤
│  Services (Regras de Negócio)       │
├─────────────────────────────────────┤
│  Data Access Layer                  │
│  ├─ Supabase (Postgres) (Dados)     │
│  │   - Postgres gerido + Auth + Storage
│  │   - Recomendado para produção (Supabase Cloud)
│  └─ Redis (Cache)                   │
└─────────────────────────────────────┘
```

### 3. Integração WhatsApp

```
┌────────────────────────────────────┐
│    Meta WhatsApp Business API      │
├────────────────────────────────────┤
│  Entrada (Webhooks)                │
│  └─ Mensagens de clientes          │
├────────────────────────────────────┤
│  Saída (REST API)                  │
│  └─ Notificações para prestadores  │
└────────────────────────────────────┘
         ↕ (bidirecional)
    Backend AchAqui
         ↕
┌────────────────────────────────────┐
│    App AchAqui (Cliente/Prestador) │
└────────────────────────────────────┘
```

## Fluxo de Dados

### Fluxo 1: Cliente Busca Serviço

```
Cliente (App)
  ↓ [GET /api/services?category=...&lat=...&lon=...]
Backend
  ↓ [Query Supabase]
Supabase (Postgres)
  ↓ [Retorna documentos]
Backend
  ↓ [Retorna JSON]
Cliente (App)
  ↓ [Redux Store atualizado]
Tela (Renderiza lista)
```

### Fluxo 2: Cliente Contacta Prestador

```
Cliente (App)
  ↓ [Clica no botão WhatsApp]
  ↓ [Abre: https://wa.me/244923456789]
WhatsApp (Cliente)
  ↓ [Usuário digita mensagem]
  ↓ [Backend recebe webhook]
Backend
  ↓ [Processa e salva em BD]
Supabase (Postgres)
  ↓ [Novo registro de interação]
Backend
  ↓ [Opcional: Notifica prestador]
Prestador (Recebe no WhatsApp)
```

### Fluxo 3: Cliente Deixa Avaliação

```
Cliente (App)
  ↓ [Preenche formulário]
  ↓ [POST /api/ratings]
Backend
  ↓ [Valida dados]
  ↓ [Calcula nova média]
  ↓ [Atualiza User.rating e Service.rating]
Supabase (Postgres)
  ↓ [Salva rating]
  ↓ [Atualiza rating em User e Service]
Backend
  ↓ [Retorna sucesso]
Cliente (App)
  ↓ [Redux atualizado]
Tela (Mostra mensagem de sucesso)
```

## Modelos de Dados

### User
```javascript
{
  id: UUID,
  name: String,
  email: String,
  phone: String,
  password: String (hash),
  role: 'client' | 'provider',
  avatar_url: String,
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
    province: String
  },
  provider_info: {
    business_name: String,
    category: String,
    description: String,
    whatsapp_number: String,
    experience_years: Number
  },
  rating: {
    average: Number (0-5),
    count: Number
  },
  is_verified: Boolean,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Service
```javascript
{
  id: UUID,
  title: String,
  description: String,
  category: String,
  provider_id: UUID,
  price: {
    value: Number,
    currency: String
  },
  rating: {
    average: Number (0-5),
    count: Number
  },
  images: [String],
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Rating
```javascript
{
  id: UUID,
  user_id: UUID,
  service_id: UUID,
  provider_id: UUID,
  score: Number (1-5),
  comment: String,
  provider_reply: {
    comment: String,
    created_at: Date
  },
  created_at: Date,
  updated_at: Date
}
```

## Autenticação e Segurança

### Fluxo de Login

```
1. Cliente entra com email/phone + password
2. Backend valida credenciais
3. Backend gera JWT token (exp: 7 dias)
4. Frontend armazena token em AsyncStorage
5. Token incluído em todas requisições: Authorization: Bearer <token>
6. Backend verifica token em middleware
```

### Proteção de Rotas

```
Public Routes:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/services (sem filtro de localização privada)

Protected Routes:
- PUT /api/users/:id
- POST /api/ratings
- POST /api/whatsapp/send-message
```

## Escalabilidade

### Plano de Crescimento

**Fase 1 (Atual):**
- Servidor único
- Supabase Postgres gerenciado
- Redis single instance
- CDN para imagens

**Fase 2:**
- Load balancer (Nginx)
- Múltiplos servidores Node
- Otimizações no Postgres (indices e particionamento)
- Redis cluster

**Fase 3:**
- Kubernetes
- Microserviços
- Message Queue (RabbitMQ)
- ElasticSearch para busca

## Stack Tecnológico

| Componente | Tecnologia | Razão |
|-----------|-----------|-------|
| Frontend Mobile | React Native + Expo | Cross-platform, rápido de iterar |
| Backend | Node.js + Express | JavaScript full-stack, async/await |
| Database | Supabase (Postgres) | Postgres gerenciado com Auth e Storage |
| Cache | Redis | Performance de leitura |
| Auth | JWT | Stateless, simples |
| API | REST | Familiares, fácil de debugar |
| Integração | WhatsApp Business API | Ubiquidade em Angola |
| Deploy | Docker + Docker Compose | Consistência dev-prod |
| CI/CD | GitHub Actions | Integrado ao GitHub |

## Performance

### Otimizações Planejadas

1. **Postgres Indexing**
  - Índices em location, category, provider_id
  - Índices compostos para buscas combinadas

2. **Redis Caching**
   - Cache de categorias (refresh a cada 24h)
   - Cache de perfis de prestadores populares

3. **Frontend**
   - Lazy loading de imagens
   - Códigos divididos (code splitting)
   - Memoização de componentes

4. **Backend**
   - Paginação de resultados
  - Agregação no Postgres
   - Rate limiting

## Roadmap de Desenvolvimento

```
MVP (Fase 1) - 4-6 semanas
├─ Autenticação básica
├─ CRUD de serviços
├─ Busca e mapa
├─ Integração WhatsApp (Click-to-WhatsApp)
└─ Avaliações

Fase 2 - 6-8 semanas
├─ Agendamento integrado
├─ Notificações push
├─ Chat in-app
└─ Admin dashboard

Fase 3 - 8-10 semanas
├─ Pagamento (Stripe/M-Pesa)
├─ Verificação KYC
├─ Analytics
└─ Recomendações ML
```

---

**Última atualização**: Fevereiro 2026
