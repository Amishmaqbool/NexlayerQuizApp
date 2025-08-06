-- Temporary cleanup of anonymous quiz sessions and user responses
-- This migration will clean up all sessions and responses where user_id is null

-- First, delete user_responses associated with anonymous sessions
DELETE FROM public.user_responses 
WHERE session_id IN (
    SELECT id FROM public.quiz_sessions WHERE user_id IS NULL
);

-- Then delete the anonymous quiz sessions
DELETE FROM public.quiz_sessions WHERE user_id IS NULL;

-- Add a comment for tracking
COMMENT ON TABLE public.quiz_sessions IS 'Quiz sessions table - cleaned anonymous data on 2025-08-06';
