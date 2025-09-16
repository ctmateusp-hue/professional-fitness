// Tipos para as histórias de transformação "Faça como eles!"

export interface TransformationStory {
  id: string
  title: string
  student_name: string
  description: string
  before_description?: string
  after_description?: string
  transformation_period?: string // Ex: "6 meses", "1 ano"
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface TransformationMedia {
  id: string
  story_id: string
  type: 'image' | 'video'
  media_category: 'before' | 'after' | 'before_after' | 'during' | 'video_testimonial'
  url: string
  title?: string
  description?: string
  thumbnail?: string // Para vídeos
  sort_order: number
  created_at?: string
  updated_at?: string
}

// Tipo combinado para uso na interface
export interface TransformationStoryWithMedia extends TransformationStory {
  media: TransformationMedia[]
  beforePhotos: TransformationMedia[]
  afterPhotos: TransformationMedia[]
  videos: TransformationMedia[]
}
