import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';
import { forecastService, communityService, marketService } from '../services/api';
import MarketOverview from '../components/MarketOverview';
import ForecastCard from '../components/ForecastCard';
import SimpleForecastView from '../components/SimpleForecastView';
import DecisionSheet from '../components/DecisionSheet';
import TrackRecordModal from '../components/TrackRecordModal';
import * as Speech from 'expo-speech';
import { Lightbulb, WifiOff, Layout, Type, User, AlertCircle } from 'lucide-react-native';
import { offlineStorage } from '../services/offlineStorage';
import * as Network from 'expo-network';
import { useTranslation, getLocalizedReadout } from '../utils/translations';

import LoadingSkeleton, { MarketScrollerSkeleton } from '../components/LoadingSkeleton';

const CommunitySignal = ({ data }: { data: any }) => {
  const { t, translate, language } = useTranslation();
  const [translatedData, setTranslatedData] = useState<any>(null);

  useEffect(() => {
    const translateContent = async () => {
      if (!data) return;
      try {
        const results = await translate([data.crop, data.implication]);
        if (Array.isArray(results)) {
          setTranslatedData({
            ...data,
            crop: results[0],
            implication: results[1]
          });
        }
      } catch (e) {
        console.warn('Failed to translate community signal', e);
      }
    };
    translateContent();
  }, [data, language]);

  const displayData = translatedData || data;
  if (!displayData) return null;

  return (
    <View style={styles.communitySignal}>
      <Text style={styles.communityTitle}>{t.communitySignal}</Text>
      <Text style={styles.communityInfo}>
        <Text style={styles.countText}>{displayData.count}</Text> {t.farmersInYourDistrict} {displayData.crop} {t.thisSeason}.
      </Text>
      <Text style={styles.implicationText}>{displayData.implication}</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }: any) => {
  // ... existing states ...
  const { profile, syncChanges, isSyncing, toggleSimpleMode } = useProfileStore();
  const { t } = useTranslation();
  const [forecast, setForecast] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [showTrackRecord, setShowTrackRecord] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [insufficientData, setInsufficientData] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([]);

  const fetchData = async () => {
    // 1. Try to load from offline storage first (Stale-While-Revalidate)
    const cacheKeyForecast = `forecast_${profile.crop}_${profile.mandi}`;
    const cacheKeyCommunity = `community_${profile.crop}_${profile.district}`;
    const cacheKeyMarket = `market_overview`;

    const cachedForecast = await offlineStorage.getResponse(cacheKeyForecast);
    const cachedCommunity = await offlineStorage.getResponse(cacheKeyCommunity);
    const cachedMarket = await offlineStorage.getResponse(cacheKeyMarket);

    if (cachedForecast) setForecast(cachedForecast);
    if (cachedCommunity) setCommunity(cachedCommunity);
    if (cachedMarket) setMarketData(cachedMarket);
    if (cachedForecast || cachedCommunity || cachedMarket) setLoading(false);

    try {
      const networkState = await Network.getNetworkStateAsync();
      const online = networkState.isConnected && networkState.isInternetReachable;
      setIsOffline(!online);

      if (!online) {
        if (!cachedForecast) throw new Error('Offline and no cache');
        return;
      }

      const forecastRes = await forecastService.getLatest(profile.crop, profile.mandi, profile.id);
      if (forecastRes.data.status === 'insufficient_data') {
        setInsufficientData(true);
        // Keep the data so we can at least show the live price if available
        setForecast(forecastRes.data);
      } else {
        setInsufficientData(false);
        setForecast(forecastRes.data);
        await offlineStorage.saveResponse(cacheKeyForecast, forecastRes.data);
      }

      const communityRes = await communityService.getSignal(profile.crop, profile.district);
      setCommunity(communityRes.data);
      await offlineStorage.saveResponse(cacheKeyCommunity, communityRes.data);

      const marketRes = await marketService.getOverview();
      setMarketData(marketRes.data);
      await offlineStorage.saveResponse(cacheKeyMarket, marketRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsOffline(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    syncChanges();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleVoiceReadout = async () => {
    if (!forecast) return;
    
    const langMap: any = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Kannada': 'kn-IN',
      'Marathi': 'mr-IN',
      'Telugu': 'te-IN'
    };

    const localizedText = await getLocalizedReadout(forecast, profile.language);

    Speech.speak(localizedText, {
      language: langMap[profile.language] || 'en-IN',
      rate: 0.85 
    });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>{t.hello}, {profile.name || 'Farmer'}</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString(
                  profile.language === 'English' ? 'en-IN' : 
                  profile.language === 'Hindi' ? 'hi-IN' : 
                  profile.language === 'Kannada' ? 'kn-IN' : 
                  profile.language === 'Marathi' ? 'mr-IN' : 
                  profile.language === 'Telugu' ? 'te-IN' : 'en-IN', 
                  { weekday: 'long', day: 'numeric', month: 'long' }
                )}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.toggleButton, profile.isSimpleMode && styles.toggleButtonActive]} 
                onPress={toggleSimpleMode}
              >
                {profile.isSimpleMode ? <Layout size={20} color="#2E7D32" /> : <Type size={20} color="#666" />}
                <Text style={[styles.toggleButtonText, profile.isSimpleMode && styles.toggleButtonTextActive]}>
                  {profile.isSimpleMode ? t.standard : t.simple}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => navigation.navigate('Profile')}
              >
                <User size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {marketData.length > 0 ? (
          <MarketOverview 
            items={marketData} 
            onCropPress={(crop) => {
              setProfile({ crop });
              // Small delay to ensure state update then refresh
              setTimeout(fetchData, 100);
            }} 
          />
        ) : (
          <MarketScrollerSkeleton />
        )}

        {isOffline && (
          <View style={styles.offlineBanner}>
            <WifiOff size={16} color="#721c24" />
            <Text style={styles.offlineText}>{t.offlineMessage}</Text>
          </View>
        )}

        {isSyncing && (
          <View style={styles.syncIndicator}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.syncText}>{t.syncingMessage}</Text>
          </View>
        )}

        {insufficientData && (
          <View style={styles.errorCard}>
            <AlertCircle size={24} color="#D32F2F" />
            <Text style={styles.errorText}>{t.insufficientData}</Text>
          </View>
        )}

        {forecast && (
          profile.isSimpleMode ? (
            <SimpleForecastView 
              data={forecast}
              onVoiceReadout={handleVoiceReadout}
              onTrackRecordPress={() => setShowTrackRecord(true)}
            />
          ) : (
            <TouchableOpacity activeOpacity={0.9} onPress={() => setShowDecision(true)}>
              <ForecastCard
                data={forecast}
                onVoiceReadout={handleVoiceReadout}
                onTrackRecordPress={() => setShowTrackRecord(true)}
              />
              {forecast.recommendation && (
                <View style={styles.quickAction}>
                  <Lightbulb size={20} color="#2E7D32" />
                  <Text style={styles.quickActionText}>{t.tapToViewDecision}</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        )}

        {community && (
          <CommunitySignal data={community} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <DecisionSheet
        visible={showDecision}
        onClose={() => setShowDecision(false)}
        recommendation={forecast?.recommendation}
      />

      <TrackRecordModal
        visible={showTrackRecord}
        onClose={() => setShowTrackRecord(false)}
        crop={profile.crop}
        mandi={profile.mandi}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F8',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButtonActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#2E7D32',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginTop: -10,
    marginBottom: 20,
    marginHorizontal: 10,
    zIndex: -1,
  },
  quickActionText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  communitySignal: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  communityInfo: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  countText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  implicationText: {
    fontSize: 14,
    color: '#1B5E20',
    fontStyle: 'italic',
    marginTop: 10,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  offlineText: {
    color: '#721c24',
    fontSize: 13,
    fontWeight: '500',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  syncText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
});

export default HomeScreen;
