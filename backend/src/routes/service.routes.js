import express from 'express';

const router = express.Router();

// @route   GET /api/services
// @desc    Listar serviços
// @access  Public
router.get('/', async (req, res) => {
  try {
    // TODO: Implementar busca com filtros: categoria, localização, etc
    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   GET /api/services/:id
// @desc    Obter detalhes de um serviço
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // TODO: Implementar lógica
    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   POST /api/services
// @desc    Criar novo serviço (prestador)
// @access  Private
router.post('/', async (req, res) => {
  try {
    // TODO: Implementar lógica
    res.status(201).json({
      status: 'success',
      message: 'Serviço criado'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
