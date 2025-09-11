// Simple persistent storage service for media data
import { useState } from 'react'
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

// Realistic storage explanation: localStorage is per-browser/device
class PersistentStorage {
  
  async loadData(): Promise<{ media: MediaItem[], modalities: Modality[] }> {
    try {
      console.log('⚠️  IMPORTANT: Data is stored locally per device/browser')
      console.log('📱 Photos added on this device will only show on this device')
      console.log('🌐 For true cross-device storage, a backend database is needed')
      
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
      
      localStorage.setItem('professional-fitness-global-data', JSON.stringify(initialData))
      console.log('🔧 Initialized storage on this device')
      
      return initialData
    } catch (error) {
      console.error('Error loading data:', error)
      return defaultData
    }
  }

  async saveData(data: { media: MediaItem[], modalities: Modality[] }): Promise<void> {
    try {
      console.log('💾 Saving data to this device only...', data)
      console.log('⚠️  NOTE: This will only save to the current browser/device')
      console.log('🔄 To share photos across devices, a cloud database is needed')
      
      // Save to localStorage (device-specific)
      localStorage.setItem('professional-fitness-global-data', JSON.stringify(data))
      
      // Also save to backup keys for compatibility
      localStorage.setItem('fitness-media', JSON.stringify(data.media))
      localStorage.setItem('fitness-modalities', JSON.stringify(data.modalities))
      
      console.log('✅ Data saved successfully to this device')
      
      // Show user notification about device-specific storage
      if (typeof window !== 'undefined' && data.media.length > 0) {
        console.log('📝 REMINDER: Photos are saved locally to this browser only')
      }
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }
}

// Export singleton instance
export const persistentStorage = new PersistentStorage()

// Custom hook for React components
export function usePersistentStorage() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<{ media: MediaItem[], modalities: Modality[] }>(defaultData)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const loadedData = await persistentStorage.loadData()
      setData(loadedData)
      console.log('Data loaded in hook:', loadedData)
    } catch (error) {
      console.error('Error loading data in hook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async (newData: { media: MediaItem[], modalities: Modality[] }) => {
    try {
      await persistentStorage.saveData(newData)
      setData(newData)
      console.log('Data saved in hook:', newData)
    } catch (error) {
      console.error('Error saving data in hook:', error)
      throw error
    }
  }

  return {
    data,
    isLoading,
    loadData,
    saveData
  }
}
