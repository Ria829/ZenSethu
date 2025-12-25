import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [autoAlert, setAutoAlert] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsOptions = [
    {
      title: 'Notifications',
      description: 'Receive safety alerts and updates',
      value: notifications,
      onValueChange: setNotifications,
      icon: 'notifications'
    },
    {
      title: 'Location Sharing',
      description: 'Share location with guardians during travel',
      value: locationSharing,
      onValueChange: setLocationSharing,
      icon: 'location'
    },
    {
      title: 'Auto Alert',
      description: 'Enable automatic distress detection',
      value: autoAlert,
      onValueChange: setAutoAlert,
      icon: 'alert'
    },
    {
      title: 'Dark Mode',
      description: 'Switch to dark theme',
      value: darkMode,
      onValueChange: setDarkMode,
      icon: 'moon'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <View style={styles.settingsContainer}>
        {settingsOptions.map((setting, index) => (
          <View key={index} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name={setting.icon as any} size={24} color="#3B82F6" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor={setting.value ? "#FFFFFF" : "#FFFFFF"}
              ios_backgroundColor="#D1D5DB"
              onValueChange={setting.onValueChange}
              value={setting.value}
            />
          </View>
        ))}
      </View>
      
      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoItem}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <Text style={styles.infoText}>About ZenSethu AI</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Ionicons name="help-circle" size={24} color="#3B82F6" />
          <Text style={styles.infoText}>Help & Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Ionicons name="document-text" size={24} color="#3B82F6" />
          <Text style={styles.infoText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
          <Text style={styles.infoText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 16,
  },
});