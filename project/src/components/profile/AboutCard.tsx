import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutCard = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>เกี่ยวกับแอป</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Thai Recovery v1.0</Text>
        <Text style={styles.aboutText}>
          แอปพลิเคชันสำหรับสนับสนุนการฟื้นฟูจากการเสพติด
          พัฒนาโดยทีมงานที่เข้าใจและใส่ใจในปัญหาสังคมไทย
        </Text>
        <Text style={styles.aboutContact}>
          ติดต่อสอบถาม: support@thairecovery.com
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  aboutCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  aboutContact: {
    fontSize: 14,
    color: '#2196F3',
  },
});

export default AboutCard;