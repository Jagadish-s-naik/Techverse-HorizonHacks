import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native';

const CROPS = ['Tomato', 'Onion', 'Chickpea', 'Wheat', 'Rice', 'Mustard'];
const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Marathi', 'Telugu'];
const MANDIS = ['Kolar', 'Lasalgaon', 'Indore', 'Azadpur', 'Vashi'];

const OnboardingScreen = ({ navigation }: any) => {
  const { profile, setProfile, saveProfile } = useProfileStore();
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setProfile({ isOnboarded: true });
    await saveProfile();
    navigation.replace('Home');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Choose your primary crop</Text>
            <View style={styles.chipContainer}>
              {CROPS.map(crop => (
                <TouchableOpacity
                  key={crop}
                  style={[styles.chip, profile.crop === crop && styles.chipActive]}
                  onPress={() => setProfile({ crop })}
                >
                  <Text style={[styles.chipText, profile.crop === crop && styles.chipTextActive]}>{crop}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>What is your land size (acres)?</Text>
            <Text style={styles.valueDisplay}>{profile.landSize} Acres</Text>
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
              <Text style={styles.label}>Do you have irrigation?</Text>
              <Switch 
                value={profile.hasIrrigation} 
                onValueChange={(val) => setProfile({ hasIrrigation: val })}
                trackColor={{ false: "#ddd", true: "#A5D6A7" }}
                thumbColor={profile.hasIrrigation ? "#2E7D32" : "#f4f3f4"}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>Do you have storage?</Text>
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
            <Text style={styles.label}>Select your nearest mandi</Text>
            <ScrollView style={styles.list}>
              {MANDIS.map(mandi => (
                <TouchableOpacity
                  key={mandi}
                  style={[styles.listItem, profile.mandi === mandi && styles.listItemActive]}
                  onPress={() => setProfile({ mandi, district: mandi })}
                >
                  <Text style={[styles.listItemText, profile.mandi === mandi && styles.listItemTextActive]}>{mandi}</Text>
                  {profile.mandi === mandi && <Check size={20} color="#2E7D32" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Select your language</Text>
            <View style={styles.chipContainer}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.chip, profile.language === lang && styles.chipActive]}
                  onPress={() => setProfile({ language: lang })}
                >
                  <Text style={[styles.chipText, profile.language === lang && styles.chipTextActive]}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setup your profile</Text>
        <Text style={styles.subtitle}>Step {step} of 5</Text>
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
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : <View />}

        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
          <Text style={styles.nextButtonText}>{step === 5 ? 'Finish' : 'Next'}</Text>
          {step < 5 ? <ArrowRight size={24} color="#fff" /> : <Check size={24} color="#fff" />}
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
