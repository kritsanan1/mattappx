import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { DataManager } from '@/utils/DataManager';

import ProfileHeader from '../../src/components/profile/ProfileHeader';
import ProfileForm from '../../src/components/profile/ProfileForm';
import ProfileGoals from '../../src/components/profile/ProfileGoals';
import ProfileSettings from '../../src/components/profile/ProfileSettings';
import ProfileDataManagement from '../../src/components/profile/ProfileDataManagement';
import AboutCard from '../../src/components/profile/AboutCard';

interface UserProfile {
  name: string;
  soberStartDate: string;
  dailyExpense: number;
  goals: string[];
  notifications: {
    dailyMotivation: boolean;
    cravingReminders: boolean;
    milestoneAlerts: boolean;
  };
  privacy: {
    anonymousMode: boolean;
    dataSharing: boolean;
  };
}

const initialProfileState: UserProfile = {
  name: '',
  soberStartDate: '',
  dailyExpense: 200,
  goals: [],
  notifications: { dailyMotivation: true, cravingReminders: true, milestoneAlerts: true },
  privacy: { anonymousMode: true, dataSharing: false },
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(initialProfileState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await DataManager.getUserData();
      setProfile({ ...initialProfileState, ...userData });
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
    }
  };

  const saveProfile = async () => {
    try {
      await DataManager.updateUserData(profile);
      setIsEditing(false);
      Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleProfileChange = useCallback((field: keyof UserProfile, value: any) => {
    setProfile(p => ({ ...p, [field]: value }));
  }, []);

  const handleNotificationChange = useCallback((key: keyof UserProfile['notifications'], value: boolean) => {
    setProfile(p => ({ ...p, notifications: { ...p.notifications, [key]: value } }));
  }, []);

  const handlePrivacyChange = useCallback((key: keyof UserProfile['privacy'], value: boolean) => {
    setProfile(p => ({ ...p, privacy: { ...p.privacy, [key]: value } }));
  }, []);

  const handleAddGoal = useCallback((goal: string) => {
    setProfile(p => ({ ...p, goals: [...p.goals, goal] }));
  }, []);

  const handleRemoveGoal = useCallback((index: number) => {
    setProfile(p => ({ ...p, goals: p.goals.filter((_, i) => i !== index) }));
  }, []);

  const handleDeleteAllData = () => {
    Alert.alert(
      'ลบข้อมูลทั้งหมด',
      'คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {
              await DataManager.clearAllData();
              setProfile(initialProfileState);
              Alert.alert('สำเร็จ', 'ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
            } catch (error) {
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้');
            }
          },
        },
      ]
    );
  };

  const calculateSoberDays = () => {
    if (!profile.soberStartDate) return 0;
    return Math.floor((new Date().getTime() - new Date(profile.soberStartDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateMoneySaved = () => calculateSoberDays() * profile.dailyExpense;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          name={profile.name}
          goalsCount={profile.goals.length}
          soberDays={calculateSoberDays()}
          moneySaved={calculateMoneySaved()}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
        />

        <ProfileForm
          name={profile.name}
          soberStartDate={profile.soberStartDate}
          dailyExpense={profile.dailyExpense}
          isEditing={isEditing}
          onProfileChange={handleProfileChange}
          saveProfile={saveProfile}
        />

        <ProfileGoals
          goals={profile.goals}
          isEditing={isEditing}
          onAddGoal={handleAddGoal}
          onRemoveGoal={handleRemoveGoal}
        />

        <ProfileSettings
          notifications={profile.notifications}
          privacy={profile.privacy}
          onNotificationChange={handleNotificationChange}
          onPrivacyChange={handlePrivacyChange}
        />

        <ProfileDataManagement onDeleteAllData={handleDeleteAllData} />

        <AboutCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});