import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

export const ProfileScreen = () => {
  const { guardians, updateGuardians } = useApp();
  const [newGuardian, setNewGuardian] = useState({ name: '', phone: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleGuardian = (id: number) => {
    const updatedGuardians = guardians.map(g => 
      g.id === id ? { ...g, active: !g.active } : g
    );
    updateGuardians(updatedGuardians);
  };

  const removeGuardian = (id: number) => {
    Alert.alert(
      'Remove Guardian',
      'Are you sure you want to remove this guardian?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => {
            const updatedGuardians = guardians.filter(g => g.id !== id);
            updateGuardians(updatedGuardians);
          }
        }
      ]
    );
  };

  const addGuardian = () => {
    if (!newGuardian.name || !newGuardian.phone) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    const newGuardianObj = {
      id: guardians.length > 0 ? Math.max(...guardians.map(g => g.id)) + 1 : 1,
      name: newGuardian.name,
      phone: newGuardian.phone,
      active: true
    };

    updateGuardians([...guardians, newGuardianObj]);
    setNewGuardian({ name: '', phone: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Guardian added successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#3B82F6" />
          </View>
          <Text style={styles.profileName}>Priya Sharma</Text>
          <Text style={styles.profileEmail}>priya.sharma@example.com</Text>
          <View style={styles.safetyBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.safetyBadgeText}>Safety Active</Text>
          </View>
        </View>

        {/* Guardian Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guardian Circle</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {showAddForm && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Guardian Name"
                value={newGuardian.name}
                onChangeText={(text) => setNewGuardian({...newGuardian, name: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={newGuardian.phone}
                onChangeText={(text) => setNewGuardian({...newGuardian, phone: text})}
                keyboardType="phone-pad"
              />
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.saveButton]}
                  onPress={addGuardian}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {guardians.map((guardian) => (
            <View key={guardian.id} style={styles.guardianItem}>
              <View style={styles.guardianInfo}>
                <View style={styles.guardianAvatar}>
                  <Ionicons name="person" size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.guardianName}>{guardian.name}</Text>
                  <Text style={styles.guardianPhone}>{guardian.phone}</Text>
                </View>
              </View>
              <View style={styles.guardianActions}>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton,
                    guardian.active ? styles.activeButton : styles.inactiveButton
                  ]}
                  onPress={() => toggleGuardian(guardian.id)}
                >
                  <Ionicons 
                    name={guardian.active ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={guardian.active ? "#10B981" : "#9CA3AF"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeGuardian(guardian.id)}
                >
                  <Ionicons name="trash" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#3B82F6" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={24} color="#3B82F6" />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed" size={24} color="#3B82F6" />
              <Text style={styles.settingText}>Privacy Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
              <Text style={styles.settingText}>About ZenSethu AI</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 20,
  },
  safetyBadgeText: {
    color: '#065F46',
    marginLeft: 6,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  guardianItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  guardianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guardianAvatar: {
    backgroundColor: '#DBEAFE',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guardianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  guardianPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  guardianActions: {
    flexDirection: 'row',
  },
  toggleButton: {
    padding: 8,
    marginRight: 8,
  },
  activeButton: {
    // No additional styling needed
  },
  inactiveButton: {
    opacity: 0.5,
  },
  removeButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
});