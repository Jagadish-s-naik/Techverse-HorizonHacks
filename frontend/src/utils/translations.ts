import { translations as hardcodedTranslations } from '../constants/translations';
export type { TranslationMap } from '../constants/translations';
export { hardcodedTranslations as translations };


import { useProfileStore } from '../store/useProfileStore';
import { useTranslationStore } from '../store/useTranslationStore';
import { useEffect, useCallback, useMemo } from 'react';

export const useTranslation = () => {
  const language = useProfileStore((state) => state.profile.language);
  const { loadTranslations, getTranslation, translate: storeTranslate, translateMany: storeTranslateMany, isTranslating } = useTranslationStore();
  
  useEffect(() => {
    if (language !== 'English') {
      loadTranslations(language);
    }
  }, [language]);

  // Use useMemo for 't' proxy to maintain compatibility and stability
  const t = useMemo(() => new Proxy({}, {
    get: (_, key: string) => getTranslation(language, key)
  }) as any, [language, getTranslation]);

  // Memoize translate function to prevent effect loops in components
  // Function overloads for better type safety
  function translateFunc(text: string): Promise<string>;
  function translateFunc(text: string[]): Promise<string[]>;
  async function translateFunc(text: string | string[]): Promise<string | string[]> {
    if (Array.isArray(text)) {
      return storeTranslateMany(text, language);
    }
    return storeTranslate(text, language);
  }

  const translate = useCallback(translateFunc, [language, storeTranslate, storeTranslateMany]);

  return { t, language, isTranslating, translate };
};

export const getLocalizedReadout = async (forecast: any, lang: string) => {
  const store = useTranslationStore.getState();
  const t = new Proxy({}, {
    get: (_, key: string) => store.getTranslation(lang, key)
  }) as any;

  // Translate dynamic fields using the store's direct methods
  const [translatedCrop, translatedMandi, translatedDrivers, translatedAction, translatedRationale] = await Promise.all([
    store.translate(forecast.crop, lang),
    store.translate(forecast.mandi, lang),
    store.translateMany(forecast.drivers || [], lang),
    forecast.recommendation ? store.translate(forecast.recommendation.action, lang) : Promise.resolve(''),
    forecast.recommendation ? store.translate(forecast.recommendation.rationale, lang) : Promise.resolve('')
  ]);
  
  if (forecast.status === 'insufficient_data') {
    if (forecast.todayPrice) {
      return `${t.forecastFor} ${translatedCrop} ${t.in} ${translatedMandi}. ${t.livePrice} ${t.rupeesPerKg}: ₹${forecast.todayPrice}. ${t.insufficientData}`;
    }
    return t.insufficientData;
  }

  const trendMap: any = {
    up: t.up,
    down: t.down,
    stable: t.stable
  };

  let text = `${t.forecastFor} ${translatedCrop} ${t.in} ${translatedMandi}. 
    ${t.expectedPriceIs} ${forecast.price_low} ${t.to} ${forecast.price_high} ${t.rupeesPerKg}. 
    ${t.trendIs} ${trendMap[forecast.trend] || forecast.trend}. 
    ${t.confidenceIs} ${forecast.confidence} ${t.percent}. 
    ${t.keyFactors}: ${(translatedDrivers as string[]).join('. ')}`;

  if (translatedAction && translatedRationale) {
    text += `\n\n${t.adviceLabel}: ${translatedAction}. ${t.whyLabel}: ${translatedRationale}`;
  }

  return text;
};
