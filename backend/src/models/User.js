import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Informações básicas
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // Perfil
    role: {
      type: String,
      enum: ['client', 'provider'],
      default: 'client'
    },
    avatar_url: String,
    bio: String,

    // Localização
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      province: String
    },

    // Para prestadores
    provider_info: {
      business_name: String,
      category: String,
      description: String,
      whatsapp_number: String,
      website: String,
      experience_years: Number
    },

    // Estatísticas
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
    is_verified: {
      type: Boolean,
      default: false
    },
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

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'location.city': 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
