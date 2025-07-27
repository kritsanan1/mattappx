import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Settings, Bell, Shield, Moon, Download, Trash2, Lock, Eye, Database, HelpCircle } from 'lucide-react-native';
import { DataManager } from '@/utils/DataManager';
import { router } from 'expo-router';

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
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      'ส่งออกข้อมูล',
      'คุณต้องการส่งออกข้อมูลทั้งหมดของคุณหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ส่งออก', 
          onPress: async () => {
            try {
              await DataManager.exportAllData();
              Alert.alert('สำเร็จ', 'ส่งออกข้อมูลเรียบร้อยแล้ว');
            } catch (error) {
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถส่งออกข้อมูลได้');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'ลบข้อมูลทั้งหมด',
      'การดำเนินการนี้จะลบข้อมูลทั้งหมดอย่างถาวร และไม่สามารถกู้คืนได้ คุณแน่ใจหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ลบทั้งหมด', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'ยืนยันการลบ',
              'กรุณายืนยันอีกครั้ง - การดำเนินการนี้ไม่สามารถยกเลิกได้',
              [
                { text: 'ยกเลิก', style: 'cancel' },
                { 
                  text: 'ลบแน่นอน', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await DataManager.deleteAllUserData();
                      Alert.alert('สำเร็จ', 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
                    } catch (error) {
                      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้');
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
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon, 
    label, 
    description, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: React.ReactNode;
    label: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        {icon}
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#e0e0e0', true: Colors.light.tint + '50' }}
          thumbColor={value ? Colors.light.tint : '#f4f3f4'}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>การตั้งค่า</Text>

      {/* Notification Settings */}
      <SettingSection title="การแจ้งเตือน">
        <SettingItem
          icon={<Bell size={24} color={Colors.light.tint} />}
          label="การแจ้งเตือนทั่วไป"
          description="เปิด/ปิดการแจ้งเตือนทั้งหมด"
          value={settings.notifications}
          onValueChange={(value) => updateSetting('notifications', value)}
        />

        <SettingItem
          icon={<Bell size={24} color={Colors.light.tint} />}
          label="การแจ้งเตือนรายวัน"
          description="แจ้งเตือนให้บันทึกอารมณ์และความรู้สึก"
          value={settings.dailyReminders}
          onValueChange={(value) => updateSetting('dailyReminders', value)}
        />

        <SettingItem
          icon={<Bell size={24} color={Colors.light.tint} />}
          label="รายงานสรุปรายสัปดาห์"
          description="ส่งสรุปความคืบหน้าทุกสัปดาห์"
          value={settings.weeklyReports}
          onValueChange={(value) => updateSetting('weeklyReports', value)}
        />
      </SettingSection>

      {/* Privacy & Security */}
      <SettingSection title="ความเป็นส่วนตัวและความปลอดภัย">
        <SettingItem
          icon={<Shield size={24} color={Colors.light.tint} />}
          label="โหมดส่วนตัว"
          description="เข้ารหัสข้อมูลส่วนตัวเพิ่มเติม"
          value={settings.privacy}
          onValueChange={(value) => updateSetting('privacy', value)}
        />

        <SettingItem
          icon={<Eye size={24} color={Colors.light.tint} />}
          label="โหมดไม่ระบุตัวตน"
          description="ซ่อนข้อมูลส่วนตัวในฟีเจอร์ชุมชน"
          value={settings.anonymousMode}
          onValueChange={(value) => updateSetting('anonymousMode', value)}
        />

        <SettingItem
          icon={<Lock size={24} color={Colors.light.tint} />}
          label="การยืนยันตัวตนด้วยลายนิ้วมือ"
          description="ใช้ลายนิ้วมือหรือ Face ID เพื่อเข้าแอป"
          value={settings.biometricAuth}
          onValueChange={(value) => updateSetting('biometricAuth', value)}
        />

        <SettingItem
          icon={<Database size={24} color={Colors.light.tint} />}
          label="การแชร์ข้อมูลเพื่อการวิจัย"
          description="แชร์ข้อมูลแบบไม่ระบุตัวตนเพื่อการพัฒนาแอป"
          value={settings.dataSharing}
          onValueChange={(value) => updateSetting('dataSharing', value)}
        />
      </SettingSection>

      {/* Appearance */}
      <SettingSection title="การแสดงผล">
        <SettingItem
          icon={<Moon size={24} color={Colors.light.tint} />}
          label="โหมดมืด"
          description="เปลี่ยนเป็นธีมสีเข้ม"
          value={settings.darkMode}
          onValueChange={(value) => updateSetting('darkMode', value)}
        />
      </SettingSection>

      {/* Data Management */}
      <SettingSection title="การจัดการข้อมูล">
        <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
          <Download size={24} color={Colors.light.tint} />
          <View style={styles.actionButtonText}>
            <Text style={styles.actionButtonLabel}>ส่งออกข้อมูล</Text>
            <Text style={styles.actionButtonDescription}>
              ดาวน์โหลดข้อมูลทั้งหมดในรูปแบบ JSON
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleDeleteAllData}>
          <Trash2 size={24} color="#e74c3c" />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonLabel, styles.dangerText]}>ลบข้อมูลทั้งหมด</Text>
            <Text style={styles.actionButtonDescription}>
              ลบข้อมูลทั้งหมดอย่างถาวร (ไม่สามารถกู้คืนได้)
            </Text>
          </View>
        </TouchableOpacity>
      </SettingSection>

      {/* Emergency Support */}
      <SettingSection title="ความช่วยเหลือ">
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={openEmergencySupport}>
          <HelpCircle size={24} color="white" />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonLabel, { color: 'white' }]}>ความช่วยเหลือฉุกเฉิน</Text>
            <Text style={[styles.actionButtonDescription, { color: 'white', opacity: 0.9 }]}>
              เข้าถึงสายด่วนและทรัพยากรช่วยเหลือ
            </Text>
          </View>
        </TouchableOpacity>
      </SettingSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ข้อมูลของคุณถูกเก็บไว้ในอุปกรณ์และเข้ารหัสเพื่อความปลอดภัย
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 18,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#e74c3c20',
  },
  dangerText: {
    color: '#e74c3c',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
  },
  footer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text + '80',
    textAlign: 'center',
    lineHeight: 20,
  },
});