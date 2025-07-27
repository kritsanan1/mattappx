import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Trophy, 
  Heart, 
  DollarSign, 
  Clock,
  Target,
  MessageCircle,
  BookOpen
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DataManager, Craving } from '@/utils/DataManager'; // Import Craving interface
import { AIInsightsManager } from '@/utils/AIInsightsManager';
import { MoodTracker } from '@/utils/MoodTracker';
import { GamificationManager } from '@/utils/GamificationManager';

export default function HomeScreen() {
  const router = useRouter();
  const [soberDays, setSoberDays] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [userGoals, setUserGoals] = useState<string[]>([]); // Corrected type to string[]
  const [lastCraving, setLastCraving] = useState<Craving | null>(null); // Corrected type to Craving | null
  const [todayMood, setTodayMood] = useState<string>('');
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadUserData();
    loadAdditionalData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await DataManager.getUserData();
      if (userData.soberStartDate) {
        const days = Math.floor(
          (new Date().getTime() - new Date(userData.soberStartDate).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        setSoberDays(days);
        setMoneySaved(days * (userData.dailyExpense || 200)); // Default 200 THB/day
      }
      setUserGoals(userData.goals || []);
      
      const recentCravings = await DataManager.getCravings();
      if (recentCravings.length > 0) {
        setLastCraving(recentCravings[0]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadAdditionalData = async () => {
    try {
      // Load mood data
      const moodEntries = await MoodTracker.getMoodEntries();
      const todayEntries = moodEntries.filter(entry => {
        const today = new Date();
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === today.toDateString();
      });
      
      if (todayEntries.length > 0) {
        setTodayMood(MoodTracker.getMoodEmoji(todayEntries[0].mood));
      }

      // Load gamification data
      const progress = await GamificationManager.getUserProgress();
      setUserLevel(progress.level);
      setTotalPoints(progress.totalPoints);

      // Update gamification progress
      const cravings = await DataManager.getCravings();
      await GamificationManager.updateProgress({
        soberDays,
        cravingsLogged: cravings.length,
        communityPosts: 0, // This would come from community data
        moodEntries: moodEntries.length,
        resourcesAccessed: 0 // This would be tracked separately
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getMilestoneData = () => {
    if (soberDays >= 365) return { title: 'เก่งมาก! 1 ปีแล้ว', icon: '🏆', color: '#FFD700' };
    if (soberDays >= 180) return { title: 'ยอดเยี่ยม! 6 เดือน', icon: '🌟', color: '#4CAF50' };
    if (soberDays >= 90) return { title: 'ดีมาก! 3 เดือน', icon: '💪', color: '#2196F3' };
    if (soberDays >= 30) return { title: 'ทำได้ดี! 1 เดือน', icon: '🎯', color: '#FF9800' };
    if (soberDays >= 7) return { title: 'เริ่มต้นดี! 1 สัปดาห์', icon: '🌱', color: '#8BC34A' };
    return { title: 'เริ่มต้นใหม่', icon: '💚', color: '#4CAF50' };
  };

  const milestone = getMilestoneData();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'craving':
        router.push('/tracker');
        break;
      case 'community':
        router.push('/community');
        break;
      case 'resources':
        router.push('/resources');
        break;
      case 'emergency':
        Alert.alert(
          'สายด่วนฉุกเฉิน',
          'โทร 1323 (กรมสุขภาพจิต)\nหรือ 1669 (ฉุกเฉินการแพทย์)',
          [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'โทร 1323', onPress: () => {} },
            { text: 'โทร 1669', onPress: () => {} }
          ]
        );
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Thai Recovery</Text>
          <Text style={styles.headerSubtitle}>การฟื้นฟูของคุณ</Text>
        </LinearGradient>

        {/* Sobriety Counter */}
        <View style={styles.sobrietyCard}>
          <LinearGradient
            colors={[milestone.color, milestone.color + '80']}
            style={styles.milestoneGradient}
          >
            <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <View style={styles.sobrietyCounter}>
              <Text style={styles.soberDays}>{soberDays}</Text>
              <Text style={styles.soberDaysLabel}>วันที่สะอาด</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Progress Cards */}
        <View style={styles.progressGrid}>
          <View style={styles.progressCard}>
            <DollarSign size={24} color="#4CAF50" />
            <Text style={styles.progressValue}>฿{moneySaved.toLocaleString()}</Text>
            <Text style={styles.progressLabel}>เงินที่ประหยัด</Text>
          </View>
          
          <View style={styles.progressCard}>
            <Text style={styles.progressValue}>{todayMood || '😐'}</Text>
            <Text style={styles.progressLabel}>อารมณ์วันนี้</Text>
          </View>
          
          <View style={styles.progressCard}>
            <Trophy size={24} color="#FF9800" />
            <Text style={styles.progressValue}>Lv.{userLevel}</Text>
            <Text style={styles.progressLabel}>{totalPoints} คะแนน</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>การดำเนินการด่วน</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
              onPress={() => handleQuickAction('craving')}
            >
              <Target size={24} color="white" />
              <Text style={styles.actionButtonText}>บันทึกความอยาก</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              onPress={() => router.push('/mood')}
            >
              <Heart size={24} color="white" />
              <Text style={styles.actionButtonText}>บันทึกอารมณ์</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
              onPress={() => router.push('/insights')}
            >
              <Brain size={24} color="white" />
              <Text style={styles.actionButtonText}>AI วิเคราะห์</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
              onPress={() => handleQuickAction('community')}
            >
              <MessageCircle size={24} color="white" />
              <Text style={styles.actionButtonText}>ชุมชนสนับสนุน</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#F44336' }]}
              onPress={() => handleQuickAction('emergency')}
            >
              <Clock size={24} color="white" />
              <Text style={styles.actionButtonText}>สายด่วนฉุกเฉิน</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>เป้าหมายวันนี้</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>💧 ดื่มน้ำ 8 แก้ว</Text>
            <Text style={styles.goalText}>🧘 ทำสมาธิ 10 นาที</Text>
            <Text style={styles.goalText}>🚶 เดิน 30 นาที</Text>
            <Text style={styles.goalText}>📞 โทรหาเพื่อนสนิท</Text>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quote}>
              "ทุกวันที่ผ่านไปคือชัยชนะเล็กๆ ที่นำไปสู่ชัยชนะใหญ่"
            </Text>
            <Text style={styles.quoteAuthor}>- Thai Recovery Community</Text>
          </View>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
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
  sobrietyCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  milestoneGradient: {
    padding: 24,
    alignItems: 'center',
  },
  milestoneIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  sobrietyCounter: {
    alignItems: 'center',
  },
  soberDays: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  soberDaysLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  progressGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  progressCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  quoteCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
});