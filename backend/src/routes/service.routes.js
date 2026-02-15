import express from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/auth.js';

const router = express.Router();

// @route   GET /api/services
// @desc    Listar serviços
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      page = 1,
      limit = 20,
      provider_id
    } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase
      .from('services')
      .select(
        'id,title,description,category,price_value,price_currency,images,rating_average,rating_count,is_active,created_at,provider:users(id,name,avatar_url,provider_info,rating_average,rating_count,phone)',
        { count: 'exact' }
      )
      .eq('is_active', true)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (provider_id) {
      query = query.eq('provider_id', provider_id);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(200).json({
      status: 'success',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    return res.status(400).json({
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
    const { id } = req.params;

    const { data, error } = await supabase
      .from('services')
      .select(
        'id,title,description,category,price_value,price_currency,images,availability,rating_average,rating_count,is_active,created_at,provider:users(id,name,avatar_url,provider_info,rating_average,rating_count,phone)',
      )
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

// @route   POST /api/services
// @desc    Criar novo serviço (prestador)
// @access  Private
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      images,
      availability
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'title, description e category são obrigatórios'
      });
    }

    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id,role')
      .eq('id', req.user.id)
      .single();

    if (userError || !userProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    if (userProfile.role !== 'provider') {
      return res.status(403).json({
        status: 'error',
        message: 'Apenas prestadores podem criar serviços'
      });
    }

    const payload = {
      title,
      description,
      category,
      provider_id: req.user.id,
      price_value: price?.value ?? null,
      price_currency: price?.currency ?? 'AOA',
      images: images || [],
      availability: availability || null,
      rating_average: 0,
      rating_count: 0,
      is_active: true
    };

    const { data, error } = await supabase
      .from('services')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(201).json({
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
