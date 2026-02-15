# Documentação da API REST - AchAqui

**Base URL**: `http://localhost:3000/api`

## Autenticação

Todas as rotas protegidas requerem token JWT no header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Autenticação

#### `POST /auth/register`

Registrar novo usuário.

**Payload:**
```json
{
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
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### `POST /auth/login`

Fazer login (Supabase Auth).

**Payload:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "role": "client"
  },
  "token": "SUPABASE_ACCESS_TOKEN"
}
```

---

### 2. Usuários

#### `GET /users/:id`

Obter informações do usuário. **[Protected]**

**Parâmetros:**
- `id` (path): ID do usuário

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+244923123456",
    "role": "client",
    "avatar_url": "https://...",
    "location": {
      "city": "Luanda",
      "latitude": -8.8383,
      "longitude": 13.2344
    },
    "rating": {
      "average": 4.8,
      "count": 42
    }
  }
}
```

---

#### `PUT /users/:id`

Atualizar perfil do usuário. **[Protected]**

**Payload:**
```json
{
  "name": "João Silva",
  "bio": "Técnico em elétrica com 10 anos de experiência",
  "avatar_url": "https://..."
}
```

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Usuário atualizado com sucesso"
}
```

---

### 3. Serviços

#### `GET /services`

Listar serviços com filtros. **[Public]**

**Query Parameters:**
- `category` (opcional): Filtrar por categoria
- `city` (opcional): Filtrar por cidade
- `lat` (opcional): Latitude para busca por localização
- `lon` (opcional): Longitude para busca por localização
- `radius` (opcional): Raio em km (default: 10)
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Items por página (default: 20)

**Exemplo:**
```
GET /services?category=Elétrica&city=Luanda&lat=-8.8383&lon=13.2344&radius=5
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Instalação Elétrica Completa",
      "description": "Instalação, manutenção e reparos...",
      "category": "Elétrica",
      "provider": {
        "id": "507f1f77bcf86cd799439011",
        "name": "José Silva",
        "avatar_url": "https://...",
        "rating": 4.8
      },
      "price": {
        "value": 50000,
        "currency": "AOA"
      },
      "rating": {
        "average": 4.8,
        "count": 15
      },
      "images": ["https://...", "https://..."],
      "distance": 2.3,
      "phone_whatsapp": "+244923123456"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

#### `GET /services/:id`

Obter detalhes de um serviço. **[Public]**

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Instalação Elétrica Completa",
    "description": "Instalação, manutenção e reparos...",
    "category": "Elétrica",
    "provider": {
      "id": "507f1f77bcf86cd799439011",
      "name": "José Silva",
      "bio": "Técnico experiente...",
      "avatar_url": "https://...",
      "phone": "+244923123456",
      "rating": 4.8,
      "experience_years": 10
    },
    "price": {
      "value": 50000,
      "currency": "AOA"
    },
    "rating": {
      "average": 4.8,
      "count": 15
    },
    "images": ["https://...", "https://..."],
    "availability": {
      "monday": { "start": "08:00", "end": "17:00" },
      "tuesday": { "start": "08:00", "end": "17:00" }
    },
    "reviews": [
      {
        "user": "Maria Santos",
        "score": 5,
        "comment": "Excelente trabalho!",
        "date": "2024-01-15"
      }
    ]
  }
}
```

---

#### `POST /services`

Criar novo serviço (prestador). **[Protected - Provider only]**

**Payload:**
```json
{
  "title": "Instalação Elétrica Completa",
  "description": "Instalação, manutenção e reparos...",
  "category": "Elétrica",
  "price": {
    "value": 50000,
    "currency": "AOA"
  },
  "images": ["https://...", "https://..."],
  "availability": {
    "monday": { "start": "08:00", "end": "17:00" },
    "tuesday": { "start": "08:00", "end": "17:00" }
  }
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "message": "Serviço criado com sucesso",
  "data": {
    "id": "507f1f77bcf86cd799439012"
  }
}
```

---

#### `PUT /services/:id`

Atualizar serviço. **[Protected - Provider only]**

**Payload:** Similar ao POST

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Serviço atualizado com sucesso"
}
```

---

#### `DELETE /services/:id`

Deletar serviço. **[Protected - Provider only]**

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Serviço deletado com sucesso"
}
```

---

### 4. Avaliações

#### `GET /ratings/service/:serviceId`

Obter avaliações de um serviço. **[Public]**

**Query Parameters:**
- `page` (opcional): Página (default: 1)
- `limit` (opcional): Items por página (default: 10)

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "user": {
        "id": "507f1f77bcf86cd799439010",
        "name": "Maria Santos",
        "avatar_url": "https://..."
      },
      "score": 5,
      "title": "Excelente!",
      "comment": "Ótimo profissional, muito pontual...",
      "aspects": {
        "professionalism": 5,
        "punctuality": 5,
        "quality": 5,
        "communication": 4
      },
      "images": ["https://..."],
      "date": "2024-01-15"
    }
  ]
}
```

---

#### `POST /ratings`

Criar avaliação. **[Protected]**

**Payload:**
```json
{
  "service_id": "507f1f77bcf86cd799439012",
  "score": 5,
  "title": "Excelente!",
  "comment": "Ótimo profissional, muito pontual...",
  "aspects": {
    "professionalism": 5,
    "punctuality": 5,
    "quality": 5,
    "communication": 4
  }
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "message": "Avaliação adicionada com sucesso"
}
```

---

### 5. WhatsApp

#### `POST /whatsapp/webhook`

Webhook para receber mensagens. **[Public - Verificado por Meta]**

#### `GET /whatsapp/webhook`

Verificação do webhook. **[Public]**

#### `POST /whatsapp/send-message`

Enviar mensagem. **[Protected]**

**Payload:**
```json
{
  "phone": "+244923123456",
  "message": "Olá, gostaria de mais informações..."
}
```

---

## Códigos de Erro

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Acesso negado |
| 404 | Not Found | Recurso não encontrado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro no servidor |

---

## Exemplo de Uso (JavaScript/Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Adicionar token ao header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
}

// Buscar serviços
async function searchServices(category, lat, lon) {
  const response = await api.get('/services', {
    params: { category, lat, lon }
  });
  return response.data.data;
}

// Deixar avaliação
async function addRating(serviceId, score, comment) {
  const response = await api.post('/ratings', {
    service_id: serviceId,
    score,
    comment
  });
  return response.data;
}
```

---

**Última atualização**: Fevereiro 2026
