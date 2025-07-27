import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Settings, Trash2 } from 'lucide-react-native';

interface ProfileDataManagementProps {
  onDeleteAllData: () => void;
}

const ProfileDataManagement: React.FC<ProfileDataManagementProps> = ({ onDeleteAllData }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>การจัดการข้อมูล</Text>
      
      <TouchableOpacity 
        style={styles.dataButton}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Settings size={20} color="#666" />
        <Text style={styles.dataButtonText}>จัดการข้อมูล</Text>
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.dataManagement}>
          <Text style={styles.dataManagementTitle}>สิทธิของคุณภายใต้ PDPA</Text>
          <Text style={styles.dataManagementText}>
            • สิทธิในการเข้าถึงข้อมูลส่วนบุคคล{'\n'}
            • สิทธิในการแก้ไขข้อมูลส่วนบุคคล{'\n'}
            • สิทธิในการลบข้อมูลส่วนบุคคล{'\n'}
            • สิทธิในการขอให้หยุดการประมวลผลข้อมูล
          </Text>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={onDeleteAllData}
          >
            <Trash2 size={20} color="white" />
            <Text style={styles.deleteButtonText}>ลบข้อมูลทั้งหมด</Text>
          </TouchableOpacity>
        </View>
      )}
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
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dataButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dataManagement: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  dataManagementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  dataManagementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileDataManagement;