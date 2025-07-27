import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Plus, TrendingUp, Calendar, Target, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { DataManager } from '@/utils/DataManager';

interface Craving {
  id: string;
  timestamp: Date;
  intensity: number;
  trigger: string;
  actionTaken: string;
  notes: string;
}

export default function TrackerScreen() {
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [newCraving, setNewCraving] = useState({
    intensity: 5,
    trigger: '',
    actionTaken: '',
    notes: '',
  });
  const [soberDays, setSoberDays] = useState(0);

  useEffect(() => {
    loadTrackerData();
  }, []);

  const loadTrackerData = async () => {
    try {
      const userData = await DataManager.getUserData();
      if (userData.soberStartDate) {
        const days = Math.floor(
          (new Date().getTime() - new Date(userData.soberStartDate).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        setSoberDays(days);
      }

      const cravingData = await DataManager.getCravings();
      setCravings(cravingData);
    } catch (error) {
      console.error('Error loading tracker data:', error);
    }
  };

  const handleLogCraving = async () => {
    if (!newCraving.trigger.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาระบุสาเหตุของความอยาก');
      return;
    }

    try {
      const craving: Craving = {
        id: Date.now().toString(),
        timestamp: new Date(),
        intensity: newCraving.intensity,
        trigger: newCraving.trigger,
        actionTaken: newCraving.actionTaken,
        notes: newCraving.notes,
      };

      await DataManager.addCraving(craving);
      setCravings([craving, ...cravings]);
      
      setNewCraving({
        intensity: 5,
        trigger: '',
        actionTaken: '',
        notes: '',
      });
      setShowCravingModal(false);

      // Show coping suggestion based on intensity
      if (newCraving.intensity >= 7) {
        Alert.alert(
          'แนวทางการรับมือ',
          'ความอยากแรง ลองทำ:\n• หายใจลึกๆ 10 ครั้ง\n• โทรหาเพื่อนสนิท\n• ออกไปเดินข้างนอก\n• ดื่มน้ำเย็น',
          [{ text: 'เข้าใจแล้ว' }]
        );
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return '#4CAF50';
    if (intensity <= 6) return '#FF9800';
    return '#F44336';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 3) return 'น้อย';
    if (intensity <= 6) return 'ปานกลาง';
    return 'มาก';
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekCravings = cravings.filter((c: Craving) => new Date(c.timestamp) >= weekAgo);
    
    return {
      total: weekCravings.length,
      average: weekCravings.length > 0 
        ? (weekCravings.reduce((sum: number, c: Craving) => sum + c.intensity, 0) / weekCravings.length).toFixed(1)
        : 0,
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>การติดตามการฟื้นฟู</Text>
          <Text style={styles.headerSubtitle}>บันทึกและติดตามความก้าวหน้า</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Calendar size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{soberDays}</Text>
            <Text style={styles.statLabel}>วันที่สะอาด</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#2196F3" />
            <Text style={styles.statValue}>{weeklyStats.total}</Text>
            <Text style={styles.statLabel}>ความอยากสัปดาห์นี้</Text>
          </View>
          
          <View style={styles.statCard}>
            <BarChart3 size={24} color="#FF9800" />
            <Text style={styles.statValue}>{weeklyStats.average}</Text>
            <Text style={styles.statLabel}>ความแรงเฉลี่ย</Text>
          </View>
        </View>

        {/* Log Craving Button */}
        <TouchableOpacity
          style={styles.logButton}
          onPress={() => setShowCravingModal(true)}
        >
          <Plus size={24} color="white" />
          <Text style={styles.logButtonText}>บันทึกความอยาก</Text>
        </TouchableOpacity>

        {/* Recent Cravings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ความอยากล่าสุด</Text>
          {cravings.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color="#4CAF50" />
              <Text style={styles.emptyStateText}>ยังไม่มีการบันทึกความอยาก</Text>
              <Text style={styles.emptyStateSubtext}>เก่งมาก! ทำต่อไปแบบนี้</Text>
            </View>
          ) : (
            cravings.slice(0, 10).map((craving: Craving) => (
              <View key={craving.id} style={styles.cravingCard}>
                <View style={styles.cravingHeader}>
                  <View style={styles.cravingInfo}>
                    <Text style={styles.cravingTime}>
                      {new Date(craving.timestamp).toLocaleDateString('th-TH')} {' '}
                      {new Date(craving.timestamp).toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                    <View style={styles.intensityBadge}>
                      <View 
                        style={[
                          styles.intensityDot, 
                          { backgroundColor: getIntensityColor(craving.intensity) }
                        ]} 
                      />
                      <Text style={styles.intensityText}>
                        {getIntensityLabel(craving.intensity)} ({craving.intensity}/10)
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.cravingTrigger}>
                  <Text style={styles.cravingLabel}>สาเหตุ: </Text>
                  {craving.trigger}
                </Text>
                
                {craving.actionTaken && (
                  <Text style={styles.cravingAction}>
                    <Text style={styles.cravingLabel}>การรับมือ: </Text>
                    {craving.actionTaken}
                  </Text>
                )}
                
                {craving.notes && (
                  <Text style={styles.cravingNotes}>
                    <Text style={styles.cravingLabel}>บันทึก: </Text>
                    {craving.notes}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Craving Log Modal */}
      <Modal
        visible={showCravingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCravingModal(false)}>
              <Text style={styles.modalCancel}>ยกเลิก</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>บันทึกความอยาก</Text>
            <TouchableOpacity onPress={handleLogCraving}>
              <Text style={styles.modalSave}>บันทึก</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ความแรงของความอยาก (1-10)</Text>
              <View style={styles.intensitySlider}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.intensityButton,
                      newCraving.intensity === value && styles.intensityButtonActive,
                      { backgroundColor: getIntensityColor(value) + (newCraving.intensity === value ? 'FF' : '40') }
                    ]}
                    onPress={() => setNewCraving({ ...newCraving, intensity: value })}
                  >
                    <Text style={[
                      styles.intensityButtonText,
                      newCraving.intensity === value && styles.intensityButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>สาเหตุของความอยาก *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="เช่น เครียดจากงาน, เห็นเพื่อนดื่ม, เหงา"
                value={newCraving.trigger}
                onChangeText={(text: string) => setNewCraving({ ...newCraving, trigger: text })}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>วิธีการรับมือที่ใช้</Text>
              <TextInput
                style={styles.textInput}
                placeholder="เช่น หายใจลึก, โทรหาเพื่อน, ออกกำลังกาย"
                value={newCraving.actionTaken}
                onChangeText={(text: string) => setNewCraving({ ...newCraving, actionTaken: text })}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>บันทึกเพิ่มเติม</Text>
              <TextInput
                style={styles.textInput}
                placeholder="ความรู้สึก, สถานการณ์ที่เกิดขึ้น"
                value={newCraving.notes}
                onChangeText={(text: string) => setNewCraving({ ...newCraving, notes: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.copingTips}>
              <Text style={styles.copingTitle}>💡 แนวทางการรับมือ</Text>
              <Text style={styles.copingText}>• หายใจลึกๆ 4-7-8 (หายใจเข้า 4 วิ กลั้น 7 วิ หายใจออก 8 วิ)</Text>
              <Text style={styles.copingText}>• ดื่มน้ำเย็นหรือเคี้ยวน้ำแข็ง</Text>
              <Text style={styles.copingText}>• โทรหาเพื่อนหรือคนที่ไว้ใจได้</Text>
              <Text style={styles.copingText}>• ออกไปเดินข้างนอกหรือเปลี่ยนสถานที่</Text>
              <Text style={styles.copingText}>• ฟังเพลงหรือทำกิจกรรมที่ชอบ</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  logButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  },
  cravingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cravingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cravingInfo: {
    flex: 1,
  },
  cravingTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  cravingLabel: {
    fontWeight: '600',
    color: '#333',
  },
  cravingTrigger: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  cravingAction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  cravingNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSave: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
  },
  intensitySlider: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  intensityButtonActive: {
    borderColor: 'transparent',
  },
  intensityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  intensityButtonTextActive: {
    color: 'white',
  },
  copingTips: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  copingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  copingText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 6,
    lineHeight: 20,
  },
});