import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Home, TrendingUp, Heart, Brain, Target, Calendar, Award, Zap } from 'lucide-react-native';
import { DataManager } from '@/utils/DataManager';
import { MoodTracker } from '@/utils/MoodTracker';
import { GamificationManager } from '@/utils/GamificationManager';
import { AIInsightsManager } from '@/utils/AIInsightsManager';

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [todayInsight, setTodayInsight] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await DataManager.getUserProfile();
      const mood = await MoodTracker.getTodayMood();
      const gamification = GamificationManager.getInstance();
      const currentStreak = await gamification.getCurrentStreak();
      const longestStreak = await gamification.getLongestStreak();
      const userAchievements = await gamification.getUserAchievements();
      const insights = AIInsightsManager.getInstance();
      const dailyInsight = await insights.getDailyInsight();

      setUserData(user);
      setTodayMood(mood);
      setStreakData({ current: currentStreak, longest: longestStreak });
      setAchievements(userAchievements.slice(0, 3)); // Show latest 3
      setTodayInsight(dailyInsight);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const quickMoodEntry = async () => {
    try {
      const mood = await MoodTracker.quickMoodEntry();
      setTodayMood(mood);
      Alert.alert('สำเร็จ', 'บันทึกอารมณ์เรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกอารมณ์ได้');
    }
  };

  const getDaysClean = () => {
    if (!userData?.soberStartDate) return 0;
    const start = new Date(userData.soberStartDate);
    const today = new Date();
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>สวัสดี{userData?.name ? ` ${userData.name}` : ''}! 👋</Text>
        <Text style={styles.subtitle}>วันนี้เป็นอย่างไรบ้าง</Text>
      </View>

      {/* Main Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Calendar size={28} color="#fff" />
          <Text style={styles.primaryStatNumber}>{getDaysClean()}</Text>
          <Text style={styles.primaryStatLabel}>วันที่สะอาด</Text>
        </View>

        <View style={styles.miniStatsContainer}>
          <View style={styles.miniStatCard}>
            <Zap size={20} color="#667eea" />
            <Text style={styles.miniStatNumber}>{streakData.current}</Text>
            <Text style={styles.miniStatLabel}>ต่อเนื่อง</Text>
          </View>

          <View style={styles.miniStatCard}>
            <Award size={20} color="#f39c12" />
            <Text style={styles.miniStatNumber}>{achievements.length}</Text>
            <Text style={styles.miniStatLabel}>รางวัล</Text>
          </View>
        </View>
      </View>

      {/* Today's Insight */}
      {todayInsight && (
        <View style={styles.insightCard}>
          <Brain size={24} color="#667eea" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>ข้อมูลเชิงลึกวันนี้</Text>
            <Text style={styles.insightText}>{todayInsight}</Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>การดำเนินการด่วน</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={quickMoodEntry}>
            <Heart size={24} color={todayMood ? "#27ae60" : "#667eea"} />
            <Text style={styles.actionText}>
              {todayMood ? "อัพเดทอารมณ์" : "บันทึกอารมณ์"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Target size={24} color="#667eea" />
            <Text style={styles.actionText}>เป้าหมายวันนี้</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <TrendingUp size={24} color="#667eea" />
            <Text style={styles.actionText}>ดูความคืบหน้า</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Brain size={24} color="#667eea" />
            <Text style={styles.actionText}>ข้อมูลเชิงลึก</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>รางวัลล่าสุด</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
              </View>
            ))}
          </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryCard: {
    flex: 2,
    backgroundColor: Colors.light.tint,
    padding: 24,
    marginRight: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryStatNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryStatLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  miniStatsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  miniStatCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  miniStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginTop: 4,
  },
  miniStatLabel: {
    fontSize: 12,
    color: Colors.light.text + '80',
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 20,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: 'white',
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});