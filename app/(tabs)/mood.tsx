
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const moodOptions = [
  { id: 1, emoji: '😄', label: 'ดีมาก', color: '#2ecc71' },
  { id: 2, emoji: '😊', label: 'ดี', color: '#27ae60' },
  { id: 3, emoji: '😐', label: 'ปกติ', color: '#f39c12' },
  { id: 4, emoji: '😔', label: 'เศร้า', color: '#e67e22' },
  { id: 5, emoji: '😢', label: 'เศร้ามาก', color: '#e74c3c' },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>บันทึกอารมณ์วันนี้</Text>
          <Text style={styles.subtitle}>เลือกอารมณ์ที่สื่อถึงความรู้สึกของคุณมากที่สุด</Text>
        </View>

        <View style={styles.moodSelector}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                selectedMood === mood.id && { backgroundColor: mood.color + '20', borderColor: mood.color }
              ]}
              onPress={() => handleMoodSelect(mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && (
          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>เพิ่มรายละเอียด (ไม่บังคับ)</Text>
            <TouchableOpacity style={styles.noteInput}>
              <Text style={styles.notePlaceholder}>แตะเพื่อเขียนบันทึก...</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.recentMoods}>
          <Text style={styles.sectionTitle}>อารมณ์ล่าสุด</Text>
          <View style={styles.moodHistory}>
            <View style={styles.moodHistoryItem}>
              <Text style={styles.historyEmoji}>😊</Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyLabel}>ดี</Text>
                <Text style={styles.historyDate}>เมื่อวาน 18:30</Text>
              </View>
            </View>
            <View style={styles.moodHistoryItem}>
              <Text style={styles.historyEmoji}>😐</Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyLabel}>ปกติ</Text>
                <Text style={styles.historyDate}>2 วันก่อน 14:15</Text>
              </View>
            </View>
          </View>
        </View>

        {selectedMood && (
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.saveButtonText}>บันทึกอารมณ์</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontFamily: 'NotoSansThai_400Regular',
  },
  moodSelector: {
    padding: 20,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_500Medium',
  },
  noteSection: {
    padding: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'NotoSansThai_500Medium',
  },
  noteInput: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notePlaceholder: {
    color: '#bdc3c7',
    fontSize: 16,
    fontFamily: 'NotoSansThai_400Regular',
  },
  recentMoods: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'NotoSansThai_500Medium',
  },
  moodHistory: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  moodHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  historyInfo: {
    flex: 1,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_500Medium',
  },
  historyDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
    fontFamily: 'NotoSansThai_400Regular',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'NotoSansThai_700Bold',
  },
});
