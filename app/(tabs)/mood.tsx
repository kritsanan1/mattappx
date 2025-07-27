
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Heart, Plus, Calendar, TrendingUp, BarChart3 } from 'lucide-react-native';
import { MoodTracker } from '@/utils/MoodTracker';

const { width: screenWidth } = Dimensions.get('window');

const moodOptions = [
  { value: 1, emoji: '😢', label: 'เศร้ามาก', color: '#e74c3c' },
  { value: 2, emoji: '😔', label: 'เศร้า', color: '#f39c12' },
  { value: 3, emoji: '😐', label: 'ปกติ', color: '#95a5a6' },
  { value: 4, emoji: '😊', label: 'ดี', color: '#2ecc71' },
  { value: 5, emoji: '😁', label: 'ดีมาก', color: '#27ae60' },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      setLoading(true);
      const today = await MoodTracker.getTodayMood();
      const history = await MoodTracker.getMoodHistory(7); // Last 7 days
      setTodayMood(today);
      setMoodHistory(history);
      if (today) {
        setSelectedMood(today.mood);
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
  };

  const saveMood = async () => {
    if (!selectedMood) {
      Alert.alert('⚠️ แจ้งเตือน', 'กรุณาเลือกอารมณ์ของคุณ');
      return;
    }

    try {
      await MoodTracker.logMood(selectedMood, '');
      Alert.alert('✅ สำเร็จ', 'บันทึกอารมณ์เรียบร้อยแล้ว');
      loadMoodData();
    } catch (error) {
      console.error('Error logging mood:', error);
      Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถบันทึกอารมณ์ได้');
    }
  };

  const getMoodEmoji = (moodValue: number) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const getMoodLabel = (moodValue: number) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.label : 'ปกติ';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'เช้านี้คุณรู้สึกอย่างไร?';
    if (hour < 17) return 'บ่ายนี้คุณรู้สึกอย่างไร?';
    return 'เย็นนี้คุณรู้สึกอย่างไร?';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>กำลังโหลด...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💭 ติดตามอารมณ์</Text>
          <Text style={styles.subtitle}>{getGreeting()}</Text>
        </View>

        {/* Today's Mood Status */}
        {todayMood && (
          <View style={styles.todayMoodCard}>
            <View style={styles.todayMoodHeader}>
              <Heart size={20} color="#e74c3c" />
              <Text style={styles.todayMoodTitle}>อารมณ์วันนี้</Text>
            </View>
            <View style={styles.todayMoodContent}>
              <Text style={styles.todayMoodEmoji}>{getMoodEmoji(todayMood.mood)}</Text>
              <Text style={styles.todayMoodLabel}>{getMoodLabel(todayMood.mood)}</Text>
              <Text style={styles.todayMoodTime}>
                บันทึกเมื่อ {new Date(todayMood.timestamp).toLocaleTimeString('th-TH', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Mood Selection */}
        <View style={styles.moodSelectionSection}>
          <Text style={styles.sectionTitle}>
            {todayMood ? '🔄 อัพเดทอารมณ์' : '✨ เลือกอารมณ์ของคุณ'}
          </Text>
          
          <View style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood === mood.value && styles.moodOptionSelected,
                  { borderColor: mood.color }
                ]}
                onPress={() => handleMoodSelect(mood.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, { color: mood.color }]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMood && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveMood}
              activeOpacity={0.8}
            >
              <Plus size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {todayMood ? 'อัพเดทอารมณ์' : 'บันทึกอารมณ์'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mood History */}
        {moodHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.sectionTitle}>📈 ประวัติอารมณ์ 7 วันที่ผ่านมา</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <BarChart3 size={16} color="#667eea" />
                <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.historyContainer}
            >
              {moodHistory.map((entry, index) => (
                <View key={index} style={styles.historyCard}>
                  <Text style={styles.historyEmoji}>{getMoodEmoji(entry.mood)}</Text>
                  <Text style={styles.historyLabel}>{getMoodLabel(entry.mood)}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(entry.timestamp).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 เคล็ดลับการดูแลจิตใจ</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🧘‍♀️ การทำสมาธิ</Text>
            <Text style={styles.tipDescription}>
              ใช้เวลา 5-10 นาทีในการหายใจลึกๆ และสังเกตลมหายใจของคุณ
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🚶‍♂️ การออกกำลังกาย</Text>
            <Text style={styles.tipDescription}>
              เดินหรือออกกำลังกายเบาๆ จะช่วยปรับปรุงอารมณ์ได้
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>📱 ลดการใช้โซเชียลมีเดีย</Text>
            <Text style={styles.tipDescription}>
              จำกัดเวลาการใช้โซเชียลมีเดียเพื่อความสุขทางจิตใจ
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  todayMoodCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  todayMoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayMoodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  todayMoodContent: {
    alignItems: 'center',
  },
  todayMoodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  todayMoodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  todayMoodTime: {
    fontSize: 14,
    color: '#64748b',
  },
  moodSelectionSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  moodOption: {
    width: (screenWidth - 64) / 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  moodOptionSelected: {
    borderWidth: 3,
    backgroundColor: '#f8fafc',
    transform: [{ scale: 1.02 }],
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  historySection: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  historySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  viewAllText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
    marginLeft: 4,
  },
  historyContainer: {
    paddingRight: 20,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  historyEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  historyLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 9,
    color: '#94a3b8',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 20,
  },
});
