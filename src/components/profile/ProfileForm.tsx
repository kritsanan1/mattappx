import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Save } from 'lucide-react-native';

interface ProfileFormProps {
  name: string;
  soberStartDate: string;
  dailyExpense: number;
  isEditing: boolean;
  onProfileChange: (field: 'name' | 'soberStartDate' | 'dailyExpense', value: string | number) => void;
  saveProfile: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ name, soberStartDate, dailyExpense, isEditing, onProfileChange, saveProfile }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ข้อมูลส่วนตัว</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ชื่อ</Text>
        <TextInput
          style={[styles.textInput, !isEditing && styles.disabledInput]}
          value={name}
          onChangeText={(text) => onProfileChange('name', text)}
          placeholder="ระบุชื่อของคุณ"
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>วันที่เริ่มสะอาด</Text>
        <TextInput
          style={[styles.textInput, !isEditing && styles.disabledInput]}
          value={soberStartDate}
          onChangeText={(text) => onProfileChange('soberStartDate', text)}
          placeholder="YYYY-MM-DD"
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ค่าใช้จ่ายต่อวัน (บาท)</Text>
        <TextInput
          style={[styles.textInput, !isEditing && styles.disabledInput]}
          value={dailyExpense.toString()}
          onChangeText={(text) => onProfileChange('dailyExpense', parseInt(text) || 0)}
          placeholder="200"
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>บันทึก</Text>
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledInput: {
    backgroundColor: '#F9F9F9',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileForm;