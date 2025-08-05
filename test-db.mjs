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

    // Test quiz_sessions table
    console.log('\n🧪 Testing quiz_sessions table structure...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*');
    
    if (sessionsError) {
      console.error('❌ Quiz sessions error:', sessionsError);
    } else {
      console.log(`✅ Found ${sessions.length} quiz sessions`);
    }

    // Test inserting into quiz_sessions with the structure that QuizTaker now uses
    console.log('\n🧪 Testing quiz_sessions insert with QuizTaker structure...');
    
    // Get a real quiz ID to use for testing
    if (quizzes.length > 0) {
      const quizTakerStructure = {
        quiz_id: quizzes[0].id,
        score: 8,
        total_questions: 16,
        completed_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('quiz_sessions')
        .insert(quizTakerStructure)
        .select();
      
      if (insertError) {
        console.error('❌ QuizTaker structure insert test failed:', insertError);
      } else {
        console.log('✅ QuizTaker structure insert successful:', insertData);
        
        // Clean up the test data
        await supabase
          .from('quiz_sessions')
          .delete()
          .eq('id', insertData[0].id);
        
        console.log('✅ Test data cleaned up');
      }
    }
    
    console.log('\n🎉 Database connection successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
