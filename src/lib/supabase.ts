import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface MediaItem {
  id: string
  modality_id: string
  type: 'image' | 'video'
  url: string
  title: string
  description?: string
  category: 'regular' | 'transformation'
  thumbnail?: string
  created_at?: string
  updated_at?: string
}

export interface Modality {
  id: string
  title: string
  description: string
  created_at?: string
  updated_at?: string
}

// Tipos para histórias de transformação
export interface TransformationStory {
  id: string
  title: string
  student_name: string
  description: string
  before_description?: string
  after_description?: string
  transformation_period?: string
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface TransformationMedia {
  id: string
  story_id: string
  type: 'image' | 'video'
  media_category: 'before' | 'after' | 'during' | 'video_testimonial'
  url: string
  title?: string
  description?: string
  thumbnail?: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

// Utility functions for database operations
export class SupabaseService {
  // Media operations
  static async getMedia(modalityId?: string, category?: 'regular' | 'transformation') {
    let query = supabase.from('media').select('*')
    
    if (modalityId) {
      query = query.eq('modality_id', modalityId)
    }
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching media from Supabase:', error)
      throw error
    }
    
    return data || []
  }

  static async addMedia(media: Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('media')
      .insert([media])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding media:', error)
      throw error
    }
    
    return data
  }

  static async deleteMedia(id: string) {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting media:', error)
      throw error
    }
  }

  // Modality operations
  static async getModalities() {
    const { data, error } = await supabase
      .from('modalities')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching modalities from Supabase:', error)
      throw error
    }
    
    return data || []
  }

  static async addModality(modality: Omit<Modality, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('modalities')
      .insert([modality])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding modality:', error)
      throw error
    }
    
    return data
  }

  // Transformation Stories operations
  static async getTransformationStories(featured?: boolean) {
    let query = supabase.from('transformation_stories').select('*')
    
    if (featured !== undefined) {
      query = query.eq('featured', featured)
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching transformation stories:', error)
      throw error
    }
    
    return data || []
  }

  static async createTransformationStory(story: Omit<TransformationStory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transformation_stories')
      .insert([story])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating transformation story:', error)
      throw error
    }
    
    return data
  }

  static async updateTransformationStory(id: string, updates: Partial<TransformationStory>) {
    const { data, error } = await supabase
      .from('transformation_stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating transformation story:', error)
      throw error
    }
    
    return data
  }

  static async deleteTransformationStory(id: string) {
    const { error } = await supabase
      .from('transformation_stories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting transformation story:', error)
      throw error
    }
  }

  // Transformation Media operations
  static async getTransformationMedia(storyId?: string, category?: 'before' | 'after' | 'during' | 'video_testimonial') {
    let query = supabase.from('transformation_media').select('*')
    
    if (storyId) {
      query = query.eq('story_id', storyId)
    }
    
    if (category) {
      query = query.eq('media_category', category)
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching transformation media:', error)
      throw error
    }
    
    return data || []
  }

  static async createTransformationMedia(media: Omit<TransformationMedia, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transformation_media')
      .insert([media])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating transformation media:', error)
      throw error
    }
    
    return data
  }

  static async deleteTransformationMedia(id: string) {
    const { error } = await supabase
      .from('transformation_media')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting transformation media:', error)
      throw error
    }
  }
}
