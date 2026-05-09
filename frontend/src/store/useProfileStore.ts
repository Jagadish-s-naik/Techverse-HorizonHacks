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
  isSimpleMode: boolean;
  isOnboarded: boolean;
}

interface ProfileState {
  profile: FarmerProfile;
  setProfile: (profile: Partial<FarmerProfile>) => void;
  toggleSimpleMode: () => void;
  saveProfile: () => Promise<void>;
  createProfile: () => Promise<void>;
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
    isSimpleMode: false,
    isOnboarded: false,
  },
  isSyncing: false,
  setProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
  toggleSimpleMode: () => set((state) => ({
    profile: { ...state.profile, isSimpleMode: !state.profile.isSimpleMode }
  })),
  saveProfile: async () => {
    const { profile } = get();
    await AsyncStorage.setItem('farmer_profile', JSON.stringify(profile));
    
    // Attempt to sync with backend if online, otherwise queue
    const networkState = await Network.getNetworkStateAsync();
    const online = networkState.isConnected && networkState.isInternetReachable;

    if (online && profile.id && !profile.id.startsWith('local_')) {
      try {
        await farmerService.updateProfile(profile.id, {
          crop: profile.crop,
          land_acres: profile.landSize,
          has_irrigation: profile.hasIrrigation,
          has_storage: profile.hasStorage,
          mandi: profile.mandi,
          district: profile.district,
          language: profile.language
        });
        console.log('Profile synced with backend');
      } catch (error) {
        console.error('Failed to sync profile, queuing for later:', error);
        await offlineStorage.addToSyncQueue('UPDATE_PROFILE', profile);
      }
    } else if (profile.id) {
      console.log('Offline or Local ID, queuing profile update');
      await offlineStorage.addToSyncQueue('UPDATE_PROFILE', profile);
    }
  },
  createProfile: async () => {
    console.log('useProfileStore: createProfile started');
    const { profile } = get();
    
    let online = false;
    try {
      // Use a race to prevent hanging on network check
      const networkState = await Promise.race([
        Network.getNetworkStateAsync(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 2000))
      ]) as Network.NetworkState;
      online = !!(networkState.isConnected && networkState.isInternetReachable);
      console.log('useProfileStore: Network online:', online);
    } catch (e) {
      console.warn('useProfileStore: Network check failed or timed out, assuming offline');
      online = false;
    }

    if (online) {
      try {
        console.log('useProfileStore: Attempting to create profile on backend...');
        const res = await farmerService.createProfile({
          crop: profile.crop,
          land_acres: profile.landSize,
          has_irrigation: profile.hasIrrigation,
          has_storage: profile.hasStorage,
          mandi: profile.mandi,
          district: profile.district,
          language: profile.language
        });
        
        const newProfile = { ...profile, id: res.data.id };
        set({ profile: newProfile });
        await AsyncStorage.setItem('farmer_profile', JSON.stringify(newProfile));
        console.log('useProfileStore: Profile created and saved with ID:', res.data.id);
      } catch (error) {
        console.error('useProfileStore: Failed to create profile on backend:', error);
        // Fallback to local ID if backend fails
        if (!profile.id) {
          const localId = `local_${Date.now()}`;
          const newProfile = { ...profile, id: localId };
          set({ profile: newProfile });
          await AsyncStorage.setItem('farmer_profile', JSON.stringify(newProfile));
        }
      }
    } else {
      console.log('useProfileStore: Offline, generating local ID');
      if (!profile.id) {
        const localId = `local_${Date.now()}`;
        const newProfile = { ...profile, id: localId };
        set({ profile: newProfile });
        try {
          await AsyncStorage.setItem('farmer_profile', JSON.stringify(newProfile));
          console.log('useProfileStore: Local profile saved');
        } catch (e) {
          console.error('useProfileStore: Failed to save to AsyncStorage', e);
        }
      }
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
          if (payload.id.startsWith('local_')) {
            // Promote local profile to backend
            const res = await farmerService.createProfile({
              crop: payload.crop,
              land_acres: payload.landSize,
              has_irrigation: payload.hasIrrigation,
              has_storage: payload.hasStorage,
              mandi: payload.mandi,
              district: payload.district,
              language: payload.language
            });
            // Update local state with new ID
            const newProfile = { ...payload, id: res.data.id };
            set({ profile: newProfile });
            await AsyncStorage.setItem('farmer_profile', JSON.stringify(newProfile));
          } else {
            await farmerService.updateProfile(payload.id, {
              crop: payload.crop,
              land_acres: payload.landSize,
              has_irrigation: payload.hasIrrigation,
              has_storage: payload.hasStorage,
              mandi: payload.mandi,
              district: payload.district,
              language: payload.language
            });
          }
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
