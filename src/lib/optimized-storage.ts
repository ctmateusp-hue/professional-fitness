// Enhanced storage service with caching and performance optimizations
import { useState, useEffect, useMemo } from 'react'
import { MediaItem, Modality } from '../App'
import { SupabaseService } from './supabase'

// Cache for Supabase data
class DataCache {
  private static instance: DataCache
  private cache = new Map<string, { data: any, timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache()
    }
    return DataCache.instance
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear(): void {
    this.cache.clear()
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// Default data structure
const defaultData = {
  media: [] as MediaItem[],
  modalities: [
    {
      id: 'functional',
      title: 'FUNCIONAL/CROSS',
      description: 'Nossos treinos são elaborados com uma metodologia própria. Voltado para as pessoas da nossa cidade. São exercícios que usam bastante o peso corporal associados com aparelhos de musculação.'
    },
    {
      id: 'musculacao',
      title: 'MUSCULAÇÃO',
      description: 'Treinos elaborados com exercícios de resultado, ou seja, focando no que o corpo mais precisa, tanto para estética, fortalecimento, ganho de massa….etc.'
    },
    {
      id: 'zumba',
      title: 'ZUMBA',
      description: 'Aula de dança com as melhores e mais animadas músicas! Coreografias adaptadas para você aproveitar o máximo a aula!'
    }
  ] as Modality[]
}

// Enhanced persistent storage with caching
class OptimizedStorage {
  private cache = DataCache.getInstance()
  
  async loadData(): Promise<{ media: MediaItem[], modalities: Modality[] }> {
    try {
      console.log('📱 Loading data with smart caching...')
      
      // Try cache first
      const cachedData = this.cache.get('all-data')
      if (cachedData) {
        console.log('⚡ Using cached data for faster loading')
        return cachedData
      }

      // Load from localStorage (fast)
      const localData = localStorage.getItem('professional-fitness-global-data')
      let result = defaultData

      if (localData) {
        const parsed = JSON.parse(localData)
        result = {
          media: parsed.media || [],
          modalities: parsed.modalities || defaultData.modalities
        }
      }

      // Cache the result
      this.cache.set('all-data', result)
      
      // Async load from Supabase in background (don't block UI)
      this.syncWithSupabaseAsync()

      return result
      
    } catch (error) {
      console.warn('⚠️ Error loading data, using default:', error)
      return defaultData
    }
  }

  private async syncWithSupabaseAsync(): Promise<void> {
    try {
      console.log('🔄 Background sync with Supabase...')
      
      const [supabaseMedia, supabaseModalities] = await Promise.all([
        SupabaseService.getMedia(),
        SupabaseService.getModalities()
      ])

      // Convert format
      const convertedMedia = supabaseMedia.map(item => ({
        id: item.id,
        modalityId: item.modality_id,
        type: item.type,
        url: item.url,
        title: item.title,
        description: item.description,
        category: item.category,
        thumbnail: item.thumbnail
      }))

      const syncedData = {
        media: convertedMedia,
        modalities: supabaseModalities.length > 0 ? supabaseModalities : defaultData.modalities
      }

      // Update cache and localStorage
      this.cache.set('all-data', syncedData)
      localStorage.setItem('professional-fitness-global-data', JSON.stringify(syncedData))
      
      console.log('✅ Background sync completed')
      
      // Trigger a custom event to notify components
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: syncedData }))
      
    } catch (error) {
      console.warn('⚠️ Background sync failed:', error)
    }
  }
  
  async saveData(data: { media: MediaItem[], modalities: Modality[] }): Promise<void> {
    try {
      console.log('💾 Saving data with cache invalidation...')
      
      // Save to localStorage
      localStorage.setItem('professional-fitness-global-data', JSON.stringify(data))
      localStorage.setItem('fitness-media', JSON.stringify(data.media))
      
      // Update cache
      this.cache.set('all-data', data)
      
      console.log('✅ Data saved successfully')
    } catch (error) {
      console.warn('⚠️ Error saving data:', error)
    }
  }

  // Fast modal-specific media loading with cache
  async getModalityMedia(modalityId: string): Promise<MediaItem[]> {
    const cacheKey = `modality-${modalityId}`
    
    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const media = await SupabaseService.getMedia(modalityId, 'regular')
      const converted = media.map(item => ({
        id: item.id,
        modalityId: item.modality_id,
        type: item.type,
        url: item.url,
        title: item.title,
        description: item.description,
        category: item.category as 'regular',
        thumbnail: item.thumbnail
      }))

      // Cache for 5 minutes
      this.cache.set(cacheKey, converted)
      return converted
      
    } catch (error) {
      console.warn('Error loading modality media:', error)
      return []
    }
  }

  // Fast transformations loading with cache
  async getTransformations(): Promise<MediaItem[]> {
    const cacheKey = 'transformations'
    
    // Try cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const media = await SupabaseService.getMedia(undefined, 'transformation')
      const converted = media.map(item => ({
        id: item.id,
        modalityId: item.modality_id,
        type: item.type,
        url: item.url,
        title: item.title,
        description: item.description,
        category: item.category as 'transformation',
        thumbnail: item.thumbnail
      }))

      // Cache for 5 minutes
      this.cache.set(cacheKey, converted)
      return converted
      
    } catch (error) {
      console.warn('Error loading transformations:', error)
      return []
    }
  }

  // Invalidate cache when data changes
  invalidateCache(pattern?: string): void {
    this.cache.invalidate(pattern)
  }
}

// Create singleton instance
const optimizedStorage = new OptimizedStorage()

// Enhanced React hook with performance optimizations
export function usePersistentStorage() {
  const [data, setData] = useState<{ media: MediaItem[], modalities: Modality[] }>(defaultData)
  const [isLoading, setIsLoading] = useState(true)

  // Memoized computed values
  const mediaByModality = useMemo(() => {
    return data.media.reduce((acc, item) => {
      if (!acc[item.modalityId]) {
        acc[item.modalityId] = []
      }
      acc[item.modalityId].push(item)
      return acc
    }, {} as Record<string, MediaItem[]>)
  }, [data.media])

  const transformations = useMemo(() => {
    return data.media.filter(item => item.category === 'transformation')
  }, [data.media])

  // Load data on mount with optimization
  const loadData = async () => {
    setIsLoading(true)
    try {
      const loadedData = await optimizedStorage.loadData()
      setData(loadedData)
    } catch (error) {
      console.error('Error loading data:', error)
      setData(defaultData)
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for background updates
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      setData(event.detail)
    }

    window.addEventListener('dataUpdated', handleDataUpdate as EventListener)
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate as EventListener)
    }
  }, [])

  // Auto-load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Optimized save data
  const saveData = async (newData: Partial<{ media: MediaItem[], modalities: Modality[] }>) => {
    const updatedData = { ...data, ...newData }
    setData(updatedData)
    await optimizedStorage.saveData(updatedData)
    
    // Invalidate relevant caches
    optimizedStorage.invalidateCache()
  }

  return {
    data,
    saveData,
    loadData,
    isLoading,
    mediaByModality,
    transformations,
    // Optimized functions for specific data
    getModalityMedia: optimizedStorage.getModalityMedia.bind(optimizedStorage),
    getTransformations: optimizedStorage.getTransformations.bind(optimizedStorage)
  }
}