import express from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Obter informações do usuário
// @access  Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.id !== id) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.id !== id) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    const updates = {
      name: req.body.name,
      avatar_url: req.body.avatar_url,
      bio: req.body.bio,
      location: req.body.location,
      provider_info: req.body.provider_info,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
