import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, TrendingUp, Shield, Target, Award, RefreshCw, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Lightbulb } from 'lucide-react-native';
import { AIInsightsManager, InsightData, RelapsePrevention } from '@/utils/AIInsightsManager';
import { DataManager } from '@/utils/DataManager';

export default function InsightsScreen() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [relapsePrevention, setRelapsePrevention] = useState<RelapsePrevention | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      const [insightsData, preventionPlan] = await Promise.all([
        AIInsightsManager.generateInsights(),
        AIInsightsManager.generateRelapsePrevention()
      ]);
      
      setInsights(insightsData);
      setRelapsePrevention(preventionPlan);
    } catch (error) {
      console.error('Error loading insights:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลการวิเคราะห์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  const getInsightIcon = (type: InsightData['type']) => {
    switch (type) {
      case 'pattern': return <TrendingUp size={24} color="#2196F3" />;
      case 'risk': return <Shield size={24} color="#FF9800" />;
      case 'strategy': return <Lightbulb size={24} color="#4CAF50" />;
      case 'milestone': return <Award size={24} color="#9C27B0" />;
      default: return <Brain size={24} color="#666" />;
    }
  };

  const getSeverityColor = (severity: InsightData['severity']) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getSeverityLabel = (severity: InsightData['severity']) => {
    switch (severity) {
      case 'high': return 'สูง';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Brain size={48} color="#4CAF50" />
          <Text style={styles.loadingText}>กำลังวิเคราะห์ข้อมูล...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Brain size={32} color="white" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI การวิเคราะห์</Text>
              <Text style={styles.headerSubtitle}>ข้อมูลเชิงลึกสำหรับการฟื้นฟู</Text>
            </View>
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <RefreshCw size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลเชิงลึก</Text>
          {insights.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color="#4CAF50" />
              <Text style={styles.emptyStateText}>ยังไม่มีข้อมูลเพียงพอ</Text>
              <Text style={styles.emptyStateSubtext}>
                ใช้แอปต่อไปเพื่อให้ AI วิเคราะห์รูปแบบของคุณ
              </Text>
            </View>
          ) : (
            insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  {getInsightIcon(insight.type)}
                  <View style={styles.insightInfo}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <View style={styles.severityBadge}>
                      <View 
                        style={[
                          styles.severityDot, 
                          { backgroundColor: getSeverityColor(insight.severity) }
                        ]} 
                      />
                      <Text style={styles.severityText}>
                        ระดับ: {getSeverityLabel(insight.severity)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.insightDescription}>{insight.description}</Text>
                
                <View style={styles.actionItems}>
                  <Text style={styles.actionItemsTitle}>แนวทางปฏิบัติ:</Text>
                  {insight.actionItems.map((action, index) => (
                    <Text key={index} style={styles.actionItem}>
                      • {action}
                    </Text>
                  ))}
                </View>
                
                <Text style={styles.insightTime}>
                  {new Date(insight.createdAt).toLocaleDateString('th-TH')} {' '}
                  {new Date(insight.createdAt).toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Relapse Prevention Plan */}
        {relapsePrevention && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>แผนป้องกันการกลับไปเสพ</Text>
            
            <View style={styles.preventionCard}>
              <View style={styles.preventionHeader}>
                <Shield size={24} color="#F44336" />
                <Text style={styles.preventionTitle}>แผนฉุกเฉิน</Text>
              </View>
              
              <View style={styles.preventionSection}>
                <Text style={styles.preventionSectionTitle}>📞 ติดต่อฉุกเฉิน</Text>
                {relapsePrevention.emergencyContacts.map((contact, index) => (
                  <TouchableOpacity key={index} style={styles.contactItem}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.preventionSection}>
                <Text style={styles.preventionSectionTitle}>🛡️ เทคนิคการรับมือ</Text>
                {relapsePrevention.copingStrategies.slice(0, 3).map((strategy, index) => (
                  <Text key={index} style={styles.strategyItem}>
                    • {strategy}
                  </Text>
                ))}
              </View>

              <View style={styles.preventionSection}>
                <Text style={styles.preventionSectionTitle}>⚠️ สัญญาณเตือน</Text>
                {relapsePrevention.warningSignsChecklist.slice(0, 3).map((sign, index) => (
                  <Text key={index} style={styles.warningItem}>
                    • {sign}
                  </Text>
                ))}
              </View>

              <TouchableOpacity style={styles.viewFullPlanButton}>
                <Text style={styles.viewFullPlanText}>ดูแผนฉบับเต็ม</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* AI Disclaimer */}
        <View style={styles.disclaimer}>
          <AlertTriangle size={20} color="#FF9800" />
          <Text style={styles.disclaimerText}>
            ข้อมูลเชิงลึกนี้เป็นการวิเคราะห์เบื้องต้นจาก AI 
            ไม่สามารถทดแทนคำแนะนำจากผู้เชี่ยวชาญได้
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  insightDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionItems: {
    marginBottom: 12,
  },
  actionItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  insightTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  preventionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  preventionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  preventionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  preventionSection: {
    marginBottom: 16,
  },
  preventionSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  strategyItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  warningItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  viewFullPlanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewFullPlanText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#EF6C00',
    lineHeight: 20,
  },
});