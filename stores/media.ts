import { defineStore } from 'pinia'

interface MediaAsset {
  id: number | string;
  name: string;
  type: 'video' | 'image' | 'audio';
  thumbnail: string;
  duration: string;
  [key: string]: string | number | boolean | undefined;
}

export const useMediaStore = defineStore('media', {
  state: () => ({
    assets: [
      {
        id: 1,
        name: 'Beach Sunset',
        type: 'video' as const,
        thumbnail: 'https://placehold.co/200x120/4F46E5/FFFFFF?text=Beach+Sunset',
        duration: '0:15'
      },
      {
        id: 2,
        name: 'Mountain View',
        type: 'video' as const,
        thumbnail: 'https://placehold.co/200x120/10B981/FFFFFF?text=Mountain+View',
        duration: '0:12'
      },
      {
        id: 3,
        name: 'City Time-lapse',
        type: 'video' as const,
        thumbnail: 'https://placehold.co/200x120/F59E0B/FFFFFF?text=City+Timelapse',
        duration: '0:20'
      },
      {
        id: 4,
        name: 'Abstract Waves',
        type: 'image' as const,
        thumbnail: 'https://placehold.co/200x120/8B5CF6/FFFFFF?text=Abstract+Waves',
        duration: '0:05'
      },
      {
        id: 5,
        name: 'Background Music',
        type: 'audio' as const,
        thumbnail: 'https://placehold.co/200x120/EC4899/FFFFFF?text=Audio',
        duration: '2:30'
      }
    ] as MediaAsset[]
  }),
  getters: {
    getAssetById: (state) => (id: number | string) => {
      return state.assets.find((asset: MediaAsset) => asset.id === id)
    }
  },
  actions: {
    async fetchAssets() {
      // In a real app, you would fetch assets from an API
      return this.assets
    }
  }
})
