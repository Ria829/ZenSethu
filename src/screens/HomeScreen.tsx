import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../contexts/AppContext';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { safetyStatus, safetyScore, isActive, startSafetyMonitoring, stopSafetyMonitoring } = useApp();
  const [activeGuardians, setActiveGuardians] = useState(3);

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, time: '10:30 AM', location: 'College Campus', status: 'Safe' },
    { id: 2, time: 'Yesterday', location: 'Market Street', status: 'Medium Risk' },
    { id: 3, time: '2 days ago', location: 'Railway Station', status: 'Safe' },
  ];

  useEffect(() => {
    // Start safety monitoring when app loads
    startSafetyMonitoring();
    
    return () => {
      stopSafetyMonitoring();
    };
  }, []);

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to send an emergency alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Alert', onPress: () => navigation.navigate('Alert' as never) }
      ]
    );
  };

  const getStatusColor = () => {
    if (safetyStatus === 'safe') return '#10B981';
    if (safetyStatus === 'medium') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Safety Status Card */}
        <View style={[styles.card, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>Current Safety Status</Text>
          <Text style={styles.statusValue}>
            {safetyStatus === 'safe' ? 'Safe' : safetyStatus === 'medium' ? 'Medium Risk' : 'High Risk'}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Safety Score</Text>
            <Text style={styles.scoreValue}>{safetyScore}/100</Text>
          </View>
          <View style={styles.monitoringStatus}>
            <Ionicons 
              name={isActive ? "radio-button-on" : "radio-button-off"} 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={styles.monitoringText}>
              {isActive ? 'Monitoring Active' : 'Monitoring Inactive'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Routes' as never)}
            >
              <Ionicons name="navigate" size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Plan Route</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Map' as never)}
            >
              <Ionicons name="map" size={24} color="#3B82F6" />
              <Text style={styles.actionText}>View Map</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.emergencyButton]}
              onPress={handleEmergency}
            >
              <Ionicons name="alert" size={24} color="#FFFFFF" />
              <Text style={[styles.actionText, styles.emergencyText]}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityLocation}>{activity.location}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Text style={[
                styles.activityStatus,
                { 
                  color: activity.status === 'Safe' ? '#10B981' : 
                          activity.status === 'Medium Risk' ? '#F59E0B' : '#EF4444'
                }
              ]}>
                {activity.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Guardian Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guardian Circle</Text>
          <View style={styles.guardianInfo}>
            <Ionicons name="people" size={24} color="#3B82F6" />
            <Text style={styles.guardianText}>{activeGuardians} guardians active</Text>
          </View>
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
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  monitoringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monitoringText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
  },
  emergencyText: {
    color: '#FFFFFF',
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  guardianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  guardianText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
});