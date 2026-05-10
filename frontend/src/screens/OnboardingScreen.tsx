import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';
import { useTranslation } from '../utils/translations';
import { ArrowRight, ArrowLeft, Check, RefreshCw } from 'lucide-react-native';
import { metaService } from '../services/api';

const DEFAULT_CROPS = ['rice', 'wheat', 'cotton', 'mustard', 'maize', 'soybean', 'potato', 'tomato', 'onion'];
const DEFAULT_MANDIS = ['vashi', 'azadpur', 'amravati', 'indore', 'gulabbagh', 'ujjain', 'agra', 'kolar', 'lasalgaon'];
const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Marathi', 'Telugu'];

const OnboardingScreen = ({ navigation }: any) => {
  const { profile, setProfile, createProfile } = useProfileStore();
  const { t, translate, language } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [crops, setCrops] = useState<string[]>(DEFAULT_CROPS);
  const [mandis, setMandis] = useState<string[]>(DEFAULT_MANDIS);
  const [translatedCrops, setTranslatedCrops] = useState<Record<string, string>>({});
  const [translatedMandis, setTranslatedMandis] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        console.log('Onboarding: Fetching live options...');
        const res = await metaService.getOptions();
        if (res.data.crops?.length) setCrops(res.data.crops);
        if (res.data.mandis?.length) setMandis(res.data.mandis);
        console.log('Onboarding: Options fetched successfully');
      } catch (error) {
        console.error('Onboarding: Failed to fetch options, using defaults:', error);
      } finally {
        setFetchingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  React.useEffect(() => {
    const translateOptions = async () => {
      const [tCrops, tMandis] = await Promise.all([
        translate(crops),
        translate(mandis)
      ]);

      const cropMap: Record<string, string> = {};
      crops.forEach((c, i) => cropMap[c] = tCrops[i]);
      setTranslatedCrops(cropMap);

      const mandiMap: Record<string, string> = {};
      mandis.forEach((m, i) => mandiMap[m] = tMandis[i]);
      setTranslatedMandis(mandiMap);
    };

    if (!fetchingOptions) {
      translateOptions();
    }
  }, [crops, mandis, language, fetchingOptions]);

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    console.log('Onboarding: handleFinish triggered');
    setLoading(true);

    // Safety timer to force navigation if something hangs
    const forceNavTimer = setTimeout(() => {
      console.log('Onboarding: Force navigation triggered after timeout');
      setLoading(false);
      navigation.replace('Home');
    }, 5000);

    try {
      console.log('Onboarding: Saving profile state...');
      setProfile({ isOnboarded: true });

      console.log('Onboarding: Creating profile on backend...');
      await createProfile();

      clearTimeout(forceNavTimer);
      console.log('Onboarding: Complete, replacing screen with Home');
      navigation.replace('Home');
    } catch (error) {
      clearTimeout(forceNavTimer);
      console.error('Onboarding: Error in handleFinish:', error);
      Alert.alert(
        "Notice",
        "We couldn't sync your profile to our servers, but your data is saved locally. You can continue.",
        [{ text: "OK", onPress: () => navigation.replace('Home') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>{t.chooseCrop}</Text>
            {fetchingOptions && (
              <View style={styles.fetchingContainer}>
                <ActivityIndicator size="small" color="#2E7D32" />
                <Text style={styles.loadingText}>Fetching live crops...</Text>
              </View>
            )}
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {crops.map(crop => (
                  <TouchableOpacity
                    key={crop}
                    style={[styles.chip, profile.crop.toLowerCase() === crop.toLowerCase() && styles.chipActive]}
                    onPress={() => setProfile({ crop: crop.toLowerCase() })}
                  >
                    <Text style={[styles.chipText, profile.crop.toLowerCase() === crop.toLowerCase() && styles.chipTextActive]}>
                      {capitalize(translatedCrops[crop] || crop)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>{t.landSize}</Text>
            <Text style={styles.valueDisplay}>{profile.landSize} {t.acres}</Text>
            <View style={styles.sizeControl}>
              <TouchableOpacity onPress={() => setProfile({ landSize: Math.max(0.5, profile.landSize - 0.5) })} style={styles.roundButton}><Text style={styles.roundButtonText}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setProfile({ landSize: profile.landSize + 0.5 })} style={styles.roundButton}><Text style={styles.roundButtonText}>+</Text></TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>{t.irrigationQuestion}</Text>
              <Switch
                value={profile.hasIrrigation}
                onValueChange={(val) => setProfile({ hasIrrigation: val })}
                trackColor={{ false: "#ddd", true: "#A5D6A7" }}
                thumbColor={profile.hasIrrigation ? "#2E7D32" : "#f4f3f4"}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>{t.storageQuestion}</Text>
              <Switch
                value={profile.hasStorage}
                onValueChange={(val) => setProfile({ hasStorage: val })}
                trackColor={{ false: "#ddd", true: "#A5D6A7" }}
                thumbColor={profile.hasStorage ? "#2E7D32" : "#f4f3f4"}
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>{t.selectMandi}</Text>
            {fetchingOptions && <Text style={styles.loadingText}>Fetching live mandis...</Text>}
            <ScrollView style={styles.list}>
              {mandis.map(mandi => (
                <TouchableOpacity
                  key={mandi}
                  style={[styles.listItem, profile.mandi.toLowerCase() === mandi.toLowerCase() && styles.listItemActive]}
                  onPress={() => setProfile({ mandi: mandi.toLowerCase(), district: mandi.toLowerCase() })}
                >
                  <Text style={[styles.listItemText, profile.mandi.toLowerCase() === mandi.toLowerCase() && styles.listItemTextActive]}>
                    {capitalize(translatedMandis[mandi] || mandi)}
                  </Text>
                  {profile.mandi.toLowerCase() === mandi.toLowerCase() && <Check size={20} color="#2E7D32" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>{t.selectLanguage}</Text>
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.chip, profile.language === lang && styles.chipActive, loading && { opacity: 0.5 }]}
                    onPress={() => !loading && setProfile({ language: lang })}
                    disabled={loading}
                  >
                    <Text style={[styles.chipText, profile.language === lang && styles.chipTextActive]}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.setupProfile}</Text>
        <Text style={styles.subtitle}>{t.step} {step} {t.of} 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        {renderStep()}
      </View>

      <View style={styles.footer}>
        {step > 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <ArrowLeft size={24} color="#666" />
            <Text style={styles.backButtonText}>{t.back}</Text>
          </TouchableOpacity>
        ) : <View />}

        <TouchableOpacity
          style={[styles.nextButton, loading && { opacity: 0.7 }]}
          onPress={nextStep}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Saving...' : (step === 5 ? t.finish : t.next)}
          </Text>
          {!loading && (step < 5 ? <ArrowRight size={24} color="#fff" /> : <Check size={24} color="#fff" />)}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { marginTop: 40, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  progressBar: { height: 6, backgroundColor: '#E8F5E9', borderRadius: 3, marginTop: 16 },
  progressFill: { height: 6, backgroundColor: '#4CAF50', borderRadius: 3 },
  content: { flex: 1 },
  stepContainer: { flex: 1 },
  label: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 24 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EEE' },
  chipActive: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  chipText: { fontSize: 16, color: '#666' },
  chipTextActive: { color: '#2E7D32', fontWeight: '600' },
  valueDisplay: { fontSize: 48, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', marginVertical: 30 },
  sizeControl: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  roundButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  roundButtonText: { fontSize: 30, color: '#2E7D32', fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  loadingText: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 12 },
  list: { flex: 1 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  listItemActive: { backgroundColor: '#F1F8E9', paddingHorizontal: 10, borderRadius: 8 },
  listItemText: { fontSize: 18, color: '#444' },
  listItemTextActive: { color: '#2E7D32', fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backButtonText: { fontSize: 18, color: '#666', fontWeight: '600' },
  nextButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2E7D32', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  nextButtonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
});

export default OnboardingScreen;
