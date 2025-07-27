
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Home, TrendingUp, Heart, Brain, Target, Calendar, Award, Zap, Plus } from 'lucide-react-native';
import { DataManager } from '@/utils/DataManager';
import { MoodTracker } from '@/utils/MoodTracker';
import { GamificationManager } from '@/utils/GamificationManager';
import { AIInsightsManager } from '@/utils/AIInsightsManager';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [todayInsight, setTodayInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
      setAchievements(userAchievements.slice(0, 3));
      setTodayInsight(dailyInsight);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickMoodEntry = async () => {
    try {
      const mood = await MoodTracker.quickMoodEntry();
      setTodayMood(mood);
      Alert.alert('✅ สำเร็จ', 'บันทึกอารมณ์เรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถบันทึกอารมณ์ได้');
    }
  };

  const getDaysClean = () => {
    if (!userData?.soberStartDate) return 0;
    const start = new Date(userData.soberStartDate);
    const today = new Date();
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{userData?.name || 'เพื่อน'} 👋</Text>
          <Text style={styles.motivationText}>วันใหม่ โอกาสใหม่ในการเติบโต</Text>
        </View>

        {/* Main Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Calendar size={24} color="#667eea" />
            <Text style={styles.progressTitle}>เส้นทางการฟื้นตัว</Text>
          </View>
          
          <View style={styles.progressContent}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatNumber}>{getDaysClean()}</Text>
              <Text style={styles.mainStatLabel}>วันที่สะอาด</Text>
            </View>
            
            <View style={styles.subStats}>
              <View style={styles.subStat}>
                <Zap size={18} color="#f39c12" />
                <Text style={styles.subStatNumber}>{streakData.current}</Text>
                <Text style={styles.subStatLabel}>วันต่อเนื่อง</Text>
              </View>
              
              <View style={styles.subStat}>
                <Award size={18} color="#e67e22" />
                <Text style={styles.subStatNumber}>{achievements.length}</Text>
                <Text style={styles.subStatLabel}>รางวัล</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Insight */}
        {todayInsight && (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Brain size={20} color="#667eea" />
              <Text style={styles.insightTitle}>💡 ข้อมูลเชิงลึกวันนี้</Text>
            </View>
            <Text style={styles.insightText}>{todayInsight}</Text>
          </View>
        )}

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>การดำเนินการด่วน</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, todayMood && styles.actionCardCompleted]} 
              onPress={quickMoodEntry}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Heart size={20} color={todayMood ? "#27ae60" : "#667eea"} />
              </View>
              <Text style={styles.actionTitle}>
                {todayMood ? "อัพเดทอารมณ์" : "บันทึกอารมณ์"}
              </Text>
              <Text style={styles.actionSubtitle}>
                {todayMood ? "แก้ไขอารมณ์วันนี้" : "เริ่มต้นวันใหม่"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <Target size={20} color="#667eea" />
              </View>
              <Text style={styles.actionTitle}>เป้าหมายวันนี้</Text>
              <Text style={styles.actionSubtitle}>ตั้งเป้าประจำวัน</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <TrendingUp size={20} color="#667eea" />
              </View>
              <Text style={styles.actionTitle}>ความคืบหน้า</Text>
              <Text style={styles.actionSubtitle}>ดูสถิติของคุณ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <Plus size={20} color="#667eea" />
              </View>
              <Text style={styles.actionTitle}>เพิ่มบันทึก</Text>
              <Text style={styles.actionSubtitle}>บันทึกเหตุการณ์</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>🏆 รางวัลล่าสุด</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsContainer}
            >
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDate}>วันนี้</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

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
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#667eea',
    lineHeight: 56,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 4,
  },
  subStats: {
    flex: 1,
    gap: 16,
  },
  subStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  subStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
    marginRight: 8,
  },
  subStatLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardCompleted: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  achievementsSection: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  achievementsContainer: {
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  bottomSpacing: {
    height: 20,
  },
});
