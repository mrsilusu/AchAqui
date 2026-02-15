import express from 'express';
import supabase from '../config/supabase.js';
import logger from '../config/logger.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      location,
      provider_info
    } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'name, password e email ou phone são obrigatórios'
      });
    }

    const { data: createdUser, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        phone,
        password,
        email_confirm: true,
        phone_confirm: true
      });

    if (createError) {
      return res.status(400).json({
        status: 'error',
        message: createError.message
      });
    }

    const userId = createdUser?.user?.id;

    const profilePayload = {
      id: userId,
      name,
      email: email || null,
      phone: phone || null,
      role: role || 'client',
      location: location || null,
      provider_info: provider_info || null,
      rating_average: 0,
      rating_count: 0,
      is_verified: false,
      is_active: true
    };

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert(profilePayload)
      .select('*')
      .single();

    if (profileError) {
      logger.error('Erro ao criar perfil:', profileError);
      if (userId) {
        await supabase.auth.admin.deleteUser(userId);
      }
      return res.status(400).json({
        status: 'error',
        message: profileError.message
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: profileData
    });
  } catch (error) {
    return res.status(400).json({
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email e password são obrigatórios'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login realizado com sucesso',
      token: data?.session?.access_token,
      user: data?.user
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
