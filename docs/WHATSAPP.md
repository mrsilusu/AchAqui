# Integração WhatsApp Business - AchAqui

## Visão Geral

O AchAqui integra-se com a **Meta WhatsApp Business API** para facilitar a comunicação entre clientes e prestadores de serviços. O foco está em simplicidade e conversão rápida.

## Fases de Integração

### Fase 1: Click-to-WhatsApp (MVP)
- Cliente clica botão "Contactar via WhatsApp"
- Abre app WhatsApp ou WhatsApp Web com número do prestador
- Conversa acontece diretamente no WhatsApp
- Via **URL schema**: `https://wa.me/244923123456`

### Fase 2: WhatsApp Business API
- Notificações automáticas para prestadores
- Webhook recebe mensagens
- Histórico de conversas no app AchAqui
- Resposta automática via bot

### Fase 3: Chatbot Inteligente
- Bot responde perguntas comuns
- Agendamento automático
- Sugestões de serviços
- Integração com pagamento

## Fase 1 - Click-to-WhatsApp

### Implementação

#### Backend (Gerar URL)

**Rota:**
```
GET /api/whatsapp/contact-url/:providerId
```

**Controller:**
```javascript
export const getContactUrl = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Buscar prestador
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ error: 'Prestador não encontrado' });
    }

    // Formatar número WhatsApp
    const whatsappNumber = provider.provider_info?.whatsapp_number || provider.phone;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    // Gerar URL
    const message = encodeURIComponent(
      `Olá! Estou interessado no serviço de ${provider.provider_info?.business_name}`
    );
    const url = `https://wa.me/${cleanNumber}?text=${message}`;

    res.json({ url, phone: whatsappNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Frontend (React Native)

**Componente:**
```javascript
import { Linking } from 'react-native';
import axios from 'axios';

export function ContactButton({ providerId, providerName }) {
  const handleContact = async () => {
    try {
      const response = await axios.get(
        `/api/whatsapp/contact-url/${providerId}`
      );
      
      // Abrir WhatsApp
      await Linking.openURL(response.data.url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir WhatsApp');
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handleContact}
    >
      <Text style={styles.buttonText}>💬 Contactar via WhatsApp</Text>
    </TouchableOpacity>
  );
}
```

---

## Fase 2 - WhatsApp Business API

### Configuração

#### 1. Criar Conta WhatsApp Business

1. Ir para https://developers.facebook.com/
2. Criar app (tipo "Business")
3. Adicionar "WhatsApp" como produto
4. Ativar "WhatsApp Business API"
5. Obter credenciais:
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
   - `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
   - `WHATSAPP_API_TOKEN`
   - `WHATSAPP_VERIFY_TOKEN`

#### 2. Configurar Webhook

**Backend:**
```javascript
import express from 'express';
import { handleWhatsappWebhook, verifyWebhook } from '../controllers/whatsapp.js';

const router = express.Router();

// Verificação (Meta exige POST)
router.post('/webhook', verifyWebhook);

// Webhook (GET para verificação, POST para eventos)
router.get('/webhook', (req, res) => {
  const verify_token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (verify_token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Falhou');
  }
});

router.post('/webhook', handleWhatsappWebhook);

export default router;
```

**Configurar em Meta:**
- Webhook URL: `https://seu-dominio.com/api/whatsapp/webhook`
- Verify Token: valor do `.env`
- Subscribe to: `messages`, `message_status`

#### 3. Receber Mensagens

```javascript
export const handleWhatsappWebhook = async (req, res) => {
  const { object, entry } = req.body;

  if (object === 'whatsapp_business_account') {
    entry?.forEach((item) => {
      const changes = item.changes || [];
      
      changes.forEach((change) => {
        const value = change.value;
        const phoneNumberId = value.metadata?.phone_number_id;
        const businessAccountId = value.metadata?.display_phone_number;

        // Processar mensagens
        if (value.messages?.length > 0) {
          value.messages.forEach(async (msg) => {
            const {
              from,
              id,
              timestamp,
              text,
              type
            } = msg;

            console.log(`Mensagem de ${from}: ${text?.body}`);

            // Salvar no BD
            const conversation = await Conversation.create({
              phone_from: from,
              phone_to: phoneNumberId,
              message: text?.body,
              message_type: type,
              whatsapp_message_id: id,
              timestamp,
              direction: 'inbound'
            });

            // TODO: Notificar prestador
            // TODO: Resposta automática
          });
        }

        // Status de entrega
        if (value.message_status?.length > 0) {
          value.message_status.forEach(async (status) => {
            console.log(`Status: ${status.status} para msg ${status.id}`);
            
            await Conversation.updateOne(
              { whatsapp_message_id: status.id },
              { status: status.status, status_timestamp: status.timestamp }
            );
          });
        }
      });
    });

    res.status(200).json({ status: 'received' });
  } else {
    res.status(404).json({ status: 'not_found' });
  }
};
```

#### 4. Enviar Mensagens

```javascript
import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`;

export const sendWhatsappMessage = async (phone, message) => {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'text',
        text: {
          preview_url: true,
          body: message
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
        }
      }
    );

    console.log('Mensagem enviada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar:', error.response?.data);
    throw error;
  }
};

// Usar em rota
router.post('/send-message', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    const result = await sendWhatsappMessage(phone, message);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
```

---

## Modelos de Dados

### Conversation (Histórico de mensagens)

```javascript
const conversationSchema = new Schema({
  phone_from: String,           // Número do cliente
  phone_to: String,              // Número da empresa
  service_id: ObjectId,           // Ref ao serviço
  provider_id: ObjectId,          // Ref ao prestador
  client_id: ObjectId,            // Ref ao cliente
  
  message: String,
  message_type: String,           // 'text', 'image', 'document'
  whatsapp_message_id: String,    // ID único do WhatsApp
  
  direction: String,              // 'inbound' ou 'outbound'
  status: String,                 // 'sent', 'delivered', 'read'
  
  timestamp: Date,
  created_at: { type: Date, default: Date.now }
});
```

---

## Boas Práticas

### 1. Tratamento de Erros
```javascript
- Validar número de telefone (formato Angola: +244...)
- Catch de falhas na API Meta
- Retry automático (exponential backoff)
- Logging detalhado
```

### 2. Segurança
```javascript
- Verificar webhook signature da Meta
- Rate limiting (não mais que 60 msg/min)
- Sanitizar mensagens (XSS, injection)
- Criptografar números sensíveis
```

### 3. Performance
```javascript
- Usar filas (Bull, RabbitMQ) para enviar mensagens
- Cache de números de telefone validados
- Índices em phone_from, phone_to
```

### 4. Privacidade
```javascript
- Avisar usuários sobre WhatsApp
- Terminar de Serviço clara
- GDPR/LGPD compliant
```

---

## Testando Localmente

### Usar Ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Expor localhost
ngrok http 3000

# URL: https://seu-id.ngrok.io

# Configurar webhook em Meta com:
# https://seu-id.ngrok.io/api/whatsapp/webhook
```

### Testar Webhook

```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "244923123456",
            "id": "test123",
            "timestamp": "1234567890",
            "text": { "body": "Olá, teste!" },
            "type": "text"
          }]
        }
      }]
    }]
  }'
```

---

## Roadmap

- ✅ Click-to-WhatsApp (Fase 1)
- [ ] Webhook e recebimento de mensagens (Fase 2)
- [ ] Envio de notificações automáticas (Fase 2)
- [ ] Bot com IA (Fase 3)
- [ ] Agendamento automático (Fase 3)
- [ ] Integração com pagamento (Fase 3/4)

---

**Documentação**: Meta WhatsApp Business API
https://developers.facebook.com/docs/whatsapp/cloud-api/

**Última atualização**: Fevereiro 2026
