import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Save, CreditCard as Edit2 } from 'lucide-react-native';

interface ProfileHeaderProps {
  name: string;
  goalsCount: number;
  soberDays: number;
  moneySaved: number;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  goalsCount,
  soberDays,
  moneySaved,
  isEditing,
  onEditToggle,
}) => {
  return (
    <LinearGradient
      colors={['#4CAF50', '#66BB6A']}
      style={styles.header}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={32} color="white" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {name || 'ผู้ใช้งาน'}
          </Text>
          <Text style={styles.profileSubtitle}>
            การฟื้นฟูของคุณ
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditToggle}
        >
          {isEditing ? (
            <Save size={24} color="white" />
          ) : (
            <Edit2 size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{soberDays}</Text>
          <Text style={styles.statLabel}>วันที่สะอาด</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>฿{moneySaved.toLocaleString()}</Text>
          <Text style={styles.statLabel}>เงินประหยัด</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{goalsCount}</Text>
          <Text style={styles.statLabel}>เป้าหมาย</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
});

export default ProfileHeader;