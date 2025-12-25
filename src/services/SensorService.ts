import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as Location from 'expo-location';

export class SensorService {
  private accelerometerSubscription: any;
  private gyroscopeSubscription: any;
  private locationSubscription: any;
  
  private lastLocation: Location.LocationObject | null = null;
  private locationHistory: Location.LocationObject[] = [];
  private movementData: any[] = [];
  
  private onDistressDetected: (data: any) => void;
  private isActive: boolean = false;

  constructor(onDistressDetected: (data: any) => void) {
    this.onDistressDetected = onDistressDetected;
  }

  async startMonitoring() {
    this.isActive = true;
    
    // Request permissions
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      console.warn('Location permission not granted');
      return;
    }
    
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      console.warn('Background location permission not granted');
    }
    
    // Start sensors
    this.startAccelerometer();
    this.startGyroscope();
    this.startLocationTracking();
  }

  stopMonitoring() {
    this.isActive = false;
    this.accelerometerSubscription?.remove();
    this.gyroscopeSubscription?.remove();
    this.locationSubscription?.remove();
  }

  private startAccelerometer() {
    this.accelerometerSubscription = Accelerometer.addListener((data) => {
      if (!this.isActive) return;
      
      // Store movement data for analysis
      this.movementData.push({
        type: 'accelerometer',
        timestamp: Date.now(),
        data
      });
      
      // Keep only last 100 data points
      if (this.movementData.length > 100) {
        this.movementData.shift();
      }
      
      // Analyze for distress patterns
      this.analyzeMovementData();
    });
    
    Accelerometer.setUpdateInterval(1000); // Update every second
  }

  private startGyroscope() {
    this.gyroscopeSubscription = Gyroscope.addListener((data) => {
      if (!this.isActive) return;
      
      this.movementData.push({
        type: 'gyroscope',
        timestamp: Date.now(),
        data
      });
    });
    
    Gyroscope.setUpdateInterval(1000);
  }

  private async startLocationTracking() {
    // Get initial location
    const location = await Location.getCurrentPositionAsync({});
    this.lastLocation = location;
    this.locationHistory.push(location);
    
    // Watch for location changes
    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Every 5 seconds
        distanceInterval: 5 // Every 5 meters
      },
      (location) => {
        if (!this.isActive) return;
        
        this.lastLocation = location;
        this.locationHistory.push(location);
        
        // Keep only last 50 locations
        if (this.locationHistory.length > 50) {
          this.locationHistory.shift();
        }
        
        // Analyze for route deviation
        this.analyzeLocationData();
      }
    );
  }

  private analyzeMovementData() {
    // Check for panic-like shaking (high frequency, high amplitude)
    const recentData = this.movementData.slice(-10); // Last 10 seconds
    
    if (recentData.length < 5) return;
    
    // Calculate movement variance
    const xValues = recentData.filter(d => d.type === 'accelerometer').map(d => d.data.x);
    const yValues = recentData.filter(d => d.type === 'accelerometer').map(d => d.data.y);
    const zValues = recentData.filter(d => d.type === 'accelerometer').map(d => d.data.z);
    
    const xVariance = this.calculateVariance(xValues);
    const yVariance = this.calculateVariance(yValues);
    const zVariance = this.calculateVariance(zValues);
    
    // If high variance in multiple axes, possible panic shaking
    if (xVariance > 0.5 && yVariance > 0.5 && zVariance > 0.5) {
      this.onDistressDetected({
        type: 'panic_shaking',
        confidence: 0.8,
        data: { xVariance, yVariance, zVariance }
      });
    }
    
    // Check for abrupt stopping
    if (recentData.length >= 2) {
      const lastMovement = recentData[recentData.length - 1];
      const prevMovement = recentData[recentData.length - 2];
      
      if (lastMovement.type === 'accelerometer' && prevMovement.type === 'accelerometer') {
        const lastMagnitude = Math.sqrt(
          Math.pow(lastMovement.data.x, 2) + 
          Math.pow(lastMovement.data.y, 2) + 
          Math.pow(lastMovement.data.z, 2)
        );
        
        const prevMagnitude = Math.sqrt(
          Math.pow(prevMovement.data.x, 2) + 
          Math.pow(prevMovement.data.y, 2) + 
          Math.pow(prevMovement.data.z, 2)
        );
        
        // If sudden drop in movement magnitude
        if (prevMagnitude > 1.5 && lastMagnitude < 0.5) {
          this.onDistressDetected({
            type: 'abrupt_stop',
            confidence: 0.7,
            data: { prevMagnitude, lastMagnitude }
          });
        }
      }
    }
  }

  private analyzeLocationData() {
    if (this.locationHistory.length < 3) return;
    
    // Calculate speed between points
    const speeds: number[] = [];
    for (let i = 1; i < this.locationHistory.length; i++) {
      const prev = this.locationHistory[i - 1];
      const current = this.locationHistory[i];
      
      const distance = this.calculateDistance(
        prev.coords.latitude,
        prev.coords.longitude,
        current.coords.latitude,
        current.coords.longitude
      );
      
      const timeDiff = (current.timestamp - prev.timestamp) / 1000; // seconds
      const speed = distance / timeDiff; // meters per second
      
      speeds.push(speed);
    }
    
    // Check for unusually slow movement
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const currentSpeed = speeds[speeds.length - 1];
    
    if (avgSpeed > 1.0 && currentSpeed < 0.1) {
      this.onDistressDetected({
        type: 'unusually_slow',
        confidence: 0.6,
        data: { avgSpeed, currentSpeed }
      });
    }
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    
    return avgSquaredDiff;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
}