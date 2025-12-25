import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SensorService } from '../services/SensorService';
import { AlertService } from '../services/AlertService';
import * as Location from 'expo-location';

interface Guardian {
  id: number;
  name: string;
  phone: string;
  active: boolean;
}

interface AppState {
  safetyStatus: 'safe' | 'medium' | 'high';
  safetyScore: number;
  isActive: boolean;
  guardians: Guardian[];
  location: Location.LocationObject | null;
}

interface AppContextType extends AppState {
  startSafetyMonitoring: () => void;
  stopSafetyMonitoring: () => void;
  updateGuardians: (guardians: Guardian[]) => void;
  sendEmergencyAlert: (data: any) => Promise<any>;
  sendWellnessUpdate: (mood: string, consent: boolean) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'medium' | 'high'>('safe');
  const [safetyScore, setSafetyScore] = useState(92);
  const [isActive, setIsActive] = useState(false);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  const sensorService = new SensorService(handleDistressDetection);
  const alertService = new AlertService();

  useEffect(() => {
    // Initialize guardians
    alertService.setGuardians([
      { id: 1, name: 'Mother', phone: '+91 98765 43210', active: true },
      { id: 2, name: 'Father', phone: '+91 98765 43211', active: true },
      { id: 3, name: 'Friend', phone: '+91 98765 43212', active: false }
    ]);
    
    setGuardians([
      { id: 1, name: 'Mother', phone: '+91 98765 43210', active: true },
      { id: 2, name: 'Father', phone: '+91 98765 43211', active: true },
      { id: 3, name: 'Friend', phone: '+91 98765 43212', active: false }
    ]);
  }, []);

  const startSafetyMonitoring = async () => {
    try {
      await sensorService.startMonitoring();
      setIsActive(true);
      
      // Update safety score periodically
      const interval = setInterval(() => {
        // Randomly update safety score for demo purposes
        const newScore = Math.max(70, Math.min(100, safetyScore + (Math.random() * 10 - 5)));
        setSafetyScore(Math.round(newScore));
        
        if (newScore > 90) setSafetyStatus('safe');
        else if (newScore > 75) setSafetyStatus('medium');
        else setSafetyStatus('high');
      }, 10000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start safety monitoring:', error);
    }
  };

  const stopSafetyMonitoring = () => {
    sensorService.stopMonitoring();
    setIsActive(false);
  };

  const updateGuardians = (newGuardians: Guardian[]) => {
    setGuardians(newGuardians);
    alertService.setGuardians(newGuardians);
  };

  const handleDistressDetection = async (data: any) => {
    console.log('Distress detected:', data);
    
    // Get current location
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Send emergency alert
      const alertResult = await alertService.sendEmergencyAlert({
        location: {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        },
        riskLevel: safetyStatus,
        routeDeviation: data.type === 'abrupt_stop' || data.type === 'unusually_slow',
        // In a real app, we would include a short audio clip
      });
      
      console.log('Alert result:', alertResult);
    } catch (error) {
      console.error('Failed to get location or send alert:', error);
    }
  };

  const sendEmergencyAlert = async (data: any) => {
    return await alertService.sendEmergencyAlert(data);
  };

  const sendWellnessUpdate = async (mood: string, consent: boolean) => {
    return await alertService.sendWellnessUpdate(mood, consent);
  };

  const value = {
    safetyStatus,
    safetyScore,
    isActive,
    guardians,
    location,
    startSafetyMonitoring,
    stopSafetyMonitoring,
    updateGuardians,
    sendEmergencyAlert,
    sendWellnessUpdate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};