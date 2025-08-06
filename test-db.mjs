import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Test quizzes
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*');
    
    if (quizzesError) {
      console.error('❌ Quizzes error:', quizzesError);
    } else {
      console.log(`✅ Found ${quizzes.length} quizzes:`);
      quizzes.forEach(quiz => console.log(`   - ${quiz.title}`));
    }
    
    // Test questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) {
      console.error('❌ Questions error:', questionsError);
    } else {
      console.log(`✅ Found ${questions.length} questions`);
    }
    
    // Test options
    const { data: options, error: optionsError } = await supabase
      .from('question_options')
      .select('*');
    
    if (optionsError) {
      console.error('❌ Options error:', optionsError);
    } else {
      console.log(`✅ Found ${options.length} answer options`);
    }

    // Test quiz sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (sessionsError) {
      console.error('❌ Sessions error:', sessionsError);
    } else {
      console.log(`✅ Found ${sessions.length} quiz sessions`);
      if (sessions.length > 0) {
        console.log('   All sessions:');
        sessions.forEach((session, index) => 
          console.log(`   ${index + 1}. Quiz: ${session.quiz_id}, User: ${session.user_id || 'Anonymous'}, Score: ${session.score}/${session.total_questions}, Created: ${session.created_at}`)
        );
      }
    }
    
    console.log('\n🎉 Database connection successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
