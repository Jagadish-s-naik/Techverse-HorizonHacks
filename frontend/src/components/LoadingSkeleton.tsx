
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const MarketScrollerSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.marketScroller}>
      {[1, 2, 3].map((i) => (
        <Animated.View key={i} style={[styles.skeleton, styles.marketCard, { opacity: animatedValue }]} />
      ))}
    </View>
  );
};

const LoadingSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Animated.View style={[styles.skeleton, styles.title, { opacity: animatedValue }]} />
        <Animated.View style={[styles.skeleton, styles.subtitle, { opacity: animatedValue }]} />
      </View>

      <MarketScrollerSkeleton />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Animated.View style={[styles.skeleton, styles.circle, { opacity: animatedValue }]} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Animated.View style={[styles.skeleton, styles.textShort, { opacity: animatedValue }]} />
            <Animated.View style={[styles.skeleton, styles.textLong, { opacity: animatedValue }]} />
          </View>
        </View>
        <Animated.View style={[styles.skeleton, styles.priceBlock, { opacity: animatedValue }]} />
        <Animated.View style={[styles.skeleton, styles.bar, { opacity: animatedValue }]} />
        <Animated.View style={[styles.skeleton, styles.bar, { opacity: animatedValue, width: '60%' }]} />
      </View>

      <View style={styles.communitySignal}>
        <Animated.View style={[styles.skeleton, styles.textShort, { opacity: animatedValue, width: '40%' }]} />
        <Animated.View style={[styles.skeleton, styles.textLong, { opacity: animatedValue, marginTop: 12 }]} />
        <Animated.View style={[styles.skeleton, styles.textLong, { opacity: animatedValue, marginTop: 8 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flex: 1 },
  welcomeSection: { marginBottom: 30, marginTop: 20 },
  skeleton: { backgroundColor: '#E0E0E0', borderRadius: 8 },
  title: { height: 32, width: '60%', marginBottom: 10 },
  subtitle: { height: 18, width: '40%' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  circle: { width: 48, height: 48, borderRadius: 24 },
  textShort: { height: 16, width: '50%', marginBottom: 8 },
  textLong: { height: 12, width: '90%' },
  priceBlock: { height: 80, width: '100%', borderRadius: 12, marginVertical: 20 },
  bar: { height: 12, width: '80%', marginBottom: 12 },
  communitySignal: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: '#E0E0E0' },
  marketScroller: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  marketCard: { width: 110, height: 90, borderRadius: 12 },
});

export default LoadingSkeleton;
