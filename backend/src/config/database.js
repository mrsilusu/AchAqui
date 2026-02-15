import supabase from './supabase.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    if (!process.env.SUPABASE_URL) {
      throw new Error('SUPABASE_URL não configurada');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY não configurada');
    }

    logger.info(`Supabase configurado: ${process.env.SUPABASE_URL}`);
    return supabase;
  } catch (error) {
    logger.error(`Erro ao configurar Supabase: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
