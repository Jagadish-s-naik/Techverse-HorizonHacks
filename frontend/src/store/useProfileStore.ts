import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineStorage } from '../services/offlineStorage';
import * as Network from 'expo-network';
import { farmerService } from '../services/api';

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
  syncChanges: () => Promise<void>;
  isSyncing: boolean;
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
  isSyncing: false,
  setProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
  saveProfile: async () => {
    const { profile } = get();
    await AsyncStorage.setItem('farmer_profile', JSON.stringify(profile));
    
    // Attempt to sync with backend if online, otherwise queue
    const networkState = await Network.getNetworkStateAsync();
    const online = networkState.isConnected && networkState.isInternetReachable;

    if (online && profile.id) {
      try {
        await farmerService.updateProfile(profile.id, profile);
        console.log('Profile synced with backend');
      } catch (error) {
        console.error('Failed to sync profile, queuing for later:', error);
        await offlineStorage.addToSyncQueue('UPDATE_PROFILE', profile);
      }
    } else if (profile.id) {
      console.log('Offline, queuing profile update');
      await offlineStorage.addToSyncQueue('UPDATE_PROFILE', profile);
    }
  },
  syncChanges: async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected || !networkState.isInternetReachable) return;

    const queue = await offlineStorage.getSyncQueue();
    if (queue.length === 0) return;

    set({ isSyncing: true });
    console.log(`Syncing ${queue.length} pending changes...`);

    for (const item of queue) {
      try {
        const payload = JSON.parse(item.payload);
        if (item.action === 'UPDATE_PROFILE' && payload.id) {
          await farmerService.updateProfile(payload.id, payload);
        }
        await offlineStorage.removeFromSyncQueue(item.id);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }
    set({ isSyncing: false });
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
