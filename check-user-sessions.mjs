import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const USER_ID = 'db5f68ee-5405-4376-8355-3ee78c9dff0e'; // Corrected user ID (removed extra '9')

async function checkUserSessions() {
  console.log(`🔍 Checking sessions for user: ${USER_ID}\n`);
  
  try {
    // Check sessions for this specific user
    const { data: userSessions, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', USER_ID)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log(`✅ Found ${userSessions.length} sessions for this user:`);
      if (userSessions.length > 0) {
        userSessions.forEach((session, index) => 
          console.log(`   ${index + 1}. Score: ${session.score}/${session.total_questions}, Created: ${session.created_at}`)
        );
        
        // Calculate average
        const validSessions = userSessions.filter(s => s.score !== null && s.total_questions !== null && s.total_questions > 0);
        if (validSessions.length > 0) {
          const totalPercentage = validSessions.reduce((sum, session) => {
            return sum + (session.score / session.total_questions) * 100;
          }, 0);
          const avgScore = Math.round(totalPercentage / validSessions.length);
          console.log(`   📊 Average Score: ${avgScore}%`);
        }
      } else {
        console.log('   No sessions found for this user. Please take a quiz first!');
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

checkUserSessions();
