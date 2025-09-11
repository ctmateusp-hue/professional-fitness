// Simple persistent storage service for media data
import { useState, useEffect } from 'react'
import { MediaItem, Modality } from '../App'

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

// Persistent storage with localStorage
class PersistentStorage {
  
  async loadData(): Promise<{ media: MediaItem[], modalities: Modality[] }> {
    try {
      console.log('📱 Loading data from localStorage (device-specific)')
      
      // Load from localStorage (device-specific)
      const globalData = localStorage.getItem('professional-fitness-global-data')
      if (globalData) {
        const parsed = JSON.parse(globalData)
        console.log('📂 Data loaded from this device:', parsed)
        return {
          media: parsed.media || [],
          modalities: parsed.modalities || defaultData.modalities
        }
      }
      
      // Initialize with default data
      const initialData = {
        media: [],
        modalities: defaultData.modalities
      }
      
      await this.saveData(initialData)
      return initialData
      
    } catch (error) {
      console.warn('⚠️ Error with localStorage, using default data:', error)
      return defaultData
    }
  }
  
  async saveData(data: { media: MediaItem[], modalities: Modality[] }): Promise<void> {
    try {
      console.log('💾 Saving data to localStorage...')
      console.log('⚠️  NOTE: This will only save to the current browser/device')
      
      // Save to global storage
      localStorage.setItem('professional-fitness-global-data', JSON.stringify(data))
      
      // Also save media separately for compatibility
      localStorage.setItem('fitness-media', JSON.stringify(data.media))
      
      console.log('✅ Data saved successfully')
    } catch (error) {
      console.warn('⚠️ Error saving to localStorage:', error)
    }
  }
}

// Create singleton instance
const storage = new PersistentStorage()

// React hook for using the storage service
export function usePersistentStorage() {
  const [data, setData] = useState<{ media: MediaItem[], modalities: Modality[] }>(defaultData)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on mount
  const loadData = async () => {
    setIsLoading(true)
    try {
      const loadedData = await storage.loadData()
      setData(loadedData)
    } catch (error) {
      console.error('Error loading data:', error)
      setData(defaultData)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Save data
  const saveData = async (newData: Partial<{ media: MediaItem[], modalities: Modality[] }>) => {
    const updatedData = { ...data, ...newData }
    setData(updatedData)
    await storage.saveData(updatedData)
  }

  return {
    data,
    saveData,
    loadData,
    isLoading
  }
}
