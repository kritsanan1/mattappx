import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Bell, Shield } from 'lucide-react-native';

interface Notifications {
  dailyMotivation: boolean;
  cravingReminders: boolean;
  milestoneAlerts: boolean;
}

interface Privacy {
  anonymousMode: boolean;
  dataSharing: boolean;
}

interface ProfileSettingsProps {
  notifications: Notifications;
  privacy: Privacy;
  onNotificationChange: (key: keyof Notifications, value: boolean) => void;
  onPrivacyChange: (key: keyof Privacy, value: boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ notifications, privacy, onNotificationChange, onPrivacyChange }) => {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>การแจ้งเตือน</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}><Bell size={20} color="#FF9800" /><Text style={styles.settingLabel}>แรงจูงใจรายวัน</Text></View>
          <Switch value={notifications.dailyMotivation} onValueChange={(v) => onNotificationChange('dailyMotivation', v)} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFFFFF" />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}><Bell size={20} color="#FF9800" /><Text style={styles.settingLabel}>เตือนความอยาก</Text></View>
          <Switch value={notifications.cravingReminders} onValueChange={(v) => onNotificationChange('cravingReminders', v)} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFFFFF" />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}><Bell size={20} color="#FF9800" /><Text style={styles.settingLabel}>การแจ้งเตือนความสำเร็จ</Text></View>
          <Switch value={notifications.milestoneAlerts} onValueChange={(v) => onNotificationChange('milestoneAlerts', v)} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFFFFF" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ความเป็นส่วนตัว</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}><Shield size={20} color="#2196F3" /><Text style={styles.settingLabel}>โหมดไม่ระบุตัวตน</Text></View>
          <Switch value={privacy.anonymousMode} onValueChange={(v) => onPrivacyChange('anonymousMode', v)} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFFFFF" />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}><Shield size={20} color="#2196F3" /><Text style={styles.settingLabel}>แบ่งปันข้อมูลเพื่อการวิจัย</Text></View>
          <Switch value={privacy.dataSharing} onValueChange={(v) => onPrivacyChange('dataSharing', v)} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFFFFF" />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileSettings;