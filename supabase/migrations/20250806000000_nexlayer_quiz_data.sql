-- Clear existing sample data and add Nexlayer-specific quizzes
DELETE FROM public.user_responses;
DELETE FROM public.quiz_sessions;
DELETE FROM public.question_options;
DELETE FROM public.questions;
DELETE FROM public.quizzes;

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
  (fundamentals_quiz_id, 'What is Nexlayer building for the future?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'The runtime of the agent era', true),
  (q_id, 'A traditional web hosting service', false),
  (q_id, 'A code editor', false),
  (q_id, 'A social media platform', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What do you need to get started with Nexlayer?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'No login, no credit card - just deploy', true),
  (q_id, 'Credit card and enterprise account', false),
  (q_id, 'PhD in computer science', false),
  (q_id, 'DevOps certification', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'How fast can you go from zero to global deployment with Nexlayer?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, '60 seconds', true),
  (q_id, '60 minutes', false),
  (q_id, '6 hours', false),
  (q_id, '1 day', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What type of applications can Nexlayer deploy?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Full-stack apps with AI, databases, backends, frontends', true),
  (q_id, 'Only static websites', false),
  (q_id, 'Only mobile apps', false),
  (q_id, 'Only databases', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What makes Nexlayer "AI-Native"?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Built specifically for AI agents and autonomous deployments', true),
  (q_id, 'It only uses AI to write code', false),
  (q_id, 'It has a chatbot interface', false),
  (q_id, 'It only deploys AI models', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What infrastructure components does Nexlayer handle automatically?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Networking, scaling, secrets, environment variables, service connections', true),
  (q_id, 'Only web servers', false),
  (q_id, 'Only databases', false),
  (q_id, 'Only domain names', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is the Nexlayer Playground?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'A place to start from scratch or modify starter templates', true),
  (q_id, 'A gaming platform', false),
  (q_id, 'A social media feature', false),
  (q_id, 'A code editor', false);
  
  -- Question 16
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (fundamentals_quiz_id, 'What is the domain format for deployed Nexlayer apps?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'yourapp.nexlayer.ai', true),
  (q_id, 'yourapp.herokuapp.com', false),
  (q_id, 'yourapp.vercel.app', false),
  (q_id, 'yourapp.netlify.app', false);
  
  -- AI-NATIVE CLOUD DEPLOYMENT QUIZ (15 questions)
  
  -- Question 1
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is the main problem Nexlayer solves for AI-generated code?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'The complex deployment and infrastructure setup after code generation', true),
  (q_id, 'Making AI generate better code', false),
  (q_id, 'Teaching people to code', false),
  (q_id, 'Creating AI models', false);
  
  -- Question 2
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What stack example is shown in the Nexlayer documentation?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'PERN Stack (Postgres, Express, React, Node)', true),
  (q_id, 'LAMP Stack', false),
  (q_id, 'MEAN Stack', false),
  (q_id, 'Django Stack', false);
  
  -- Question 3
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'In a nexlayer.yaml file, what does the "pods" section define?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Individual services/containers in your application stack', true),
  (q_id, 'Database schemas', false),
  (q_id, 'User permissions', false),
  (q_id, 'Domain names', false);
  
  -- Question 4
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How do services communicate with each other in Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Using .pod domains (e.g., postgres.pod, express.pod)', true),
  (q_id, 'Using IP addresses only', false),
  (q_id, 'Using external URLs', false),
  (q_id, 'They cannot communicate', false);
  
  -- Question 5
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What happens when you run "nexlayer deploy"?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Builds, provisions infrastructure, and deploys to production', true),
  (q_id, 'Only builds the application locally', false),
  (q_id, 'Only uploads files', false),
  (q_id, 'Only runs tests', false);
  
  -- Question 6
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What type of volumes can be defined in nexlayer.yaml?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Persistent storage volumes with size and mount path', true),
  (q_id, 'Only temporary storage', false),
  (q_id, 'Only external drives', false),
  (q_id, 'Only database backups', false);
  
  -- Question 7
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How are environment variables handled in Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Defined in the "vars" section of each pod', true),
  (q_id, 'Hard-coded in the application', false),
  (q_id, 'Set manually after deployment', false),
  (q_id, 'Not supported', false);
  
  -- Question 8
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is the "Vibe Deploy" method in Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'A curl-based deployment method for quick deploys', true),
  (q_id, 'A mobile app deployment', false),
  (q_id, 'A desktop application', false),
  (q_id, 'A social media integration', false);
  
  -- Question 9
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What image registry does Nexlayer use in examples?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'ttl.sh (temporary image storage)', true),
  (q_id, 'Docker Hub only', false),
  (q_id, 'AWS ECR only', false),
  (q_id, 'Google Container Registry only', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What makes Nexlayer suitable for AI startups?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Scale globally without hiring DevOps teams', true),
  (q_id, 'Only works with Python', false),
  (q_id, 'Only deploys machine learning models', false),
  (q_id, 'Requires extensive configuration', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How does Nexlayer handle service ports?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Defined in servicePorts array for each pod', true),
  (q_id, 'Automatically assigned random ports', false),
  (q_id, 'All services use port 80', false),
  (q_id, 'Ports cannot be configured', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is the purpose of the "path" field in a pod definition?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Defines the URL path where the service is accessible', true),
  (q_id, 'Defines the file system path', false),
  (q_id, 'Defines the code repository path', false),
  (q_id, 'Not used in Nexlayer', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'How quickly can Nexlayer provision infrastructure?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Within seconds to minutes', true),
  (q_id, 'Several hours', false),
  (q_id, 'Several days', false),
  (q_id, 'Several weeks', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What is Nexlayer''s approach to scaling?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Automatic scaling handled by the platform', true),
  (q_id, 'Manual server management required', false),
  (q_id, 'Fixed scaling only', false),
  (q_id, 'No scaling support', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (deployment_quiz_id, 'What testimonial mentioned shipping in 42 seconds?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Sarah Chen, CTO of AI Startup', true),
  (q_id, 'Michael Rodriguez, Lead Developer', false),
  (q_id, 'Aisha Johnson, AI Researcher', false),
  (q_id, 'Anonymous user', false);
  
  -- NEXLAYER CONFIGURATION & CLI QUIZ (15 questions)
  
  -- Question 1
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you install the Nexlayer CLI?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'curl -sSL https://raw.githubusercontent.com/Nexlayer/nexlayer-cli/main/direct_install.sh | bash', true),
  (q_id, 'npm install -g nexlayer', false),
  (q_id, 'pip install nexlayer', false),
  (q_id, 'brew install nexlayer', false);
  
  -- Question 2
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is the first field in a nexlayer.yaml file?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'application:', true),
  (q_id, 'config:', false),
  (q_id, 'deployment:', false),
  (q_id, 'services:', false);
  
  -- Question 3
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is required under the application section?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'name and pods', true),
  (q_id, 'only name', false),
  (q_id, 'only pods', false),
  (q_id, 'version and author', false);
  
  -- Question 4
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which field specifies the Docker image for a pod?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'image:', true),
  (q_id, 'container:', false),
  (q_id, 'docker:', false),
  (q_id, 'registry:', false);
  
  -- Question 5
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you specify persistent storage size?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'size: 2Gi (in the volumes section)', true),
  (q_id, 'storage: 2GB', false),
  (q_id, 'disk: 2000MB', false),
  (q_id, 'space: 2G', false);
  
  -- Question 6
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you reference environment variables from other pods?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'Using the .pod domain (e.g., http://postgres.pod:5432)', true),
  (q_id, 'Using localhost', false),
  (q_id, 'Using IP addresses', false),
  (q_id, 'Using external URLs', false);
  
  -- Question 7
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is the syntax for defining multiple service ports?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'servicePorts: [80, 443, 3000]', true),
  (q_id, 'ports: "80,443,3000"', false),
  (q_id, 'servicePort: 80', false),
  (q_id, 'expose: [80, 443, 3000]', false);
  
  -- Question 8
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'How do you specify where a volume should be mounted?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'mountPath: /var/lib/postgresql', true),
  (q_id, 'path: /var/lib/postgresql', false),
  (q_id, 'directory: /var/lib/postgresql', false),
  (q_id, 'location: /var/lib/postgresql', false);
  
  -- Question 9
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is the correct YAML indentation for pod definitions?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, '2 spaces per level', true),
  (q_id, '4 spaces per level', false),
  (q_id, 'Tabs only', false),
  (q_id, '1 space per level', false);
  
  -- Question 10
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What API endpoint is used for starting deployments?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'https://app.nexlayer.io/startUserDeployment', true),
  (q_id, 'https://api.nexlayer.com/deploy', false),
  (q_id, 'https://nexlayer.ai/api/start', false),
  (q_id, 'https://deploy.nexlayer.io', false);
  
  -- Question 11
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What HTTP method is used for the Nexlayer deployment API?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'POST', true),
  (q_id, 'GET', false),
  (q_id, 'PUT', false),
  (q_id, 'PATCH', false);
  
  -- Question 12
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What Content-Type header is used for Nexlayer deployments?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'text/x-yaml', true),
  (q_id, 'application/json', false),
  (q_id, 'application/yaml', false),
  (q_id, 'text/plain', false);
  
  -- Question 13
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What does the "path: /" setting indicate in a pod?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'The service handles root traffic/homepage', true),
  (q_id, 'The service file system root', false),
  (q_id, 'The service source code location', false),
  (q_id, 'The service logging path', false);
  
  -- Question 14
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'Which Docker image architecture is mentioned in Nexlayer examples?', 1) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'linux/amd64', true),
  (q_id, 'linux/arm64', false),
  (q_id, 'windows/amd64', false),
  (q_id, 'darwin/amd64', false);
  
  -- Question 15
  INSERT INTO public.questions (quiz_id, question_text, points) VALUES 
  (config_quiz_id, 'What is the purpose of the schema endpoint in Nexlayer?', 2) RETURNING id INTO q_id;
  INSERT INTO public.question_options (question_id, option_text, is_correct) VALUES 
  (q_id, 'GET https://app.nexlayer.io/schema for configuration validation', true),
  (q_id, 'Database schema management', false),
  (q_id, 'API documentation generation', false),
  (q_id, 'User authentication schema', false);

END $$;
