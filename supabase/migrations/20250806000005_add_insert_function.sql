-- Create a function to insert quiz sessions directly
CREATE OR REPLACE FUNCTION insert_quiz_session(
    p_quiz_id UUID,
    p_user_id UUID,
    p_score INTEGER,
    p_total_questions INTEGER,
    p_time_spent INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO public.quiz_sessions (
        id,
        quiz_id,
        user_id,
        score,
        total_questions,
        time_spent,
        completed_at,
        created_at
    ) VALUES (
        gen_random_uuid(),
        p_quiz_id,
        p_user_id,
        p_score,
        p_total_questions,
        COALESCE(p_time_spent, 0),
        NOW(),
        NOW()
    )
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_quiz_session TO authenticated;
GRANT EXECUTE ON FUNCTION insert_quiz_session TO anon;
