import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Heart, TrendingUp, Calendar, BarChart3, MessageSquare } from 'lucide-react-native';
import { MoodTracker, MoodEntry } from '@/utils/MoodTracker';
import { LineChart } from 'react-native-chart-kit';

const moodOptions = [
  { emoji: '😊', label: 'ดีมาก', value: 5, color: '#27ae60' },
  { emoji: '🙂', label: 'ดี', value: 4, color: '#2ecc71' },
  { emoji: '😐', label: 'ปกติ', value: 3, color: '#f39c12' },
  { emoji: '😔', label: 'เศร้า', value: 2, color: '#e67e22' },
  { emoji: '😢', label: 'เศร้ามาก', value: 1, color: '#e74c3c' },
];

const triggers = [
  'ความเครียด', 'เหงา', 'ความกังวล', 'ความโกรธ', 'ความเบื่อ',
  'ความเหนื่อยล้า', 'ปัญหาครอบครัว', 'ปัญหาการเงิน', 'ปัญหาการทำงาน', 'อื่นๆ'
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const history = await MoodTracker.getMoodHistory(7); // Last 7 days
      setMoodHistory(history);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('กรุณาเลือกอารมณ์', 'โปรดเลือกอารมณ์ของคุณก่อนบันทึก');
      return;
    }

    try {
      await MoodTracker.logMood(selectedMood, selectedTriggers, notes);
      Alert.alert('สำเร็จ', 'บันทึกอารมณ์เรียบร้อยแล้ว');

      // Reset form
      setSelectedMood(null);
      setSelectedTriggers([]);
      setNotes('');

      // Reload history
      loadMoodHistory();
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกอารมณ์ได้');
    }
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const getChartData = () => {
    const labels = moodHistory.map(entry => 
      new Date(entry.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
    ).reverse();

    const data = moodHistory.map(entry => entry.mood).reverse();

    return {
      labels: labels.length > 0 ? labels : ['วันนี้'],
      datasets: [{
        data: data.length > 0 ? data : [3],
        color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
        strokeWidth: 3,
      }]
    };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>อารมณ์วันนี้</Text>
        <Text style={styles.subtitle}>คุณรู้สึกอย่างไรบ้าง?</Text>
      </View>

      {/* Mood Selector */}
      <View style={styles.moodSelector}>
        {moodOptions.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodOption,
              selectedMood === mood.value && styles.selectedMood,
            ]}
            onPress={() => setSelectedMood(mood.value)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Triggers Selection */}
      {selectedMood && selectedMood <= 3 && (
        <View style={styles.triggersSection}>
          <Text style={styles.sectionTitle}>สิ่งที่ทำให้รู้สึกแบบนี้ (เลือกได้หลายข้อ)</Text>
          <View style={styles.triggersContainer}>
            {triggers.map((trigger) => (
              <TouchableOpacity
                key={trigger}
                style={[
                  styles.triggerChip,
                  selectedTriggers.includes(trigger) && styles.selectedTrigger
                ]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text style={[
                  styles.triggerText,
                  selectedTriggers.includes(trigger) && styles.selectedTriggerText
                ]}>
                  {trigger}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Notes Section */}
      {selectedMood && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>บันทึกเพิ่มเติม (ไม่บังคับ)</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            placeholder="เขียนความรู้สึกหรือเหตุการณ์ที่เกิดขึ้นวันนี้..."
            placeholderTextColor={Colors.light.text + '60'}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      )}

      {/* Save Button */}
      {selectedMood && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMood}>
          <Heart size={20} color="white" />
          <Text style={styles.saveButtonText}>บันทึกอารมณ์</Text>
        </TouchableOpacity>
      )}

      {/* Chart Toggle */}
      <View style={styles.chartSection}>
        <TouchableOpacity 
          style={styles.chartToggle}
          onPress={() => setShowChart(!showChart)}
        >
          <BarChart3 size={20} color={Colors.light.tint} />
          <Text style={styles.chartToggleText}>
            {showChart ? 'ซ่อนกราف' : 'ดูแนวโน้มอารมณ์'}
          </Text>
        </TouchableOpacity>

        {showChart && moodHistory.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>แนวโน้มอารมณ์ 7 วันที่ผ่านมา</Text>
            <LineChart
              data={getChartData()}
              width={320}
              height={200}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: Colors.light.tint
                }
              }}
              style={styles.chart}
            />
          </View>
        )}
      </View>

      {/* Recent History */}
      {moodHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>ประวัติล่าสุด</Text>
          {moodHistory.slice(0, 3).map((entry, index) => {
            const mood = moodOptions.find(m => m.value === entry.mood);
            return (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                <View style={styles.historyContent}>
                  <Text style={styles.historyMood}>{mood?.label}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(entry.date).toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  {entry.notes && (
                    <Text style={styles.historyNotes} numberOfLines={2}>
                      {entry.notes}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text + '80',
  },
  moodSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedMood: {
    backgroundColor: Colors.light.tint,
    transform: [{ scale: 1.02 }],
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  moodLabel: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: '500',
  },
  triggersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  triggerChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTrigger: {
    backgroundColor: Colors.light.tint,
  },
  triggerText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  selectedTriggerText: {
    color: 'white',
  },
  notesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartToggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.light.text + '80',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 18,
  },
});