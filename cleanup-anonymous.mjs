import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanupAnonymousSessions() {
  console.log('🧹 Cleaning up anonymous quiz sessions...\n');
  
  try {
    // First, let's see what we have
    const { data: allSessions, error: fetchError } = await supabase
      .from('quiz_sessions')
      .select('id, user_id, score, total_questions, created_at');
    
    if (fetchError) {
      console.error('❌ Error fetching sessions:', fetchError);
      return;
    }
    
    console.log(`📊 Current sessions in database: ${allSessions.length}`);
    
    const anonymousSessions = allSessions.filter(session => session.user_id === null);
    const authenticatedSessions = allSessions.filter(session => session.user_id !== null);
    
    console.log(`   - Anonymous sessions: ${anonymousSessions.length}`);
    console.log(`   - Authenticated sessions: ${authenticatedSessions.length}\n`);
    
    if (anonymousSessions.length > 0) {
      console.log('🗑️  Deleting anonymous sessions...');
      
      // Delete all sessions where user_id is null
      const { error: deleteError } = await supabase
        .from('quiz_sessions')
        .delete()
        .is('user_id', null);
      
      if (deleteError) {
        console.error('❌ Error deleting sessions:', deleteError);
      } else {
        console.log(`✅ Successfully deleted ${anonymousSessions.length} anonymous sessions`);
      }
    } else {
      console.log('ℹ️  No anonymous sessions to delete');
    }
    
    // Verify cleanup
    const { data: remainingSessions, error: verifyError } = await supabase
      .from('quiz_sessions')
      .select('id, user_id')
      .is('user_id', null);
    
    if (verifyError) {
      console.error('❌ Error verifying cleanup:', verifyError);
    } else {
      console.log(`\n✅ Cleanup complete! Remaining anonymous sessions: ${remainingSessions.length}`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupAnonymousSessions();
