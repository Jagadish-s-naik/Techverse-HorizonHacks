import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';
import { useTranslation } from '../utils/translations';
import { User, ChevronRight, Save, LogOut } from 'lucide-react-native';

const CROPS = ['Tomato', 'Onion', 'Chickpea', 'Wheat', 'Rice', 'Mustard'];
const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Marathi', 'Telugu'];
const MANDIS = ['Kolar', 'Lasalgaon', 'Indore', 'Azadpur', 'Vashi'];

const ProfileScreen = ({ navigation }: any) => {
  const { profile, setProfile, saveProfile } = useProfileStore();
  const { t } = useTranslation();

  const handleSave = async () => {
    await saveProfile();
    navigation.goBack();
  };

  const handleReset = () => {
    // For demo purposes, we'll just go back to onboarding
    setProfile({ isOnboarded: false });
    navigation.replace('Onboarding');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={40} color="#fff" />
        </View>
        <Text style={styles.title}>{t.yourProfile}</Text>
        <Text style={styles.subtitle}>ID: {profile.id?.substring(0, 8)}...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.cropMarket}</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t.primaryCrop}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {CROPS.map(crop => (
              <TouchableOpacity
                key={crop}
                style={[styles.chip, profile.crop === crop && styles.chipActive]}
                onPress={() => setProfile({ crop })}
              >
                <Text style={[styles.chipText, profile.crop === crop && styles.chipTextActive]}>{crop}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t.nearestMandi}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
            {MANDIS.map(mandi => (
              <TouchableOpacity
                key={mandi}
                style={[styles.chip, profile.mandi === mandi && styles.chipActive]}
                onPress={() => setProfile({ mandi, district: mandi })}
              >
                <Text style={[styles.chipText, profile.mandi === mandi && styles.chipTextActive]}>{mandi}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.preferences}</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t.language}</Text>
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

        <View style={styles.toggleRow}>
          <Text style={styles.settingLabel}>{t.simpleMode}</Text>
          <Switch 
            value={profile.isSimpleMode} 
            onValueChange={(val) => setProfile({ isSimpleMode: val })}
            trackColor={{ false: "#ddd", true: "#A5D6A7" }}
            thumbColor={profile.isSimpleMode ? "#2E7D32" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.infrastructure}</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.settingLabel}>{t.irrigationAvailable}</Text>
          <Switch 
            value={profile.hasIrrigation} 
            onValueChange={(val) => setProfile({ hasIrrigation: val })}
            trackColor={{ false: "#ddd", true: "#A5D6A7" }}
            thumbColor={profile.hasIrrigation ? "#2E7D32" : "#f4f3f4"}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.settingLabel}>{t.storageAvailable}</Text>
          <Switch 
            value={profile.hasStorage} 
            onValueChange={(val) => setProfile({ hasStorage: val })}
            trackColor={{ false: "#ddd", true: "#A5D6A7" }}
            thumbColor={profile.hasStorage ? "#2E7D32" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#fff" />
          <Text style={styles.saveButtonText}>{t.saveChanges}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <LogOut size={20} color="#666" />
          <Text style={styles.resetButtonText}>{t.resetProfile}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F8' },
  header: { backgroundColor: '#2E7D32', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 20, borderRadius: 16, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 15 },
  settingRow: { marginBottom: 20 },
  settingLabel: { fontSize: 14, color: '#666', marginBottom: 10, fontWeight: '600' },
  chipScroll: { paddingRight: 20 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EEE', marginRight: 8 },
  chipActive: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  chipText: { fontSize: 14, color: '#666' },
  chipTextActive: { color: '#2E7D32', fontWeight: '600' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  footer: { padding: 20, gap: 15 },
  saveButton: { backgroundColor: '#2E7D32', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resetButton: { backgroundColor: '#F0F0F0', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  resetButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;
