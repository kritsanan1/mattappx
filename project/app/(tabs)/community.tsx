import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { 
  MessageCircle, 
  Users, 
  Heart, 
  Send,
  Shield,
  Star,
  Clock
} from 'lucide-react-native';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  likes: number;
  isAnonymous: boolean;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isOnline: boolean;
  nextMeeting?: Date;
}

export default function CommunityScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'วันนี้ครบ 30 วันที่สะอาดแล้ว! ขอบคุณทุกคนที่ให้กำลังใจ',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      author: 'สมาชิกคนที่ 1',
      likes: 12,
      isAnonymous: true,
    },
    {
      id: '2',
      content: 'เมื่อวานมีความอยากมาก แต่ใช้เทคนิคหายใจลึกตามที่เรียน ผ่านมาได้',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      author: 'สมาชิกคนที่ 2',
      likes: 8,
      isAnonymous: true,
    },
    {
      id: '3',
      content: 'มีใครอยากจะคุยไหม? รู้สึกเหงาวันนี้',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      author: 'สมาชิกคนที่ 3',
      likes: 15,
      isAnonymous: true,
    },
  ]);
  
  const [supportGroups] = useState<SupportGroup[]>([
    {
      id: '1',
      name: 'กลุ่มสนับสนุนรายวัน',
      description: 'พูดคุยและให้กำลังใจกันทุกวัน',
      memberCount: 45,
      isOnline: true,
      nextMeeting: new Date(Date.now() + 1000 * 60 * 60 * 2),
    },
    {
      id: '2',
      name: 'กลุ่มสำหรับผู้เริ่มต้น',
      description: 'เพื่อผู้ที่เพิ่งเริ่มการฟื้นฟู',
      memberCount: 23,
      isOnline: false,
      nextMeeting: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
      id: '3',
      name: 'กลุ่มครอบครัว',
      description: 'สำหรับครอบครัวผู้ป่วย',
      memberCount: 18,
      isOnline: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเขียนข้อความ');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      author: 'คุณ',
      likes: 0,
      isAnonymous: true,
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    setShowPostModal(false);
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(messages.map((msg: Message) => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return timestamp.toLocaleDateString('th-TH');
    } else if (hours > 0) {
      return `${hours} ชั่วโมงที่แล้ว`;
    } else if (minutes > 0) {
      return `${minutes} นาทีที่แล้ว`;
    } else {
      return 'เมื่อสักครู่';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ชุมชนสนับสนุน</Text>
          <Text style={styles.headerSubtitle}>แบ่งปันและให้กำลังใจกัน</Text>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Shield size={20} color="#4CAF50" />
          <Text style={styles.privacyText}>
            การสนทนาทั้งหมดเป็นแบบไม่ระบุตัวตนและปลอดภัย
          </Text>
        </View>

        {/* Support Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>กลุ่มสนับสนุน</Text>
          {supportGroups.map((group: SupportGroup) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: group.isOnline ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusText}>
                    {group.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.groupStats}>
                <View style={styles.groupStat}>
                  <Users size={16} color="#666" />
                  <Text style={styles.groupStatText}>{group.memberCount} คน</Text>
                </View>
                
                {group.nextMeeting && (
                  <View style={styles.groupStat}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.groupStatText}>
                      นัดหมายต่อไป: {group.nextMeeting.toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Feed */}
        <View style={styles.section}>
          <View style={styles.feedHeader}>
            <Text style={styles.sectionTitle}>ข้อความจากชุมชน</Text>
            <TouchableOpacity
              style={styles.postButton}
              onPress={() => setShowPostModal(true)}
            >
              <Text style={styles.postButtonText}>โพสต์</Text>
            </TouchableOpacity>
          </View>

          {messages.map((message: Message) => (
            <View key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageAuthor}>{message.author}</Text>
                <Text style={styles.messageTime}>{formatTimestamp(message.timestamp)}</Text>
              </View>
              
              <Text style={styles.messageContent}>{message.content}</Text>
              
              <View style={styles.messageActions}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLikeMessage(message.id)}
                >
                  <Heart size={18} color="#666" />
                  <Text style={styles.likeCount}>{message.likes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.replyButton}>
                  <MessageCircle size={18} color="#666" />
                  <Text style={styles.replyText}>ตอบกลับ</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ความช่วยเหลือฉุกเฉิน</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>หากต้องการความช่วยเหลือด่วน</Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>โทร 1323 (กรมสุขภาพจิต)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>โทร 1669 (ฉุกเฉินการแพทย์)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Post Message Modal */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPostModal(false)}>
              <Text style={styles.modalCancel}>ยกเลิก</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>แบ่งปันกับชุมชน</Text>
            <TouchableOpacity onPress={handleSendMessage}>
              <Text style={styles.modalSend}>โพสต์</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.anonymousNotice}>
              <Shield size={20} color="#4CAF50" />
              <Text style={styles.anonymousText}>
                ข้อความของคุณจะไม่ระบุตัวตนและปลอดภัย
              </Text>
            </View>

            <TextInput
              style={styles.messageInput}
              placeholder="แบ่งปันความรู้สึก ความสำเร็จ หรือขอกำลังใจ..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.guidelines}>
              <Text style={styles.guidelinesTitle}>💡 แนวทางการโพสต์</Text>
              <Text style={styles.guidelinesText}>• แบ่งปันประสบการณ์ที่สร้างแรงบันดาลใจ</Text>
              <Text style={styles.guidelinesText}>• ขอและให้กำลังใจแก่กัน</Text>
              <Text style={styles.guidelinesText}>• หลีกเลี่ยงข้อมูลส่วนตัวที่ระบุตัวตน</Text>
              <Text style={styles.guidelinesText}>• ใช้ภาษาที่สุภาพและให้กำลังใจ</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  groupStats: {
    flexDirection: 'row',
    gap: 16,
  },
  groupStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupStatText: {
    fontSize: 12,
    color: '#666',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#666',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    fontSize: 14,
    color: '#666',
  },
  emergencyCard: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSend: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  anonymousNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  anonymousText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
  },
  messageInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 20,
  },
  guidelines: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF6C00',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#EF6C00',
    marginBottom: 6,
    lineHeight: 20,
  },
});