import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function directInsertTest() {
  console.log('🧪 Testing direct database insert...\n');
  
  const testData = {
    quiz_id: '0f2fda59-6078-49f5-a90b-3fe148785e38', // Use an existing quiz ID
    user_id: 'db5f68ee-5405-4376-8355-3ee78c9dff0e', // Corrected user ID
    score: 10,
    total_questions: 15,
    time_spent: 300,
    completed_at: new Date().toISOString()
  };
  
  console.log('Test data:', testData);
  
  try {
    // Method 1: Try with explicit field mapping
    console.log('\n🔄 Method 1: Direct insert with explicit fields...');
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([testData])
      .select();
    
    if (error) {
      console.error('❌ Method 1 failed:', error);
      
      // Method 2: Try with minimal data
      console.log('\n🔄 Method 2: Minimal insert...');
      const { data: data2, error: error2 } = await supabase
        .from('quiz_sessions')
        .insert([{
          quiz_id: testData.quiz_id,
          user_id: testData.user_id,
          score: testData.score,
          total_questions: testData.total_questions
        }])
        .select();
        
      if (error2) {
        console.error('❌ Method 2 also failed:', error2);
        
        // Method 3: Try with different approach
        console.log('\n🔄 Method 3: Using upsert...');
        const { data: data3, error: error3 } = await supabase
          .from('quiz_sessions')
          .upsert({
            quiz_id: testData.quiz_id,
            user_id: testData.user_id,
            score: testData.score,
            total_questions: testData.total_questions,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (error3) {
          console.error('❌ Method 3 also failed:', error3);
        } else {
          console.log('✅ Method 3 succeeded!', data3);
        }
      } else {
        console.log('✅ Method 2 succeeded!', data2);
      }
    } else {
      console.log('✅ Method 1 succeeded!', data);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
  
  // Check what's in the database now
  console.log('\n📊 Current database state:');
  const { data: allSessions, error: fetchError } = await supabase
    .from('quiz_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (fetchError) {
    console.error('❌ Error fetching sessions:', fetchError);
  } else {
    console.log(`Found ${allSessions.length} sessions:`);
    allSessions.forEach((session, i) => {
      console.log(`   ${i+1}. User: ${session.user_id || 'Anonymous'}, Score: ${session.score}/${session.total_questions}, Created: ${session.created_at}`);
    });
  }
}

directInsertTest();
