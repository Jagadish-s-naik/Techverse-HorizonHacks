import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateService } from '../services/api';
import { translations as hardcodedTranslations } from '../constants/translations';

interface TranslationState {
  cache: { [lang: string]: { [key: string]: string } };
  dynamicCache: { [lang: string]: { [text: string]: string } };
  isTranslating: boolean;
  loadingLanguages: { [lang: string]: boolean };
  loadTranslations: (lang: string) => Promise<void>;
  getTranslation: (lang: string, key: string) => string;
  translate: (text: string, lang: string) => Promise<string>;
  translateMany: (texts: string[], lang: string) => Promise<string[]>;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  cache: {
    English: hardcodedTranslations.English,
  },
  dynamicCache: {},
  isTranslating: false,
  loadingLanguages: {},
  
  loadTranslations: async (lang: string) => {
    if (lang === 'English') return;
    
    const { cache, dynamicCache, loadingLanguages } = get();
    
    // Check if already loading or already in cache
    if (loadingLanguages[lang] || cache[lang]) return;

    set({ loadingLanguages: { ...loadingLanguages, [lang]: true } });
    
    try {
      const stored = await AsyncStorage.getItem(`translations_${lang}`);
      const storedDynamic = await AsyncStorage.getItem(`dynamic_translations_${lang}`);
      
      const nextCache = { ...cache };
      const nextDynamic = { ...dynamicCache };
      
      if (stored) {
        nextCache[lang] = JSON.parse(stored);
      }
      if (storedDynamic) {
        nextDynamic[lang] = JSON.parse(storedDynamic);
      }
      
      if (stored) {
        set({ 
          cache: nextCache, 
          dynamicCache: nextDynamic,
          loadingLanguages: { ...get().loadingLanguages, [lang]: false }
        });
        return;
      }
    } catch (e) {
      console.warn('Failed to load translations from storage', e);
    }

    // If not in storage, fetch from Google Translate via Backend
    set({ isTranslating: true });
    try {
      const keys = Object.keys(hardcodedTranslations.English);
      const values = Object.values(hardcodedTranslations.English);
      
      const res = await translateService.translate(values, lang);
      const translatedValues = res.data.translated;
      
      if (!Array.isArray(translatedValues)) {
        throw new Error('Invalid response from translation service');
      }

      const newMap: { [key: string]: string } = {};
      keys.forEach((key, index) => {
        newMap[key] = translatedValues[index];
      });
      
      set((state) => ({
        cache: { ...state.cache, [lang]: newMap },
        isTranslating: false,
        loadingLanguages: { ...state.loadingLanguages, [lang]: false }
      }));
      
      await AsyncStorage.setItem(`translations_${lang}`, JSON.stringify(newMap));
    } catch (error) {
      console.error('Failed to fetch translations:', error);
      set((state) => ({ 
        isTranslating: false,
        loadingLanguages: { ...state.loadingLanguages, [lang]: false }
      }));
    }
  },

  getTranslation: (lang: string, key: string) => {
    const { cache } = get();
    if (cache[lang] && cache[lang][key]) {
      return cache[lang][key];
    }
    // Fallback to English
    return (hardcodedTranslations.English as any)[key] || key;
  },

  translate: async (text: string, lang: string) => {
    if (!text || typeof text !== 'string' || lang === 'English') return text;
    
    const { dynamicCache } = get();
    const langCache = dynamicCache[lang] || {};
    
    if (langCache[text]) return langCache[text];
    
    try {
      const res = await translateService.translate([text], lang);
      const translated = res.data.translated[0];
      
      if (translated) {
        set((state) => {
          const currentDynamicCache = state.dynamicCache;
          const currentLangCache = currentDynamicCache[lang] || {};
          const nextLangCache = { ...currentLangCache, [text]: translated };
          
          // Persist in background
          AsyncStorage.setItem(`dynamic_translations_${lang}`, JSON.stringify(nextLangCache));
          
          return {
            dynamicCache: { ...currentDynamicCache, [lang]: nextLangCache }
          };
        });
        return translated;
      }
      return text;
    } catch (e) {
      return text;
    }
  },

  translateMany: async (texts: string[], lang: string) => {
    if (!texts || !texts.length || lang === 'English') return texts;
    
    const { dynamicCache } = get();
    const langCache = dynamicCache[lang] || {};
    
    const results: string[] = new Array(texts.length);
    const toFetch: string[] = [];
    const indices: number[] = [];
    
    texts.forEach((t, i) => {
      if (!t || typeof t !== 'string') {
        results[i] = t;
      } else if (langCache[t]) {
        results[i] = langCache[t];
      } else {
        toFetch.push(t);
        indices.push(i);
      }
    });
    
    if (toFetch.length === 0) return results;
    
    try {
      const res = await translateService.translate(toFetch, lang);
      const translatedArr = res.data.translated;
      
      if (Array.isArray(translatedArr)) {
        set((state) => {
          const currentDynamicCache = state.dynamicCache;
          const currentLangCache = currentDynamicCache[lang] || {};
          const nextLangCache = { ...currentLangCache };
          
          translatedArr.forEach((trans: string, i: number) => {
            const original = toFetch[i];
            results[indices[i]] = trans;
            nextLangCache[original] = trans;
          });
          
          // Persist in background
          AsyncStorage.setItem(`dynamic_translations_${lang}`, JSON.stringify(nextLangCache));
          
          return {
            dynamicCache: { ...currentDynamicCache, [lang]: nextLangCache }
          };
        });
        return results;
      }
      return texts;
    } catch (e) {
      return texts;
    }
  }
}));

