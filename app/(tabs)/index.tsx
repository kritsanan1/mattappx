
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Text style={styles.welcomeText}>สวัสดี!</Text>
          <Text style={styles.subtitleText}>วันนี้คุณรู้สึกอย่างไร?</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>การดำเนินการด่วน</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="heart" size={30} color="#e74c3c" />
                <Text style={styles.actionText}>บันทึกอารมณ์</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="book" size={30} color="#3498db" />
                <Text style={styles.actionText}>บันทึกประจำวัน</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="fitness" size={30} color="#2ecc71" />
                <Text style={styles.actionText}>กิจกรรม</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="people" size={30} color="#f39c12" />
                <Text style={styles.actionText}>ชุมชน</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.todayStats}>
            <Text style={styles.sectionTitle}>สถิติวันนี้</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>วันต่อเนื่อง</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>เป้าหมาย</Text>
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
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'NotoSansThai_700Bold',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'NotoSansThai_400Regular',
  },
  content: {
    padding: 20,
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'NotoSansThai_500Medium',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    fontFamily: 'NotoSansThai_500Medium',
  },
  todayStats: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
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
    fontSize: 32,
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
});
