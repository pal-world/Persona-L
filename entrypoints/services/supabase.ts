import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const SUPABASE_URL = 'https://pdjaatezkzzhjkfjjntn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkamFhdGV6a3p6aGprZmpqbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODAwNjgsImV4cCI6MjA1Njc1NjA2OH0.tVuIdJ9w6VfHBm6uNaDXnZLNMkoNmO-w_FFVy735j9I';

// Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 