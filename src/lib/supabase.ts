
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlitpoqjdxbwtwrdxqls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaXRwb3FqZHhid3R3cmR4cWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjQzOTMsImV4cCI6MjA2NTUwMDM5M30.Pe-FMtt2HNhRzDcfEaF7UC1dYJlkVHZlM_bmu5Atgbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
