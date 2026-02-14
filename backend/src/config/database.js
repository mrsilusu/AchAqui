import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Erro ao conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
