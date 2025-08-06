-- Enable Row Level Security for quiz_sessions table
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for quiz_sessions - users can only see/insert their own sessions
CREATE POLICY "Users can only see their own quiz sessions" ON public.quiz_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Allow users to insert their own quiz sessions
CREATE POLICY "Users can insert their own quiz sessions" ON public.quiz_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Row Level Security for user_responses table
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for user_responses - users can only see/insert responses for their own sessions
CREATE POLICY "Users can only see their own responses" ON public.user_responses
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.quiz_sessions WHERE user_id = auth.uid()
        )
    );

-- Allow users to insert responses for their own sessions
CREATE POLICY "Users can insert responses for their own sessions" ON public.user_responses
    FOR INSERT WITH CHECK (
        session_id IN (
            SELECT id FROM public.quiz_sessions WHERE user_id = auth.uid()
        )
    );

-- Allow anyone to read quizzes, questions, and options (these are public)
-- No RLS needed for these tables as they should be readable by all users
