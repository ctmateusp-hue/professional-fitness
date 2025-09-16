const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pzdkhnuqhrtanmfkktgb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZGtobnVxaHJ0YW5tZmtrdGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MTg0NzMsImV4cCI6MjA1NDA5NDQ3M30.0a7S5Rqb8ZW7P7YCYlTZH-aEBsQQtKpGwI9wKLWqlYs'
);

async function checkData() {
  try {
    console.log('=== Checking transformation stories ===');
    const { data: stories, error: storiesError } = await supabase
      .from('transformation_stories')
      .select('*');
    
    if (storiesError) {
      console.log('Stories error:', storiesError);
    } else {
      console.log('Stories found:', stories?.length || 0);
      stories?.forEach(story => {
        console.log(`- ${story.title} (${story.id})`);
      });
    }
    
    console.log('\n=== Checking transformation media ===');
    const { data: media, error: mediaError } = await supabase
      .from('transformation_media')
      .select('*');
    
    if (mediaError) {
      console.log('Media error:', mediaError);
    } else {
      console.log('Media found:', media?.length || 0);
      media?.forEach(item => {
        console.log(`- ${item.category} for story ${item.story_id}: ${item.url}`);
      });
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkData().then(() => process.exit(0));