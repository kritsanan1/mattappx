import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { Phone, MessageCircle, Heart, Shield, ArrowLeft, ExternalLink } from 'lucide-react-native';
import { router } from 'expo-router';

const emergencyContacts = [
  {
    name: 'สายด่วนสุขภาพจิต กรมสุขภาพจิต',
    number: '1323',
    description: 'บริการให้คำปรึกษาด้านสุขภาพจิต 24 ชั่วโมง',
    type: 'hotline'
  },
  {
    name: 'สายด่วนศูนย์ช่วยเหลือสังคม',
    number: '1300',
    description: 'ช่วยเหลือผู้ประสบปัญหาทางสังคม',
    type: 'hotline'
  },
  {
    name: 'มูลนิธิ สาธารณสุขกับการพัฒนา',
    number: '025184680',
    description: 'บริการปรึกษาและช่วยเหลือผู้ติดสารเสพติด',
    type: 'organization'
  }
];

const coping_strategies = [
  {
    title: 'เทคนิคการหายใจลึก',
    description: 'หายใจเข้าทางจมูก 4 วินาที กลั้นใจ 4 วินาที หายใจออกทางปาก 6 วินาที',
    icon: '🫁'
  },
  {
    title: 'เทคนิค 5-4-3-2-1',
    description: 'มองหา 5 สิ่ง ฟัง 4 เสียง สัมผัส 3 สิ่ง ดม 2 กลิ่น ลิ้มรส 1 อย่าง',
    icon: '👁️'
  },
  {
    title: 'การเคลื่อนไหวร่างกาย',
    description: 'เดินเร็ว วิ่ง หรือออกกำลังกายเบาๆ เพื่อปลดปล่อยความเครียด',
    icon: '🏃'
  },
  {
    title: 'การติดต่อคนใกล้ชิด',
    description: 'โทรหาเพื่อน ครอบครัว หรือคนที่คุณไว้ใจเพื่อขอความช่วยเหลือ',
    icon: '🤝'
  }
];

export default function EmergencyModal() {
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'strategies'>('contacts');

  const handleCall = (number: string) => {
    Alert.alert(
      'โทรศัพท์',
      `คุณต้องการโทรไปยัง ${number} หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'โทร', onPress: () => Linking.openURL(`tel:${number}`) }
      ]
    );
  };

  const renderContactsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.emergencyHeader}>
        <Shield size={32} color="#e74c3c" />
        <Text style={styles.emergencyTitle}>ความช่วยเหลือฉุกเฉิน</Text>
        <Text style={styles.emergencySubtitle}>
          หากคุณรู้สึกอันตรายต่อตัวเองหรือคนอื่น โปรดติดต่อหน่วยงานเหล่านี้ทันที
        </Text>
      </View>

      {emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.contactCard}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDescription}>{contact.description}</Text>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall(contact.number)}
          >
            <Phone size={24} color="white" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>⚠️ ข้อสำคัญ</Text>
        <Text style={styles.disclaimerText}>
          หากคุณมีความคิดทำร้ายตัวเอง โปรดติดต่อบริการฉุกเฉินหรือไปโรงพยาบาลทันที
        </Text>
      </View>
    </View>
  );

  const renderStrategiesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.strategiesHeader}>
        <Heart size={32} color={Colors.light.tint} />
        <Text style={styles.strategiesTitle}>เทคนิครับมือความเครียด</Text>
        <Text style={styles.strategiesSubtitle}>
          วิธีการเบื้องต้นที่สามารถช่วยคุณรับมือกับความรู้สึกท่วมท้น
        </Text>
      </View>

      {coping_strategies.map((strategy, index) => (
        <View key={index} style={styles.strategyCard}>
          <Text style={styles.strategyIcon}>{strategy.icon}</Text>
          <View style={styles.strategyContent}>
            <Text style={styles.strategyTitle}>{strategy.title}</Text>
            <Text style={styles.strategyDescription}>{strategy.description}</Text>
          </View>
        </View>
      ))}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>💡 หมายเหตุ</Text>
        <Text style={styles.noteText}>
          เทคนิคเหล่านี้เป็นการช่วยเหลือเบื้องต้น ไม่ใช่การรักษาทางการแพทย์ 
          หากอาการรุนแรงหรือมีความคิดทำร้ายตัวเอง โปรดขอความช่วยเหลือจากผู้เชี่ยวชาญ
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ความช่วยเหลือ</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'contacts' && styles.activeTabButton]}
          onPress={() => setSelectedTab('contacts')}
        >
          <Phone size={20} color={selectedTab === 'contacts' ? Colors.light.tint : Colors.light.text + '80'} />
          <Text style={[styles.tabButtonText, selectedTab === 'contacts' && styles.activeTabButtonText]}>
            ติดต่อฉุกเฉิน
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'strategies' && styles.activeTabButton]}
          onPress={() => setSelectedTab('strategies')}
        >
          <Heart size={20} color={selectedTab === 'strategies' ? Colors.light.tint : Colors.light.text + '80'} />
          <Text style={[styles.tabButtonText, selectedTab === 'strategies' && styles.activeTabButtonText]}>
            เทคนิครับมือ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'contacts' ? renderContactsTab() : renderStrategiesTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.tint,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: '#f8f9fa',
  },
  tabButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text + '80',
  },
  activeTabButtonText: {
    color: Colors.light.tint,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabContent: {
    padding: 20,
  },
  emergencyHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: Colors.light.text + '80',
    textAlign: 'center',
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: Colors.light.text + '80',
    marginBottom: 6,
    lineHeight: 18,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  callButton: {
    backgroundColor: '#27ae60',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  disclaimerCard: {
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    marginTop: 12,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#c0392b',
    lineHeight: 20,
  },
  strategiesHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  strategiesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
  },
  strategiesSubtitle: {
    fontSize: 16,
    color: Colors.light.text + '80',
    textAlign: 'center',
    lineHeight: 22,
  },
  strategyCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  strategyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  strategyContent: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  strategyDescription: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tint,
    marginTop: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: Colors.light.text + '80',
    lineHeight: 20,
  },
});