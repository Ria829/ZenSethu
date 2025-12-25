import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

export const AlertScreen = () => {
  const { sendEmergencyAlert, location } = useApp();
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(10);
  const [alertSent, setAlertSent] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !alertSent) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !alertSent) {
      sendAlert();
    }
  }, [countdown, alertSent]);

  const sendAlert = async () => {
    setAlertSent(true);
    
    // Send emergency alert with current location
    const alertData = {
      location: location ? {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      } : { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
      riskLevel: 'high' as const,
      routeDeviation: true
    };
    
    const result = await sendEmergencyAlert(alertData);
    
    if (result.success) {
      Alert.alert(
        'Alert Sent',
        'Your emergency alert has been sent to your guardians. Help is on the way!',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      Alert.alert(
        'Error',
        'Failed to send alert. Please try again.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const cancelAlert = () => {
    Alert.alert(
      'Cancel Alert',
      'Are you sure you want to cancel the emergency alert?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons 
          name="alert-circle" 
          size={100} 
          color={alertSent ? "#10B981" : "#EF4444"} 
          style={styles.alertIcon}
        />
        
        <Text style={styles.title}>
          {alertSent ? "Help is on the way!" : "Emergency Alert"}
        </Text>
        
        {!alertSent ? (
          <>
            <Text style={styles.message}>
              An emergency alert will be sent to your guardians in:
            </Text>
            <Text style={styles.countdown}>{countdown}s</Text>
            <Text style={styles.description}>
              Your location and safety information are being prepared for transmission.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.message}>
              Your alert has been sent successfully!
            </Text>
            <Text style={styles.description}>
              Your guardians have been notified and local authorities are being contacted.
            </Text>
          </>
        )}
        
        <View style={styles.buttonContainer}>
          {!alertSent ? (
            <TouchableOpacity style={styles.cancelButton} onPress={cancelAlert}>
              <Text style={styles.cancelButtonText}>Cancel Alert</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.okButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },
  countdown: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#EF4444',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  okButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});