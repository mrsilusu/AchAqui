import express from 'express';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // TODO: Implementar lógica de registro
    res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Fazer login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // TODO: Implementar lógica de login
    res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      token: 'JWT_TOKEN_HERE'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
