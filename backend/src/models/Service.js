import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    // Informações do serviço
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'Mecânica',
        'Elétrica',
        'Encanamento',
        'Saúde',
        'Beleza',
        'Limpeza',
        'Transporte',
        'Construção',
        'Tecnologia',
        'Outro'
      ],
      required: true
    },

    // Prestador
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Detalhes
    price: {
      value: Number,
      currency: {
        type: String,
        default: 'AOA' // Kwanza angolano
      }
    },
    duration_minutes: Number,
    availability: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    },

    // Imagens
    images: [String],

    // Avaliações
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },

    // Status
    is_active: {
      type: Boolean,
      default: true
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
serviceSchema.index({ provider_id: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ is_active: 1 });
serviceSchema.index({ 'rating.average': -1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
