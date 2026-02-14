import express from 'express';

const router = express.Router();

// @route   POST /api/whatsapp/webhook
// @desc    Webhook para receber mensagens do WhatsApp
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const { object, entry } = req.body;

    if (object === 'whatsapp_business_account') {
      entry?.forEach((item) => {
        const changes = item.changes || [];
        
        changes.forEach((change) => {
          const value = change.value;
          
          if (value.messages?.length > 0) {
            value.messages.forEach((msg) => {
              // TODO: Processar mensagens recebidas
              console.log('Mensagem recebida:', msg);
            });
          }
        });
      });
      
      res.status(200).json({ status: 'received' });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   GET /api/whatsapp/webhook
// @desc    Verificar webhook (Meta exige)
// @access  Public
router.get('/webhook', (req, res) => {
  const verify_token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (verify_token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Token verification failed');
  }
});

// @route   POST /api/whatsapp/send-message
// @desc    Enviar mensagem via WhatsApp
// @access  Private
router.post('/send-message', async (req, res) => {
  try {
    // TODO: Implementar envio de mensagens
    res.status(200).json({
      status: 'success',
      message: 'Mensagem enviada'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
