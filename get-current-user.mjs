import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kqxxxadltupciizuxacc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxeHh4YWRsdHVwY2lpenV4YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTg4MzYsImV4cCI6MjA2OTk5NDgzNn0.bY2IKsKhXqePwzRoiEwv9ktyX8jqja9n9AJhzZxGaSE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getCurrentUser() {
  console.log('🔍 Getting current user info...\n');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Auth Error:', error);
    } else if (user) {
      console.log('✅ Current User Info:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   ID Length:', user.id.length);
      console.log('   Created:', user.created_at);
    } else {
      console.log('❌ No user is currently logged in');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

getCurrentUser();
