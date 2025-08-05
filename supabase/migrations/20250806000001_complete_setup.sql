-- Complete Nexlayer Quiz Database Setup
-- This migration creates all necessary tables and populates them with quiz data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create question_options table
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID NULL,
    score INTEGER,
    total_questions INTEGER NOT NULL,
    time_spent INTEGER DEFAULT 0,
    answers JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_responses table (for detailed answer tracking)
CREATE TABLE IF NOT EXISTS public.user_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES public.question_options(id),
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear any existing data
TRUNCATE public.user_responses, public.quiz_sessions, public.question_options, public.questions, public.quizzes RESTART IDENTITY CASCADE;

-- Insert Nexlayer-focused quizzes
INSERT INTO public.quizzes (title, description) VALUES 
('Nexlayer Fundamentals', 'Test your knowledge of Nexlayer core concepts and features'),
('AI-Native Cloud Deployment', 'Advanced concepts about deploying AI applications with Nexlayer'),
('Nexlayer Configuration & CLI', 'Master the Nexlayer CLI and configuration files');

-- Create comprehensive quiz with 15+ questions each
DO $$
DECLARE
  fundamentals_quiz_id UUID;
  deployment_quiz_id UUID;
  config_quiz_id UUID;
  q_id UUID;
BEGIN
  -- Get quiz IDs
  SELECT id INTO fundamentals_quiz_id FROM public.quizzes WHERE title = 'Nexlayer Fundamentals';
  SELECT id INTO deployment_quiz_id FROM public.quizzes WHERE title = 'AI-Native Cloud Deployment';
  SELECT id INTO config_quiz_id FROM public.quizzes WHERE title = 'Nexlayer Configuration & CLI';
  
  -- NEXLAYER FUNDAMENTALS QUIZ (16 questions)
  
  -- Question 1
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is Nexlayer''s main value proposition?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'One launchfile. Entire AI stack. Live in minutes.', true),
  (q_id, 'Traditional hosting with complex configuration', false),
  (q_id, 'Only frontend deployment', false),
  (q_id, 'Database-only cloud service', false);
  
  -- Question 2
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What file format does Nexlayer use for configuration?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer.yaml', true),
  (q_id, 'config.json', false),
  (q_id, 'dockerfile', false),
  (q_id, 'package.json', false);
  
  -- Question 3
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'Which command initializes a new Nexlayer project?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer init', true),
  (q_id, 'nexlayer start', false),
  (q_id, 'nexlayer create', false),
  (q_id, 'nexlayer new', false);
  
  -- Question 4
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is Nexlayer''s target uptime?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, '99.99%', true),
  (q_id, '99.9%', false),
  (q_id, '95%', false),
  (q_id, '90%', false);
  
  -- Question 5
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is the typical latency Nexlayer aims for?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, '100ms', true),
  (q_id, '500ms', false),
  (q_id, '1000ms', false),
  (q_id, '50ms', false);
  
  -- Question 6
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'Who is Nexlayer primarily built for?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Developers, AI Startups, and AI Agents', true),
  (q_id, 'Only enterprise companies', false),
  (q_id, 'Only individual developers', false),
  (q_id, 'Only data scientists', false);
  
  -- Question 7
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What does Nexlayer eliminate the need for?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Infrastructure PhD and complex DevOps setup', true),
  (q_id, 'Writing code', false),
  (q_id, 'Using databases', false),
  (q_id, 'Frontend development', false);
  
  -- Question 8
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'Which AI tools work well with Nexlayer for generating code?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'v0, Cursor, Copilot, Windsurf, Claude, ChatGPT', true),
  (q_id, 'Only ChatGPT', false),
  (q_id, 'Only GitHub Copilot', false),
  (q_id, 'None - you must write code manually', false);
  
  -- Question 9
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is the key benefit of Nexlayer''s approach to cloud deployment?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'From prototype to product in minutes, not months', true),
  (q_id, 'Only works for simple applications', false),
  (q_id, 'Requires extensive configuration', false),
  (q_id, 'Limited to specific programming languages', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What type of applications is Nexlayer optimized for?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'AI-native applications and modern web apps', true),
  (q_id, 'Only legacy applications', false),
  (q_id, 'Only mobile applications', false),
  (q_id, 'Only desktop applications', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'How does Nexlayer handle scaling?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic scaling based on demand', true),
  (q_id, 'Manual scaling only', false),
  (q_id, 'No scaling capabilities', false),
  (q_id, 'Requires custom scaling scripts', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is Nexlayer''s approach to developer experience?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Simple, intuitive, and agent-friendly', true),
  (q_id, 'Complex configuration required', false),
  (q_id, 'Command-line only interface', false),
  (q_id, 'Requires extensive training', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What industries benefit most from Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'AI startups, SaaS companies, and modern development teams', true),
  (q_id, 'Only traditional enterprises', false),
  (q_id, 'Only government organizations', false),
  (q_id, 'Only educational institutions', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'How does Nexlayer support AI agents?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Provides APIs and interfaces that AI agents can easily use', true),
  (q_id, 'Does not support AI agents', false),
  (q_id, 'Requires custom integration for each agent', false),
  (q_id, 'Only works with specific AI models', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is the typical deployment time with Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Minutes instead of hours or days', true),
  (q_id, 'Several hours', false),
  (q_id, 'Multiple days', false),
  (q_id, 'Weeks for complex applications', false);
  
  -- Question 16
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What makes Nexlayer different from traditional cloud providers?', 3) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'AI-native design with zero-configuration deployment', true),
  (q_id, 'Same as traditional providers but cheaper', false),
  (q_id, 'Only focuses on compute power', false),
  (q_id, 'Requires more manual configuration', false);

  -- AI-NATIVE CLOUD DEPLOYMENT QUIZ (15 questions)
  
  -- Question 1
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is the first step in deploying with Nexlayer?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Create a nexlayer.yaml file', true),
  (q_id, 'Set up Docker containers', false),
  (q_id, 'Configure load balancers', false),
  (q_id, 'Purchase dedicated servers', false);
  
  -- Question 2
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle environment variables?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatically managed through the configuration file', true),
  (q_id, 'Must be set manually on each server', false),
  (q_id, 'Not supported', false),
  (q_id, 'Only through command line', false);
  
  -- Question 3
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What types of AI models can be deployed on Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Any AI model including LLMs, computer vision, and ML models', true),
  (q_id, 'Only OpenAI models', false),
  (q_id, 'Only image processing models', false),
  (q_id, 'Only small models under 1GB', false);
  
  -- Question 4
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle database connections?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic provisioning and connection management', true),
  (q_id, 'Manual database setup required', false),
  (q_id, 'No database support', false),
  (q_id, 'Only supports MongoDB', false);
  
  -- Question 5
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is Nexlayer''s approach to API deployment?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic API endpoint generation and management', true),
  (q_id, 'Manual API configuration only', false),
  (q_id, 'No API support', false),
  (q_id, 'Requires separate API gateway setup', false);
  
  -- Question 6
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle SSL certificates?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic SSL certificate provisioning and renewal', true),
  (q_id, 'Manual certificate installation required', false),
  (q_id, 'No SSL support', false),
  (q_id, 'Only supports self-signed certificates', false);
  
  -- Question 7
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What monitoring capabilities does Nexlayer provide?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Built-in monitoring, logging, and alerting', true),
  (q_id, 'No monitoring features', false),
  (q_id, 'Only basic uptime monitoring', false),
  (q_id, 'Requires third-party monitoring tools', false);
  
  -- Question 8
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle traffic spikes?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic scaling to handle increased load', true),
  (q_id, 'Manual scaling intervention required', false),
  (q_id, 'Fixed capacity only', false),
  (q_id, 'Application crashes under load', false);
  
  -- Question 9
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is Nexlayer''s approach to CI/CD?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Integrated CI/CD pipeline with Git integration', true),
  (q_id, 'No CI/CD support', false),
  (q_id, 'Manual deployment only', false),
  (q_id, 'Requires separate CI/CD tools', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle multi-region deployment?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic multi-region distribution for low latency', true),
  (q_id, 'Single region deployment only', false),
  (q_id, 'Manual region configuration required', false),
  (q_id, 'No multi-region support', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What backup and recovery options does Nexlayer provide?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic backups with point-in-time recovery', true),
  (q_id, 'No backup capabilities', false),
  (q_id, 'Manual backup only', false),
  (q_id, 'Backup requires additional services', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer support containerized applications?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Native container support with automatic orchestration', true),
  (q_id, 'No container support', false),
  (q_id, 'Manual container management required', false),
  (q_id, 'Only supports specific container formats', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What security features does Nexlayer implement?', 3) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'End-to-end encryption, WAF, and DDoS protection', true),
  (q_id, 'Basic password protection only', false),
  (q_id, 'No security features', false),
  (q_id, 'Security must be implemented by users', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle dependency management?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic dependency resolution and installation', true),
  (q_id, 'Manual dependency installation required', false),
  (q_id, 'No dependency support', false),
  (q_id, 'Limited to specific package managers', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is the typical rollback time if issues occur?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Instant rollback to previous working version', true),
  (q_id, 'Several hours for rollback', false),
  (q_id, 'Manual intervention required', false),
  (q_id, 'No rollback capability', false);

  -- NEXLAYER CONFIGURATION & CLI QUIZ (15 questions)
  
  -- Question 1
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is the main configuration file for Nexlayer projects?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer.yaml', true),
  (q_id, 'nexlayer.json', false),
  (q_id, 'config.yaml', false),
  (q_id, 'deploy.yaml', false);
  
  -- Question 2
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which command shows the current Nexlayer CLI version?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer --version', true),
  (q_id, 'nexlayer version', false),
  (q_id, 'nexlayer -v', false),
  (q_id, 'nexlayer info', false);
  
  -- Question 3
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you deploy a project using Nexlayer CLI?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer deploy', true),
  (q_id, 'nexlayer push', false),
  (q_id, 'nexlayer start', false),
  (q_id, 'nexlayer run', false);
  
  -- Question 4
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What section in nexlayer.yaml defines the application runtime?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'runtime', true),
  (q_id, 'app', false),
  (q_id, 'service', false),
  (q_id, 'container', false);
  
  -- Question 5
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you specify environment variables in nexlayer.yaml?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Under the env section', true),
  (q_id, 'In a separate .env file only', false),
  (q_id, 'Environment variables are not supported', false),
  (q_id, 'Through command line only', false);
  
  -- Question 6
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which command shows the deployment status?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer status', true),
  (q_id, 'nexlayer info', false),
  (q_id, 'nexlayer check', false),
  (q_id, 'nexlayer list', false);
  
  -- Question 7
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you configure custom domains in Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'In the domains section of nexlayer.yaml', true),
  (q_id, 'Through DNS settings only', false),
  (q_id, 'Custom domains are not supported', false),
  (q_id, 'Via separate configuration file', false);
  
  -- Question 8
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What command is used to view application logs?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer logs', true),
  (q_id, 'nexlayer debug', false),
  (q_id, 'nexlayer output', false),
  (q_id, 'nexlayer trace', false);
  
  -- Question 9
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you scale an application in nexlayer.yaml?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Using the scaling section with min/max instances', true),
  (q_id, 'Scaling is automatic and cannot be configured', false),
  (q_id, 'Through command line parameters only', false),
  (q_id, 'Scaling is not supported', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which command removes a deployed application?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer destroy', true),
  (q_id, 'nexlayer delete', false),
  (q_id, 'nexlayer remove', false),
  (q_id, 'nexlayer stop', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you configure database connections in nexlayer.yaml?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'In the database section with connection details', true),
  (q_id, 'Databases must be configured separately', false),
  (q_id, 'Database connections are not supported', false),
  (q_id, 'Only through environment variables', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What command validates your nexlayer.yaml configuration?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer validate', true),
  (q_id, 'nexlayer check', false),
  (q_id, 'nexlayer test', false),
  (q_id, 'nexlayer verify', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you specify build commands in nexlayer.yaml?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'In the build section with pre and post commands', true),
  (q_id, 'Build commands are automatic', false),
  (q_id, 'Through separate build scripts only', false),
  (q_id, 'Build commands are not supported', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which command shows available Nexlayer CLI commands?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'nexlayer help', true),
  (q_id, 'nexlayer commands', false),
  (q_id, 'nexlayer list', false),
  (q_id, 'nexlayer options', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you configure health checks in nexlayer.yaml?', 3) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'In the health section with endpoint and interval settings', true),
  (q_id, 'Health checks are automatic', false),
  (q_id, 'Through monitoring tools only', false),
  (q_id, 'Health checks are not configurable', false);

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_id ON public.quiz_sessions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON public.quiz_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON public.user_responses(session_id);

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for quizzes and questions
CREATE POLICY "Allow public read access to quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to question_options" ON public.question_options FOR SELECT USING (true);

-- Allow anyone to create quiz sessions and responses
CREATE POLICY "Allow public insert to quiz_sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of quiz_sessions" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to user_responses" ON public.user_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of user_responses" ON public.user_responses FOR SELECT USING (true);
