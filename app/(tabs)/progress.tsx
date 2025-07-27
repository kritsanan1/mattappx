import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart, PieChart as RNPieChart, ProgressChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#667eea',
  backgroundGradientFrom: '#667eea',
  backgroundGradientTo: '#764ba2',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const moodData = {
  labels: ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'],
  datasets: [
    {
      data: [3.5, 4.2, 3.8, 4.5, 4.0, 3.2, 4.8],
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const activityData = {
  labels: ['ออกกำลังกาย', 'สมาดิ', 'อ่านหนังสือ', 'เขียนบันทึก'],
  datasets: [
    {
      data: [4, 6, 3, 7],
    },
  ],
};

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const renderOverviewTab = () => (
    <View>
      <Text>Overview Tab Content</Text>
    </View>
  );

  const renderMoodTab = () => (
    <View>
      <Text>Mood Tab Content</Text>
    </View>
  );

  const renderAchievementsTab = () => (
    <View>
      <Text>Achievements Tab Content</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <Text style={styles.title}>ความคืบหน้า</Text>
          <Text style={styles.subtitle}>ติดตามพัฒนาการของคุณ</Text>
        </LinearGradient>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              ภาพรวม
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'mood' && styles.activeTab]}
            onPress={() => setSelectedTab('mood')}
          >
            <Text style={[styles.tabText, selectedTab === 'mood' && styles.activeTabText]}>
              อารมณ์
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
              รางวัล
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'mood' && renderMoodTab()}
          {selectedTab === 'achievements' && renderAchievementsTab()}

          <View style={styles.statsOverview}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>วันต่อเนื่อง</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.2</Text>
              <Text style={styles.statLabel}>อารมณ์เฉลี่ย</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>เป้าหมาย</Text>
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>แนวโน้มอารมณ์ (7 วันล่าสุด)</Text>
            <LineChart
              data={moodData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>กิจกรรมสัปดาห์นี้</Text>
            <BarChart
              data={activityData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              style={styles.chart}
            />
          </View>

          <View style={styles.achievements}>
            <Text style={styles.sectionTitle}>ความสำเร็จ</Text>
            <View style={styles.achievementList}>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>🎯</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>นักสู้ 7 วัน</Text>
                  <Text style={styles.achievementDesc}>บันทึกอารมณ์ต่อเนื่อง 7 วัน</Text>
                </View>
              </View>
              <View style={styles.achievementItem}>
                <Text style={styles.achievementEmoji}>📝</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>นักเขียน</Text>
                  <Text style={styles.achievementDesc}>เขียนบันทึกครบ 10 ครั้ง</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.goals}>
            <Text style={styles.sectionTitle}>เป้าหมายสัปดาห์นี้</Text>
            <View style={styles.goalsList}>
              <View style={styles.goalItem}>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressBar, { width: '85%' }]} />
                </View>
                <Text style={styles.goalText}>บันทึกอารมณ์ทุกวัน (6/7)</Text>
              </View>
              <View style={styles.goalItem}>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressBar, { width: '60%' }]} />
                </View>
                <Text style={styles.goalText}>ออกกำลังกาย 3 ครั้ง (2/3)</Text>
              </View>
            </View>
          </View>
        </View>
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
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'NotoSansThai_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'NotoSansThai_400Regular',
  },
  content: {
    padding: 20,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    fontFamily: 'NotoSansThai_700Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    fontFamily: 'NotoSansThai_400Regular',
  },
  chartSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'NotoSansThai_500Medium',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  achievements: {
    marginBottom: 30,
  },
  achievementList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_500Medium',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
    fontFamily: 'NotoSansThai_400Regular',
  },
  goals: {
    marginBottom: 20,
  },
  goalsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_400Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#667eea',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_500Medium',
  },
  activeTabText: {
    color: 'white',
  },
});