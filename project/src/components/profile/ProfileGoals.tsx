import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Target, Trash2 } from 'lucide-react-native';

interface ProfileGoalsProps {
  goals: string[];
  isEditing: boolean;
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (index: number) => void;
}

const ProfileGoals: React.FC<ProfileGoalsProps> = ({ goals, isEditing, onAddGoal, onRemoveGoal }) => {
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    onAddGoal(newGoal.trim());
    setNewGoal('');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>เป้าหมายส่วนตัว</Text>
      
      {goals.map((goal, index) => (
        <View key={index} style={styles.goalItem}>
          <Target size={20} color="#4CAF50" />
          <Text style={styles.goalText}>{goal}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => onRemoveGoal(index)}>
              <Trash2 size={18} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {isEditing && (
        <View style={styles.addGoalContainer}>
          <TextInput
            style={styles.goalInput}
            value={newGoal}
            onChangeText={setNewGoal}
            placeholder="เพิ่มเป้าหมายใหม่"
            onSubmitEditing={handleAddGoal}
          />
          <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
            <Text style={styles.addGoalButtonText}>เพิ่ม</Text>
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
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addGoalContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  goalInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addGoalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGoalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileGoals;