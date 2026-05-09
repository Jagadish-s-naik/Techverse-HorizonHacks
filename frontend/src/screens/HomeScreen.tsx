import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';
import { forecastService, communityService } from '../services/api';
import ForecastCard from '../components/ForecastCard';
import * as Speech from 'expo-speech';

const HomeScreen = () => {
  const { profile } = useProfileStore();
  const [forecast, setForecast] = useState<any>(null);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const forecastRes = await forecastService.getLatest(profile.crop, profile.mandi);
      setForecast(forecastRes.data);

      const communityRes = await communityService.getSignal(profile.crop, profile.district);
      setCommunity(communityRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback/Mock data for demo if API fails
      if (!forecast) {
        setForecast({
          crop: profile.crop,
          mandi: profile.mandi,
          price_low: 38,
          price_high: 44,
          trend: 'up',
          confidence: 82,
          drivers: [
            "Increased demand in metropolitan centers driving prices",
            "Lower arrivals in local markets due to harvest delays",
            "Favorable weather supporting quality"
          ],
          forecast_date: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleVoiceReadout = () => {
    if (!forecast) return;
    const text = `Forecast for ${forecast.crop} in ${forecast.mandi}. 
      Expected price is between ${forecast.price_low} and ${forecast.price_high} rupees per kilogram. 
      The trend is ${forecast.trend}. 
      Confidence is ${forecast.confidence} percent. 
      Key drivers: ${forecast.drivers.join('. ')}`;
    
    Speech.speak(text, {
      language: profile.language === 'Kannada' ? 'kn-IN' : 'en-IN',
      rate: 0.9
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Hello, Farmer</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>

      {forecast && (
        <ForecastCard 
          data={forecast} 
          onVoiceReadout={handleVoiceReadout}
          onTrackRecordPress={() => {}}
        />
      )}

      {community && (
        <View style={styles.communitySignal}>
          <Text style={styles.communityTitle}>Community Signal</Text>
          <Text style={styles.communityInfo}>
            <Text style={styles.countText}>{community.count}</Text> farmers in your district plan to grow {community.crop} this season.
          </Text>
          <Text style={styles.implicationText}>{community.implication}</Text>
        </View>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
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
});

export default HomeScreen;
