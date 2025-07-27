import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp, Calendar, Heart, ChartBar as BarChart3 } from 'lucide-react-native';
import { MoodTracker, MoodEntry, MoodStats } from '@/utils/MoodTracker';

export default function MoodScreen() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood']>('neutral');
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [newTrigger, setNewTrigger] = useState('');

  const moodOptions: Array<{ mood: MoodEntry['mood']; emoji: string; label: string; color: string }> = [
    { mood: 'very_sad', emoji: '😢', label: 'เศร้ามาก', color: '#F44336' },
    { mood: 'sad', emoji: '😔', label: 'เศร้า', color: '#FF9800' },
    { mood: 'neutral', emoji: '😐', label: 'ปกติ', color: '#9E9E9E' },
    { mood: 'happy', emoji: '😊', label: 'ดี', color: '#4CAF50' },
    { mood: 'very_happy', emoji: '😄', label: 'ดีมาก', color: '#2196F3' },
  ];

  const commonTriggers = [
    'เครียดจากงาน', 'ปัญหาครอบครัว', 'เหงา', 'เบื่อ', 'โกรธ', 
    'กังวล', 'เหนื่อย', 'ปวดหัว', 'นอนไม่หลับ', 'ปัญหาเงิน'
  ];

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      const [entries, stats] = await Promise.all([
        MoodTracker.getMoodEntries(),
        MoodTracker.getMoodStats(30)
      ]);
      setMoodEntries(entries);
      setMoodStats(stats);
    } catch (error) {
      console.error('Error loading mood data:', error);
    }
  };

  const handleSaveMood = async () => {
    try {
      await MoodTracker.addMoodEntry({
        mood: selectedMood,
        energy,
        stress,
        notes: notes.trim() || undefined,
        triggers: triggers.length > 0 ? triggers : undefined
      });

      // Reset form
      setSelectedMood('neutral');
      setEnergy(5);
      setStress(5);
      setNotes('');
      setTriggers([]);
      setNewTrigger('');
      setShowMoodModal(false);

      // Reload data
      await loadMoodData();

      Alert.alert('สำเร็จ', 'บันทึกอารมณ์เรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกอารมณ์ได้');
    }
  };

  const addTrigger = () => {
    if (newTrigger.trim() && !triggers.includes(newTrigger.trim())) {
      setTriggers([...triggers, newTrigger.trim()]);
      setNewTrigger('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setTriggers(triggers.filter(t => t !== trigger));
  };

  const getMoodTrendIcon = () => {
    if (!moodStats) return <BarChart3 size={24} color="#666" />;
    
    switch (moodStats.moodTrend) {
      case 'improving': return <TrendingUp size={24} color="#4CAF50" />;
      case 'declining': return <TrendingUp size={24} color="#F44336" style={{ transform: [{ rotate: '180deg' }] }} />;
      default: return <BarChart3 size={24} color="#FF9800" />;
    }
  };

  const getMoodTrendText = () => {
    if (!moodStats) return 'ไม่มีข้อมูล';
    
    switch (moodStats.moodTrend) {
      case 'improving': return 'อารมณ์ดีขึ้น';
      case 'declining': return 'อารมณ์แย่ลง';
      default: return 'อารมณ์คงที่';
    }
  };

  const getMoodTrendColor = () => {
    if (!moodStats) return '#666';
    
    switch (moodStats.moodTrend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#F44336';
      default: return '#FF9800';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#9C27B0', '#BA68C8']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>ติดตามอารมณ์</Text>
          <Text style={styles.headerSubtitle}>เข้าใจและดูแลจิตใจของคุณ</Text>
        </LinearGradient>

        {/* Quick Mood Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>อารมณ์ตอนนี้เป็นอย่างไร?</Text>
          <View style={styles.quickMoodSelector}>
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.mood}
                style={styles.quickMoodButton}
                onPress={() => {
                  setSelectedMood(option.mood);
                  setShowMoodModal(true);
                }}
              >
                <Text style={styles.quickMoodEmoji}>{option.emoji}</Text>
                <Text style={styles.quickMoodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        {moodStats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Heart size={24} color="#E91E63" />
              <Text style={styles.statValue}>{moodStats.averageMood.toFixed(1)}/5</Text>
              <Text style={styles.statLabel}>อารมณ์เฉลี่ย</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={{ transform: [{ rotate: '45deg' }] }}>
                <BarChart3 size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{moodStats.averageEnergy.toFixed(1)}/10</Text>
              <Text style={styles.statLabel}>พลังงานเฉลี่ย</Text>
            </View>
            
            <View style={styles.statCard}>
              {getMoodTrendIcon()}
              <Text style={[styles.statValue, { color: getMoodTrendColor() }]}>
                {getMoodTrendText()}
              </Text>
              <Text style={styles.statLabel}>แนวโน้ม</Text>
            </View>
          </View>
        )}

        {/* Recent Entries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>บันทึกล่าสุด</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowMoodModal(true)}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>

          {moodEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={48} color="#9C27B0" />
              <Text style={styles.emptyStateText}>ยังไม่มีการบันทึกอารมณ์</Text>
              <Text style={styles.emptyStateSubtext}>เริ่มบันทึกเพื่อติดตามความรู้สึกของคุณ</Text>
            </View>
          ) : (
            moodEntries.slice(0, 10).map((entry) => (
              <View key={entry.id} style={styles.moodEntryCard}>
                <View style={styles.moodEntryHeader}>
                  <View style={styles.moodEntryInfo}>
                    <Text style={styles.moodEntryEmoji}>
                      {MoodTracker.getMoodEmoji(entry.mood)}
                    </Text>
                    <View style={styles.moodEntryDetails}>
                      <Text style={styles.moodEntryLabel}>
                        {MoodTracker.getMoodLabel(entry.mood)}
                      </Text>
                      <Text style={styles.moodEntryTime}>
                        {new Date(entry.timestamp).toLocaleDateString('th-TH')} {' '}
                        {new Date(entry.timestamp).toLocaleTimeString('th-TH', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.moodEntryStats}>
                    <Text style={styles.moodEntryStat}>⚡ {entry.energy}/10</Text>
                    <Text style={styles.moodEntryStat}>😰 {entry.stress}/10</Text>
                  </View>
                </View>

                {entry.triggers && entry.triggers.length > 0 && (
                  <View style={styles.triggersContainer}>
                    <Text style={styles.triggersLabel}>สาเหตุ:</Text>
                    <View style={styles.triggerTags}>
                      {entry.triggers.map((trigger, index) => (
                        <View key={index} style={styles.triggerTag}>
                          <Text style={styles.triggerTagText}>{trigger}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {entry.notes && (
                  <Text style={styles.moodEntryNotes}>{entry.notes}</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Mood Entry Modal */}
      <Modal
        visible={showMoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMoodModal(false)}>
              <Text style={styles.modalCancel}>ยกเลิก</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>บันทึกอารมณ์</Text>
            <TouchableOpacity onPress={handleSaveMood}>
              <Text style={styles.modalSave}>บันทึก</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Mood Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>อารมณ์ของคุณ</Text>
              <View style={styles.moodSelector}>
                {moodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.mood}
                    style={[
                      styles.moodOption,
                      selectedMood === option.mood && styles.moodOptionSelected,
                      { borderColor: option.color }
                    ]}
                    onPress={() => setSelectedMood(option.mood)}
                  >
                    <Text style={styles.moodOptionEmoji}>{option.emoji}</Text>
                    <Text style={styles.moodOptionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Energy Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ระดับพลังงาน: {energy}/10</Text>
              <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.sliderButton,
                      energy === value && styles.sliderButtonActive,
                      { backgroundColor: energy === value ? '#4CAF50' : '#E0E0E0' }
                    ]}
                    onPress={() => setEnergy(value)}
                  >
                    <Text style={[
                      styles.sliderButtonText,
                      energy === value && styles.sliderButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stress Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ระดับความเครียด: {stress}/10</Text>
              <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.sliderButton,
                      stress === value && styles.sliderButtonActive,
                      { backgroundColor: stress === value ? '#FF9800' : '#E0E0E0' }
                    ]}
                    onPress={() => setStress(value)}
                  >
                    <Text style={[
                      styles.sliderButtonText,
                      stress === value && styles.sliderButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Triggers */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>สาเหตุที่ทำให้รู้สึกแบบนี้</Text>
              <View style={styles.commonTriggers}>
                {commonTriggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    style={[
                      styles.triggerChip,
                      triggers.includes(trigger) && styles.triggerChipSelected
                    ]}
                    onPress={() => {
                      if (triggers.includes(trigger)) {
                        removeTrigger(trigger);
                      } else {
                        setTriggers([...triggers, trigger]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.triggerChipText,
                      triggers.includes(trigger) && styles.triggerChipTextSelected
                    ]}>
                      {trigger}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.customTriggerContainer}>
                <TextInput
                  style={styles.customTriggerInput}
                  placeholder="เพิ่มสาเหตุอื่นๆ"
                  value={newTrigger}
                  onChangeText={setNewTrigger}
                  onSubmitEditing={addTrigger}
                />
                <TouchableOpacity style={styles.addTriggerButton} onPress={addTrigger}>
                  <Plus size={20} color="white" />
                </TouchableOpacity>
              </View>

              {triggers.length > 0 && (
                <View style={styles.selectedTriggers}>
                  {triggers.map((trigger) => (
                    <TouchableOpacity
                      key={trigger}
                      style={styles.selectedTriggerTag}
                      onPress={() => removeTrigger(trigger)}
                    >
                      <Text style={styles.selectedTriggerText}>{trigger} ×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>บันทึกเพิ่มเติม</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="เขียนความรู้สึกหรือเหตุการณ์ที่เกิดขึ้น..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#9C27B0',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickMoodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickMoodButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  quickMoodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickMoodLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  statValue: {
    fontSize: 18,
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
  moodEntryCard: {
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
  moodEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  moodEntryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEntryEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodEntryDetails: {
    flex: 1,
  },
  moodEntryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  moodEntryTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moodEntryStats: {
    alignItems: 'flex-end',
  },
  moodEntryStat: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  triggersContainer: {
    marginTop: 8,
  },
  triggersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  triggerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  triggerTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  triggerTagText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  moodEntryNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
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
    color: '#9C27B0',
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
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: '30%',
  },
  moodOptionSelected: {
    borderWidth: 2,
  },
  moodOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodOptionLabel: {
    fontSize: 12,
    color: '#333',
  },
  sliderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sliderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sliderButtonTextActive: {
    color: 'white',
  },
  commonTriggers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  triggerChip: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  triggerChipSelected: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  triggerChipText: {
    fontSize: 12,
    color: '#666',
  },
  triggerChipTextSelected: {
    color: 'white',
  },
  customTriggerContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  customTriggerInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addTriggerButton: {
    backgroundColor: '#9C27B0',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTriggers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  selectedTriggerTag: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedTriggerText: {
    fontSize: 12,
    color: 'white',
  },
  notesInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    minHeight: 100,
  },
});