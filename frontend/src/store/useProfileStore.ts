import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FarmerProfile {
  id: string | null;
  crop: string;
  landSize: number;
  hasIrrigation: boolean;
  hasStorage: boolean;
  mandi: string;
  district: string;
  language: string;
  isOnboarded: boolean;
}

interface ProfileState {
  profile: FarmerProfile;
  setProfile: (profile: Partial<FarmerProfile>) => void;
  saveProfile: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: {
    id: null,
    crop: 'Tomato',
    landSize: 1,
    hasIrrigation: false,
    hasStorage: false,
    mandi: 'Kolar',
    district: 'Kolar',
    language: 'English',
    isOnboarded: false,
  },
  setProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
  saveProfile: async () => {
    const { profile } = get();
    await AsyncStorage.setItem('farmer_profile', JSON.stringify(profile));
  },
  loadProfile: async () => {
    try {
      const data = await AsyncStorage.getItem('farmer_profile');
      if (data) {
        const parsed = JSON.parse(data);
        // Explicitly cast booleans to prevent java.lang.String cannot be cast to java.lang.Boolean
        set({
          profile: {
            ...get().profile,
            ...parsed,
            hasIrrigation: Boolean(parsed.hasIrrigation),
            hasStorage: Boolean(parsed.hasStorage),
            isOnboarded: Boolean(parsed.isOnboarded),
            landSize: Number(parsed.landSize) || 1,
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  },
}));
