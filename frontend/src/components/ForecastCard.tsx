import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus, Volume2, Info } from 'lucide-react-native';
import { useTranslation } from '../utils/translations';

interface ForecastCardProps {
  data: {
    crop: string;
    mandi: string;
    price_low: number;
    price_high: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    drivers: string[];
    forecast_date: string;
  };
  onVoiceReadout: () => void;
  onTrackRecordPress: () => void;
}

const ForecastCard = ({ data, onVoiceReadout, onTrackRecordPress }: ForecastCardProps) => {
  const { t } = useTranslation();
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor = data.trend === 'up' ? '#2E7D32' : data.trend === 'down' ? '#C62828' : '#F9A825';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.cropTitle}>{data.crop.toUpperCase()}</Text>
          <Text style={styles.mandiSubtitle}>{data.mandi} {t.mandiLabel}</Text>
        </View>
        <TouchableOpacity onPress={onVoiceReadout} style={styles.voiceButton}>
          <Volume2 size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>{t.expectedPriceRange}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>₹{data.price_low} — ₹{data.price_high}</Text>
          <View style={[styles.trendBadge, { backgroundColor: trendColor + '20' }]}>
            <TrendIcon size={18} color={trendColor} />
          </View>
        </View>
      </View>

      <View style={styles.confidenceBarContainer}>
        <View style={styles.confidenceHeader}>
          <Text style={styles.confidenceLabel}>{t.confidenceIs}</Text>
          <Text style={styles.confidenceValue}>{data.confidence}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${data.confidence}%` }]} />
        </View>
      </View>

      <View style={styles.driversContainer}>
        <Text style={styles.driversTitle}>{t.keyPriceDrivers}</Text>
        {data.drivers.map((driver, index) => (
          <View key={index} style={styles.driverItem}>
            <View style={styles.bullet} />
            <Text style={styles.driverText}>{driver}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={onTrackRecordPress} style={styles.trackRecordLink}>
        <Info size={16} color="#666" />
        <Text style={styles.trackRecordText}>{t.howAccurate}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cropTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
  },
  mandiSubtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  trendBadge: {
    padding: 6,
    borderRadius: 8,
  },
  confidenceBarContainer: {
    marginBottom: 25,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  driversContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 15,
    marginBottom: 15,
  },
  driversTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 7,
  },
  driverText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  trackRecordLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  trackRecordText: {
    fontSize: 13,
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default ForecastCard;
