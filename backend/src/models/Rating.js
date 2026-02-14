import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    // Usuário que faz a avaliação
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // O que está sendo avaliado
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Avaliação
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: String,

    // Aspectos da avaliação
    aspects: {
      professionalism: Number,
      punctuality: Number,
      quality: Number,
      communication: Number
    },

    // Imagens (opcional)
    images: [String],

    // Resposta do prestador
    provider_reply: {
      comment: String,
      created_at: Date
    },

    // Status
    is_verified_purchase: {
      type: Boolean,
      default: false
    },

    // Auditoria
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Índices
ratingSchema.index({ provider_id: 1 });
ratingSchema.index({ service_id: 1 });
ratingSchema.index({ user_id: 1 });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
