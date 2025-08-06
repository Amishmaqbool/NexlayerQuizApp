import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
// Note: In production, you would use the service role key for this operation
// For now, let's try with a direct SQL approach using the anon key
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function forceCleanup() {
  console.log('🔥 Attempting force cleanup with direct SQL...\n');
  
  try {
    // First, try to use RPC (stored procedure) approach if available
    // Or direct SQL using rpc
    const { data, error } = await supabase.rpc('cleanup_anonymous_sessions');
    
    if (error) {
      console.log('RPC method failed, trying direct approach...');
      
      // Try direct deletion with specific conditions
      const { error: deleteError } = await supabase
        .from('quiz_sessions')
        .delete()
        .filter('user_id', 'is', null);
      
      if (deleteError) {
        console.error('❌ Direct deletion failed:', deleteError);
      } else {
        console.log('✅ Direct deletion succeeded');
      }
    } else {
      console.log('✅ RPC cleanup succeeded:', data);
    }
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error);
  }
  
  // Verify the current state
  console.log('\n📊 Checking current state...');
  const { data: sessions, error: fetchError } = await supabase
    .from('quiz_sessions')
    .select('*');
    
  if (fetchError) {
    console.error('❌ Error fetching sessions:', fetchError);
  } else {
    console.log(`Current sessions: ${sessions.length}`);
    sessions.forEach((session, i) => {
      console.log(`   ${i+1}. User: ${session.user_id || 'Anonymous'}, Score: ${session.score}/${session.total_questions}`);
    });
  }
}

forceCleanup();
