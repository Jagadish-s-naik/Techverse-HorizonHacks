import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageSquare, Volume2, Info } from 'lucide-react-native';
import { useTranslation } from '../utils/translations';

interface SimpleForecastViewProps {
  data: any;
  onVoiceReadout: () => void;
  onTrackRecordPress: () => void;
}

const SimpleForecastView = ({ data, onVoiceReadout, onTrackRecordPress }: SimpleForecastViewProps) => {
  const { t, translate, language } = useTranslation();
  const [translatedData, setTranslatedData] = React.useState<any>(null);
  
  const hasForecast = data.price_low !== undefined && data.price_high !== undefined;

  React.useEffect(() => {
    const translateContent = async () => {
      if (!data) return;

      const toTranslate = [
        data.crop,
        data.mandi,
        data.recommendation?.action,
        data.recommendation?.rationale,
        ...(data.drivers || [])
      ];

      const results = await translate(toTranslate);
      
      let index = 0;
      const getNext = () => results[index++];
      
      const newData = { ...data };
      newData.crop = getNext();
      newData.mandi = getNext();
      
      if (data.recommendation) {
        newData.recommendation = { 
          ...data.recommendation,
          action: getNext(),
          rationale: getNext()
        };
      } else {
        index += 2; // Skip action and rationale
      }
      
      if (data.drivers) {
        newData.drivers = data.drivers.map(() => getNext());
      }

      setTranslatedData(newData);
    };

    translateContent();
  }, [data, language]);

  const displayData = translatedData || data;

  return (
    <View style={styles.container}>
      <View style={styles.smsHeader}>
        <Text style={styles.smsHeaderTitle}>{t.smsUpdate}</Text>
        <Text style={styles.smsTime}>Now • {t.smsFallbackLabel}</Text>
      </View>

      {/* Bubble 1: Basic Info */}
      <View style={styles.bubbleLeft}>
        <Text style={styles.bubbleText}>
          {t.forecastFor} {displayData.crop} {t.in} {displayData.mandi}:{"\n"}
          {hasForecast ? (
            <>
              {t.expectedPriceIs}: ₹{displayData.price_low} - ₹{displayData.price_high} / kg{"\n"}
              {t.trendIs}: {displayData.trend === 'up' ? `↗️ ${t.up.toUpperCase()}` : displayData.trend === 'down' ? `↘️ ${t.down.toUpperCase()}` : `➡️ ${t.stable.toUpperCase()}`}
            </>
          ) : (
            <>
              {t.livePrice}: {displayData.todayPrice ? `₹${displayData.todayPrice} / kg` : 'N/A'}
            </>
          )}
        </Text>
      </View>

      {/* Bubble 2: Recommendation */}
      {hasForecast && displayData.recommendation && (
        <View style={styles.bubbleLeft}>
          <Text style={styles.bubbleText}>
            {t.adviceLabel}: {displayData.recommendation.action}{"\n"}
            {t.whyLabel}: {displayData.recommendation.rationale}
          </Text>
        </View>
      )}

      {/* Bubble 3: Confidence & Drivers */}
      {hasForecast && displayData.confidence !== undefined && displayData.drivers && (
        <View style={styles.bubbleLeft}>
          <Text style={styles.bubbleText}>
            {t.confidenceIs.toUpperCase()}: {displayData.confidence}%{"\n"}
            {t.keyFactors.toUpperCase()}:{"\n"}
            {displayData.drivers.map((d: string, i: number) => `• ${d}${i < displayData.drivers.length - 1 ? '\n' : ''}`)}
          </Text>
        </View>
      )}

      {/* Action Buttons styled as quick replies */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onVoiceReadout}>
          <Volume2 size={18} color="#2E7D32" />
          <Text style={styles.actionButtonText}>{t.listen}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onTrackRecordPress}>
          <Info size={18} color="#2E7D32" />
          <Text style={styles.actionButtonText}>{t.checkAccuracy}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <MessageSquare size={14} color="#666" />
        <Text style={styles.footerText}>{t.replyHelp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 10,
  },
  smsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  smsHeaderTitle: {
    fontWeight: 'bold',
    color: '#1B5E20',
    fontSize: 12,
    letterSpacing: 1,
  },
  smsTime: {
    color: '#999',
    fontSize: 10,
  },
  bubbleLeft: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  bubbleText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'System', // Using system font for that SMS feel
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
    paddingHorizontal: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  actionButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 5,
    opacity: 0.6,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  }
});

export default SimpleForecastView;
