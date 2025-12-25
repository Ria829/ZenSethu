import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

export const WellbeingScreen = () => {
  const { sendWellnessUpdate } = useApp();
  const [mood, setMood] = useState<string | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [breathingCount, setBreathingCount] = useState(0);

  const moods = [
    { id: 'excited', emoji: '🤩', label: 'Excited' },
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
  ];

  const breathingPhases = [
    { phase: 'inhale', duration: 4000, text: 'Breathe In...' },
    { phase: 'hold', duration: 2000, text: 'Hold...' },
    { phase: 'exhale', duration: 6000, text: 'Breathe Out...' },
  ];

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    startBreathingCycle(0);
  };

  const startBreathingCycle = (index: number) => {
    if (index >= breathingPhases.length) {
      // Reset to beginning
      index = 0;
    }

    const phase = breathingPhases[index];
    setBreathingPhase(phase.phase);

    setTimeout(() => {
      if (breathingActive) {
        if (phase.phase === 'exhale') {
          setBreathingCount(prev => prev + 1);
        }
        startBreathingCycle(index + 1);
      }
    }, phase.duration);
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingCount(0);
  };

  const selectMood = (selectedMood: string) => {
    setMood(selectedMood);
    Alert.alert('Mood Recorded', `Thank you for sharing how you feel!`, [
      { text: 'OK' }
    ]);
  };

  const sendWellnessUpdateHandler = () => {
    if (!mood) {
      Alert.alert('No Mood Selected', 'Please select your current mood first');
      return;
    }
    
    Alert.alert(
      'Wellness Update',
      'Do you want to send this wellness update to your guardians?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: async () => {
            const result = await sendWellnessUpdate(mood, true);
            if (result.success) {
              Alert.alert('Sent', 'Wellness update sent to your guardians');
              setMood(null);
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Mood Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.moodButton,
                  mood === m.id && styles.selectedMood
                ]}
                onPress={() => selectMood(m.id)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {mood && (
            <TouchableOpacity style={styles.sendButton} onPress={sendWellnessUpdateHandler}>
              <Text style={styles.sendButtonText}>Send Wellness Update</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Breathing Exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calm Breathing Exercise</Text>
          <View style={styles.breathingContainer}>
            {!breathingActive ? (
              <>
                <Text style={styles.breathingDescription}>
                  Take a moment to center yourself with this guided breathing exercise
                </Text>
                <TouchableOpacity 
                  style={styles.startButton} 
                  onPress={startBreathingExercise}
                >
                  <Text style={styles.startButtonText}>Start Exercise</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.breathingCircle}>
                  <Text style={styles.breathingText}>
                    {breathingPhases.find(p => p.phase === breathingPhase)?.text}
                  </Text>
                  <Text style={styles.breathingCount}>Cycle: {breathingCount + 1}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.stopButton} 
                  onPress={stopBreathingExercise}
                >
                  <Text style={styles.stopButtonText}>Stop Exercise</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Wellness Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Ionicons name="sunny" size={24} color="#F59E0B" />
              <Text style={styles.tipText}>Spend time outdoors daily</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="people" size={24} color="#3B82F6" />
              <Text style={styles.tipText}>Connect with friends regularly</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="moon" size={24} color="#8B5CF6" />
              <Text style={styles.tipText}>Maintain a consistent sleep schedule</Text>
            </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  selectedMood: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#374151',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  breathingContainer: {
    alignItems: 'center',
  },
  breathingDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#3B82F6',
  },
  breathingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  breathingCount: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});