import express from 'express';
import supabase from '../config/supabase.js';
import requireAuth from '../middlewares/auth.js';

const router = express.Router();

const calculateNewAverage = (currentAverage, currentCount, newScore) => {
  const total = (currentAverage || 0) * (currentCount || 0) + newScore;
  const count = (currentCount || 0) + 1;
  return { average: Number((total / count).toFixed(2)), count };
};

// @route   GET /api/ratings/service/:serviceId
// @desc    Obter avaliações de um serviço
// @access  Public
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    const { data, error, count } = await supabase
      .from('ratings')
      .select(
        'id,score,title,comment,aspects,images,created_at,user:users(id,name,avatar_url)',
        { count: 'exact' }
      )
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false })
      .range(from, to);

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

// @route   POST /api/ratings
// @desc    Criar avaliação
// @access  Private
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      service_id,
      score,
      title,
      comment,
      aspects,
      images
    } = req.body;

    if (!service_id || !score) {
      return res.status(400).json({
        status: 'error',
        message: 'service_id e score são obrigatórios'
      });
    }

    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id,provider_id,rating_average,rating_count')
      .eq('id', service_id)
      .single();

    if (serviceError || !service) {
      return res.status(404).json({
        status: 'error',
        message: 'Serviço não encontrado'
      });
    }

    const payload = {
      user_id: req.user.id,
      service_id,
      provider_id: service.provider_id,
      score,
      title: title || null,
      comment: comment || null,
      aspects: aspects || null,
      images: images || [],
      is_verified_purchase: false
    };

    const { data: rating, error: ratingError } = await supabase
      .from('ratings')
      .insert(payload)
      .select('*')
      .single();

    if (ratingError) {
      return res.status(400).json({
        status: 'error',
        message: ratingError.message
      });
    }

    const serviceRating = calculateNewAverage(
      service.rating_average,
      service.rating_count,
      Number(score)
    );

    await supabase
      .from('services')
      .update({
        rating_average: serviceRating.average,
        rating_count: serviceRating.count
      })
      .eq('id', service_id);

    const { data: provider, error: providerError } = await supabase
      .from('users')
      .select('id,rating_average,rating_count')
      .eq('id', service.provider_id)
      .single();

    if (!providerError && provider) {
      const providerRating = calculateNewAverage(
        provider.rating_average,
        provider.rating_count,
        Number(score)
      );

      await supabase
        .from('users')
        .update({
          rating_average: providerRating.average,
          rating_count: providerRating.count
        })
        .eq('id', provider.id);
    }

    return res.status(201).json({
      status: 'success',
      data: rating
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
