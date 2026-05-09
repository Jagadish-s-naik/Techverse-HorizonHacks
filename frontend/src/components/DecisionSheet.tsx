import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, ShieldCheck, AlertCircle, Info, ArrowRight } from 'lucide-react-native';
import { useTranslation } from '../utils/translations';

interface DecisionSheetProps {
  visible: boolean;
  onClose: () => void;
  recommendation: {
    action: string;
    risk: 'safe' | 'moderate' | 'risky';
    rationale: string;
    alternative: string;
  } | null;
}

const DecisionSheet = ({ visible, onClose, recommendation }: DecisionSheetProps) => {
  const { t } = useTranslation();
  if (!recommendation) return null;

  const riskColors = {
    safe: '#2E7D32',
    moderate: '#F9A825',
    risky: '#C62828'
  };

  const RiskIcon = recommendation.risk === 'safe' ? ShieldCheck : AlertCircle;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.decisionRecommendation}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={[styles.actionCard, { borderColor: riskColors[recommendation.risk] }]}>
              <View style={styles.riskHeader}>
                <View style={[styles.riskBadge, { backgroundColor: riskColors[recommendation.risk] + '20' }]}>
                  <RiskIcon size={16} color={riskColors[recommendation.risk]} />
                  <Text style={[styles.riskText, { color: riskColors[recommendation.risk] }]}>
                    {(t[recommendation.risk] || recommendation.risk).toUpperCase()} {t.risk.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.actionText}>{recommendation.action}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Info size={18} color="#2E7D32" />
                <Text style={styles.sectionTitle}>{t.whyRecommendThis}</Text>
              </View>
              <Text style={styles.rationaleText}>{recommendation.rationale}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ArrowRight size={18} color="#666" />
                <Text style={styles.sectionTitle}>{t.alternativeAction}</Text>
              </View>
              <Text style={styles.alternativeText}>{recommendation.alternative}</Text>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>{t.iUnderstand}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#F8F9F8',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  riskHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  rationaleText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  alternativeText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  doneButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DecisionSheet;
