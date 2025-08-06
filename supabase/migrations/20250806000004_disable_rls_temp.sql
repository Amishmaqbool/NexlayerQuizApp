-- Temporarily disable RLS to test quiz session saving
ALTER TABLE public.quiz_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses DISABLE ROW LEVEL SECURITY;

-- Add comment for tracking
COMMENT ON TABLE public.quiz_sessions IS 'RLS temporarily disabled for testing - 2025-08-06';
