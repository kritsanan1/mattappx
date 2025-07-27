
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Settings, Bell, Shield, Moon, Download, Trash2, Lock, Eye, Database, HelpCircle, ChevronRight } from 'lucide-react-native';
import { DataManager } from '@/utils/DataManager';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface SettingsState {
  notifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  emergencyAlerts: boolean;
  privacy: boolean;
  anonymousMode: boolean;
  dataSharing: boolean;
  darkMode: boolean;
  biometricAuth: boolean;
}

export function ProfileSettings() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    dailyReminders: true,
    weeklyReports: false,
    emergencyAlerts: true,
    privacy: true,
    anonymousMode: false,
    dataSharing: false,
    darkMode: false,
    biometricAuth: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await DataManager.getAppSettings();
      if (savedSettings) {
        setSettings({ ...settings, ...savedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: keyof SettingsState, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await DataManager.updateAppSettings(newSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      '📤 ส่งออกข้อมูล',
      'คุณต้องการส่งออกข้อมูลทั้งหมดของคุณหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ส่งออก', 
          onPress: async () => {
            try {
              await DataManager.exportAllData();
              Alert.alert('✅ สำเร็จ', 'ส่งออกข้อมูลเรียบร้อยแล้ว');
            } catch (error) {
              Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถส่งออกข้อมูลได้');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      '🗑️ ลบข้อมูลทั้งหมด',
      'การดำเนินการนี้จะลบข้อมูลทั้งหมดอย่างถาวร และไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ลบทั้งหมด', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '⚠️ ยืนยันการลบ',
              'กรุณายืนยันอีกครั้ง - การดำเนินการนี้ไม่สามารถยกเลิกได้',
              [
                { text: 'ยกเลิก', style: 'cancel' },
                { 
                  text: 'ลบแน่นอน', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await DataManager.deleteAllUserData();
                      Alert.alert('✅ สำเร็จ', 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
                    } catch (error) {
                      Alert.alert('⚠️ ข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const openEmergencySupport = () => {
    router.push('/modal');
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    label, 
    description, 
    value, 
    onValueChange, 
    type = 'switch',
    danger = false 
  }: {
    icon: React.ReactNode;
    label: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
    danger?: boolean;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={[styles.iconContainer, danger && styles.dangerIconContainer]}>
          {icon}
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#e2e8f0', true: '#667eea40' }}
          thumbColor={value ? '#667eea' : '#f1f5f9'}
          ios_backgroundColor="#e2e8f0"
        />
      )}
      {type === 'button' && (
        <ChevronRight size={20} color="#94a3b8" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ การตั้งค่า</Text>
          <Text style={styles.subtitle}>จัดการการตั้งค่าและความเป็นส่วนตัว</Text>
        </View>

        {/* Notification Settings */}
        <SettingSection title="🔔 การแจ้งเตือน">
          <SettingItem
            icon={<Bell size={20} color="#667eea" />}
            label="การแจ้งเตือนทั่วไป"
            description="เปิด/ปิดการแจ้งเตือนทั้งหมด"
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
          />

          <SettingItem
            icon={<Bell size={20} color="#f39c12" />}
            label="การแจ้งเตือนรายวัน"
            description="แจ้งเตือนให้บันทึกอารมณ์และความรู้สึก"
            value={settings.dailyReminders}
            onValueChange={(value) => updateSetting('dailyReminders', value)}
          />

          <SettingItem
            icon={<Bell size={20} color="#2ecc71" />}
            label="รายงานสรุปรายสัปดาห์"
            description="ส่งสรุปความคืบหน้าทุกสัปดาห์"
            value={settings.weeklyReports}
            onValueChange={(value) => updateSetting('weeklyReports', value)}
          />
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection title="🔒 ความเป็นส่วนตัวและความปลอดภัย">
          <SettingItem
            icon={<Shield size={20} color="#667eea" />}
            label="โหมดส่วนตัว"
            description="เข้ารหัสข้อมูลส่วนตัวเพิ่มเติม"
            value={settings.privacy}
            onValueChange={(value) => updateSetting('privacy', value)}
          />

          <SettingItem
            icon={<Eye size={20} color="#9b59b6" />}
            label="โหมดไม่ระบุตัวตน"
            description="ซ่อนข้อมูลส่วนตัวในฟีเจอร์ชุมชน"
            value={settings.anonymousMode}
            onValueChange={(value) => updateSetting('anonymousMode', value)}
          />

          <SettingItem
            icon={<Lock size={20} color="#e67e22" />}
            label="การยืนยันตัวตนด้วยลายนิ้วมือ"
            description="ใช้ลายนิ้วมือหรือ Face ID เพื่อเข้าแอป"
            value={settings.biometricAuth}
            onValueChange={(value) => updateSetting('biometricAuth', value)}
          />

          <SettingItem
            icon={<Database size={20} color="#34495e" />}
            label="การแชร์ข้อมูลเพื่อการวิจัย"
            description="แชร์ข้อมูลแบบไม่ระบุตัวตนเพื่อการพัฒนาแอป"
            value={settings.dataSharing}
            onValueChange={(value) => updateSetting('dataSharing', value)}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="🎨 การแสดงผล">
          <SettingItem
            icon={<Moon size={20} color="#2c3e50" />}
            label="โหมดมืด"
            description="เปลี่ยนเป็นธีมสีเข้ม (เร็วๆ นี้)"
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="📊 การจัดการข้อมูล">
          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <SettingItem
              icon={<Download size={20} color="#2ecc71" />}
              label="ส่งออกข้อมูล"
              description="ดาวน์โหลดข้อมูลทั้งหมดในรูปแบบ JSON"
              type="button"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleDeleteAllData}>
            <SettingItem
              icon={<Trash2 size={20} color="#e74c3c" />}
              label="ลบข้อมูลทั้งหมด"
              description="ลบข้อมูลทั้งหมดอย่างถาวร (ไม่สามารถกู้คืนได้)"
              type="button"
              danger={true}
            />
          </TouchableOpacity>
        </SettingSection>

        {/* Emergency Support */}
        <View style={styles.emergencySection}>
          <TouchableOpacity style={styles.emergencyButton} onPress={openEmergencySupport}>
            <HelpCircle size={24} color="white" />
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>🆘 ความช่วยเหลือฉุกเฉิน</Text>
              <Text style={styles.emergencyDescription}>
                เข้าถึงสายด่วนและทรัพยากรช่วยเหลือ
              </Text>
            </View>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔐 ข้อมูลของคุณถูกเก็บไว้ในอุปกรณ์และเข้ารหัสเพื่อความปลอดภัย
          </Text>
          <Text style={styles.footerVersion}>เวอร์ชัน 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: '#fef2f2',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  dangerText: {
    color: '#e74c3c',
  },
  actionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  emergencySection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 13,
    color: 'white',
    opacity: 0.9,
    lineHeight: 18,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  footerVersion: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
