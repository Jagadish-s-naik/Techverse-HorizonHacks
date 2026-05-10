import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

import { useTranslation } from '../utils/translations';

interface MarketItem {
  crop: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  items: MarketItem[];
  onCropPress?: (crop: string) => void;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ items, onCropPress }) => {
  const { t, translate, language } = useTranslation();
  const [translatedCrops, setTranslatedCrops] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const translateCrops = async () => {
      const crops = items.map(item => item.crop);
      const translated = await translate(crops);
      const mapping: Record<string, string> = {};
      crops.forEach((crop, i) => {
        mapping[crop] = translated[i];
      });
      setTranslatedCrops(mapping);
    };

    translateCrops();
  }, [items, language]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.marketOverview || 'Market Overview'} (Live ₹/kg)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.crop} 
            style={styles.card}
            onPress={() => onCropPress && onCropPress(item.crop)}
          >
            <Text style={styles.cropName}>
              {capitalize(translatedCrops[item.crop] || item.crop)}
            </Text>
            <Text style={styles.price}>
              ₹{typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
            </Text>
            <View style={styles.changeRow}>
              {item.change > 0 ? (
                <TrendingUp size={14} color="#2E7D32" />
              ) : item.change < 0 ? (
                <TrendingDown size={14} color="#D32F2F" />
              ) : (
                <Minus size={14} color="#666" />
              )}
              <Text style={[
                styles.changeText,
                { color: item.change > 0 ? '#2E7D32' : item.change < 0 ? '#D32F2F' : '#666' }
              ]}>
                {Math.abs(item.changePercent).toFixed(1)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 110,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MarketOverview;
