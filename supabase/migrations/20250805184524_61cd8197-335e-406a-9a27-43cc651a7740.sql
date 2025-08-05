-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  points INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create question_options table
CREATE TABLE public.question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_sessions table to track user attempts
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID,
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_responses table
CREATE TABLE public.user_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.question_options(id),
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (quizzes are public)
CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Question options are viewable by everyone" ON public.question_options FOR SELECT USING (true);

-- Quiz sessions and responses can be created by anyone, viewed by all
CREATE POLICY "Anyone can create quiz sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Quiz sessions are viewable by everyone" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create user responses" ON public.user_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "User responses are viewable by everyone" ON public.user_responses FOR SELECT USING (true);

-- Insert sample quiz data
INSERT INTO public.quizzes (title, description) VALUES 
('JavaScript Fundamentals', 'Test your knowledge of basic JavaScript concepts'),
('React Basics', 'Quiz about React fundamentals and components'),
('Web Development', 'General web development knowledge');

-- Get the quiz IDs for inserting questions
DO $$
DECLARE
  js_quiz_id UUID;
  react_quiz_id UUID;
  web_quiz_id UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
  q5_id UUID;
  q6_id UUID;
BEGIN
  -- Get quiz IDs
  SELECT id INTO js_quiz_id FROM public.quizzes WHERE title = 'JavaScript Fundamentals';
  SELECT id INTO react_quiz_id FROM public.quizzes WHERE title = 'React Basics';
  SELECT id INTO web_quiz_id FROM public.quizzes WHERE title = 'Web Development';
  
  -- Insert JavaScript questions
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (js_quiz_id, 'What is the correct way to declare a variable in JavaScript?') RETURNING id INTO q1_id;
  
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (js_quiz_id, 'Which method is used to add an element to the end of an array?') RETURNING id INTO q2_id;
  
  -- Insert React questions
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (react_quiz_id, 'What is JSX?') RETURNING id INTO q3_id;
  
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (react_quiz_id, 'Which hook is used for state management in functional components?') RETURNING id INTO q4_id;
  
  -- Insert Web Dev questions
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (web_quiz_id, 'What does HTML stand for?') RETURNING id INTO q5_id;
  
  INSERT INTO public.questions (quiz_id, question_text) VALUES 
  (web_quiz_id, 'Which CSS property is used to change text color?') RETURNING id INTO q6_id;
  
  -- Insert options for JavaScript questions
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q1_id, 'var myVar;', true),
  (q1_id, 'variable myVar;', false),
  (q1_id, 'v myVar;', false),
  (q1_id, 'declare myVar;', false);
  
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q2_id, 'push()', true),
  (q2_id, 'add()', false),
  (q2_id, 'append()', false),
  (q2_id, 'insert()', false);
  
  -- Insert options for React questions
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q3_id, 'JavaScript XML - a syntax extension for JavaScript', true),
  (q3_id, 'A new programming language', false),
  (q3_id, 'A CSS framework', false),
  (q3_id, 'A database query language', false);
  
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q4_id, 'useState', true),
  (q4_id, 'useEffect', false),
  (q4_id, 'useContext', false),
  (q4_id, 'useReducer', false);
  
  -- Insert options for Web Dev questions
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q5_id, 'HyperText Markup Language', true),
  (q5_id, 'High Tech Modern Language', false),
  (q5_id, 'Home Tool Markup Language', false),
  (q5_id, 'Hyperlink Text Management Language', false);
  
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q6_id, 'color', true),
  (q6_id, 'text-color', false),
  (q6_id, 'font-color', false),
  (q6_id, 'text-style', false);
END $$;