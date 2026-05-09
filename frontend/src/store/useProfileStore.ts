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
    const data = await AsyncStorage.getItem('farmer_profile');
    if (data) {
      set({ profile: JSON.parse(data) });
    }
  },
}));
