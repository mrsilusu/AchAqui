import { createClient } from '@supabase/supabase-js';
import logger from './logger.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  logger.warn('SUPABASE_URL or SUPABASE_KEY not set. Supabase client may not work.');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

export default supabase;
