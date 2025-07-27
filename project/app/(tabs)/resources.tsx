import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Phone, MapPin, BookOpen, Headphones as HeadphonesIcon, Heart, Users, Clock, ExternalLink, Play } from 'lucide-react-native';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'hotline' | 'location' | 'guide' | 'meditation' | 'exercise';
  content?: string;
  phone?: string;
  address?: string;
  url?: string;
  available24h?: boolean;
}

interface MeditationExercise {
  id: string;
  title: string;
  duration: string;
  description: string;
  instructions: string[];
}

export default function ResourcesScreen() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeExercise, setActiveExercise] = useState<MeditationExercise | null>(null);

  const resources: Resource[] = [
    {
      id: '1',
      title: 'สายด่วนกรมสุขภาพจิต',
      description: 'ให้คำปรึกษาด้านสุขภาพจิตและการเสพติด',
      type: 'hotline',
      phone: '1323',
      available24h: true,
    },
    {
      id: '2',
      title: 'สายด่วนฉุกเฉินการแพทย์',
      description: 'สำหรับกรณีฉุกเฉินทางการแพทย์',
      type: 'hotline',
      phone: '1669',
      available24h: true,
    },
    {
      id: '3',
      title: 'ศูนย์ช่วยเหลือผู้เสพติด กทม.',
      description: 'ศูนย์บำบัดรักษาและฟื้นฟูผู้เสพติด',
      type: 'location',
      phone: '02-354-8900',
      address: 'ถนนเทียมร่วมมิตร แขวงสีลม เขตบางรัก กรุงเทพฯ',
    },
    {
      id: '4',
      title: 'โรงพยาบาลศรีธัญญา',
      description: 'รักษาผู้ป่วยด้านจิตเวชและเสพติด',
      type: 'location',
      phone: '02-759-9100',
      address: 'ถนนกรุงเทพกรีฑา แขวงสะพานสูง เขตสะพานสูง กรุงเทพฯ',
    },
  ];

  const meditationExercises: MeditationExercise[] = [
    {
      id: '1',
      title: 'การหายใจลึก 4-7-8',
      duration: '5 นาที',
      description: 'เทคนิคการหายใจเพื่อลดความเครียดและความอยาก',
      instructions: [
        'นั่งให้สบายและหลับตา',
        'หายใจเข้าทางจมูก นับ 1, 2, 3, 4',
        'กลั้นหายใจ นับ 1, 2, 3, 4, 5, 6, 7',
        'หายใจออกทางปาก นับ 1, 2, 3, 4, 5, 6, 7, 8',
        'ทำซ้ำ 4-8 รอบ',
      ],
    },
    {
      id: '2',
      title: 'การสแกนร่างกาย',
      duration: '10 นาที',
      description: 'ผ่อนคลายความตึงเครียดทั่วร่างกาย',
      instructions: [
        'นอนหงายให้สบาย หลับตาเบาๆ',
        'เริ่มจากปลายเท้า รู้สึกถึงความรู้สึกที่นั่น',
        'ค่อยๆ เลื่อนความสนใจขึ้นมาทีละส่วน',
        'สังเกตความตึงเครียด แล้วปล่อยวาง',
        'เลื่อนผ่านขา เอว หลัง อก แขน คอ หัว',
        'จบด้วยการรู้สึกถึงร่างกายทั้งหมด',
      ],
    },
    {
      id: '3',
      title: 'สมาธิเดิน',
      duration: '15 นาที',
      description: 'การเดินอย่างมีสติเพื่อจิตใจสงบ',
      instructions: [
        'เลือกเส้นทางเดินสั้นๆ 10-20 ก้าว',
        'เดินช้าๆ สนใจการเคลื่อนไหวของเท้า',
        'รู้สึกถึงการยกเท้า ก้าวออก วางลง',
        'เมื่อถึงจุดสิ้นสุด หันกลับและเดินต่อ',
        'ถ้าจิตฟุ้งซ่าน กลับมาสนใจการเดิน',
      ],
    },
  ];

  const guides = [
    {
      id: '1',
      title: 'วิธีรับมือกับความอยาก',
      content: `
1. **หยุดและหายใจ**
   - หยุดสิ่งที่กำลังทำ
   - หายใจลึกๆ 5 ครั้ง
   - นับจาก 1 ถึง 10

2. **เปลี่ยนสภาพแวดล้อม**
   - ออกจากสถานที่นั้น
   - ไปที่อื่นที่ปลอดภัย
   - หาคนคุยด้วย

3. **ทำกิจกรรมทดแทน**
   - ออกกำลังกาย
   - ฟังเพลง
   - เล่นเกม
   - อ่านหนังสือ

4. **ติดต่อสายสนับสนุน**
   - โทรหาเพื่อนสนิท
   - โทรสายด่วน 1323
   - ไปพบให้คำปรึกษา
      `,
    },
    {
      id: '2',
      title: 'การสร้างแรงจูงใจ',
      content: `
1. **จดบันทึกเป้าหมาย**
   - เหตุผลที่ต้องการหยุด
   - ผลดีที่จะได้รับ
   - คนที่สำคัญในชีวิต

2. **สร้างรางวัลให้ตัวเอง**
   - ของที่อยากได้
   - กิจกรรมที่ชอบ
   - การเดินทาง

3. **มองเห็นความก้าวหน้า**
   - บันทึกวันที่สะอาด
   - เงินที่ประหยัดได้
   - สุขภาพที่ดีขึ้น

4. **เชื่อมต่อกับชุมชน**
   - เข้าร่วมกลุ่มสนับสนุน
   - ช่วยเหลือคนอื่น
   - แบ่งปันประสบการณ์
      `,
    },
  ];

  const handleCallHotline = (phone: string) => {
    Alert.alert(
      'โทรติดต่อ',
      `ต้องการโทรหา ${phone} หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'โทร', 
          onPress: () => Linking.openURL(`tel:${phone}`) 
        }
      ]
    );
  };

  const handleOpenMaps = (address: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const renderResourceCard = (resource: Resource) => (
    <TouchableOpacity
      key={resource.id}
      style={styles.resourceCard}
      onPress={() => {
        if (resource.type === 'hotline') {
          handleCallHotline(resource.phone!);
        } else if (resource.type === 'location') {
          setSelectedResource(resource);
        }
      }}
    >
      <View style={styles.resourceHeader}>
        <View style={styles.resourceIcon}>
          {resource.type === 'hotline' ? (
            <Phone size={24} color="#4CAF50" />
          ) : (
            <MapPin size={24} color="#2196F3" />
          )}
        </View>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>
          {resource.available24h && (
            <View style={styles.available24h}>
              <Clock size={14} color="#4CAF50" />
              <Text style={styles.available24hText}>เปิด 24 ชั่วโมง</Text>
            </View>
          )}
        </View>
        <ExternalLink size={20} color="#666" />
      </View>
      
      {resource.phone && (
        <Text style={styles.resourcePhone}>โทร: {resource.phone}</Text>
      )}
      
      {resource.address && (
        <Text style={styles.resourceAddress}>{resource.address}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ทรัพยากรความช่วยเหลือ</Text>
          <Text style={styles.headerSubtitle}>แหล่งข้อมูลและการสนับสนุน</Text>
        </View>

        {/* Emergency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 สายด่วนฉุกเฉิน</Text>
          {resources
            .filter(r => r.type === 'hotline')
            .map(renderResourceCard)}
        </View>

        {/* Treatment Centers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 ศูนย์รักษา</Text>
          {resources
            .filter(r => r.type === 'location')
            .map(renderResourceCard)}
        </View>

        {/* Self-Help Guides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 คู่มือช่วยเหลือตนเอง</Text>
          {guides.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              onPress={() => setSelectedResource({
                id: guide.id,
                title: guide.title,
                description: 'คู่มือช่วยเหลือตนเอง',
                type: 'guide',
                content: guide.content,
              })}
            >
              <View style={styles.guideHeader}>
                <BookOpen size={24} color="#FF9800" />
                <View style={styles.guideInfo}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDescription}>คู่มือช่วยเหลือตนเอง</Text>
                </View>
                <ExternalLink size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meditation Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧘 แบบฝึกหัดสมาธิ</Text>
          {meditationExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => setActiveExercise(exercise)}
            >
              <View style={styles.exerciseHeader}>
                <HeadphonesIcon size={24} color="#9C27B0" />
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  <Text style={styles.exerciseDuration}>⏱️ {exercise.duration}</Text>
                </View>
                <Play size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 แหล่งข้อมูลเพิ่มเติม</Text>
          <View style={styles.linkCard}>
            <Text style={styles.linkTitle}>เว็บไซต์ที่มีประโยชน์</Text>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://dmh.go.th')}
            >
              <Text style={styles.linkText}>• กรมสุขภาพจิต กระทรวงสาธารณสุข</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://thaihealth.or.th')}
            >
              <Text style={styles.linkText}>• สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Resource Detail Modal */}
      {selectedResource && selectedResource.type === 'guide' && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedResource(null)}>
                <Text style={styles.modalClose}>ปิด</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedResource.title}</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.guideContent}>{selectedResource.content}</Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Meditation Exercise Modal */}
      {activeExercise && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setActiveExercise(null)}>
                <Text style={styles.modalClose}>ปิด</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{activeExercise.title}</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.exerciseDetailDescription}>
                {activeExercise.description}
              </Text>
              <Text style={styles.exerciseDetailDuration}>
                ⏱️ ระยะเวลา: {activeExercise.duration}
              </Text>
              
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>ขั้นตอนการปฏิบัติ:</Text>
                {activeExercise.instructions.map((instruction: string, index: number) => (
                  <Text key={index} style={styles.instructionStep}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
              </View>
              
              <TouchableOpacity style={styles.startExerciseButton}>
                <Play size={20} color="white" />
                <Text style={styles.startExerciseText}>เริ่มฝึก</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
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
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  resourceCard: {
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
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceIcon: {
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  available24h: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  available24hText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  resourcePhone: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 8,
  },
  resourceAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  guideCard: {
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
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideInfo: {
    flex: 1,
    marginLeft: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    color: '#666',
  },
  exerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: '600',
  },
  linkCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  linkItem: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
    lineHeight: 20,
    textDecorationLine: 'underline',
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
  modalClose: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  guideContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  exerciseDetailDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  exerciseDetailDuration: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '600',
    marginBottom: 20,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionStep: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  startExerciseButton: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startExerciseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});