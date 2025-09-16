// Test script to create a sample transformation story
import { SupabaseService } from './src/lib/supabase.js';

async function createTestTransformationStory() {
  try {
    console.log('🧪 Creating test transformation story...');
    
    // Create a test story
    const testStory = {
      title: 'Transformação Teste - João',
      description: 'História de transformação de teste para verificar se está funcionando no site',
      featured: true,
      sort_order: 1
    };
    
    console.log('📝 Creating story:', testStory);
    const story = await SupabaseService.createTransformationStory(testStory);
    console.log('✅ Story created:', story);
    
    // Create test media for the story
    const testMedia = [
      {
        story_id: story.id,
        type: 'image',
        url: 'https://via.placeholder.com/400x600/ff0000/ffffff?text=ANTES',
        category: 'before',
        title: 'Foto Antes',
        description: 'Foto antes da transformação',
        sort_order: 1
      },
      {
        story_id: story.id,
        type: 'image', 
        url: 'https://via.placeholder.com/400x600/00ff00/ffffff?text=DEPOIS',
        category: 'after',
        title: 'Foto Depois',
        description: 'Foto depois da transformação',
        sort_order: 2
      },
      {
        story_id: story.id,
        type: 'image',
        url: 'https://via.placeholder.com/800x600/0000ff/ffffff?text=ANTES+E+DEPOIS',
        category: 'before_after',
        title: 'Comparação Antes e Depois',
        description: 'Foto comparativa antes e depois',
        sort_order: 3
      }
    ];
    
    console.log('🖼️ Creating media items...');
    for (const mediaItem of testMedia) {
      console.log('📸 Creating media:', mediaItem);
      const createdMedia = await SupabaseService.createTransformationMedia(mediaItem);
      console.log('✅ Media created:', createdMedia);
    }
    
    console.log('🎉 Test transformation story created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating test story:', error);
  }
}

createTestTransformationStory();