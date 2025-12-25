export class AlertService {
  private guardians: Array<{ id: number; name: string; phone: string; active: boolean }> = [];
  
  constructor() {
    // Load guardians from storage in a real app
    this.loadGuardians();
  }

  async sendEmergencyAlert(data: {
    location: { lat: number; lng: number };
    riskLevel: 'low' | 'medium' | 'high';
    routeDeviation?: boolean;
    audioClip?: string; // Base64 encoded audio
  }) {
    const activeGuardians = this.guardians.filter(g => g.active);
    
    if (activeGuardians.length === 0) {
      console.warn('No active guardians to send alert to');
      return { success: false, message: 'No active guardians' };
    }
    
    try {
      // In a real app, this would send actual notifications
      // For demo, we'll just log the alert
      
      console.log('Sending emergency alert to guardians:', activeGuardians);
      console.log('Alert data:', data);
      
      // Simulate sending to each guardian
      for (const guardian of activeGuardians) {
        await this.sendToGuardian(guardian, data);
      }
      
      return { success: true, message: 'Alert sent successfully' };
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      return { success: false, message: 'Failed to send alert' };
    }
  }

  async sendWellnessUpdate(mood: string, consent: boolean) {
    if (!consent) {
      console.log('User did not consent to send wellness update');
      return { success: false, message: 'User did not consent' };
    }
    
    const activeGuardians = this.guardians.filter(g => g.active);
    
    if (activeGuardians.length === 0) {
      console.warn('No active guardians to send wellness update to');
      return { success: false, message: 'No active guardians' };
    }
    
    try {
      console.log('Sending wellness update to guardians:', activeGuardians);
      console.log('Mood:', mood);
      
      // Simulate sending to each guardian
      for (const guardian of activeGuardians) {
        await this.sendWellnessToGuardian(guardian, mood);
      }
      
      return { success: true, message: 'Wellness update sent successfully' };
    } catch (error) {
      console.error('Failed to send wellness update:', error);
      return { success: false, message: 'Failed to send wellness update' };
    }
  }

  setGuardians(guardians: Array<{ id: number; name: string; phone: string; active: boolean }>) {
    this.guardians = guardians;
    // In a real app, save to storage
  }

  private async loadGuardians() {
    // In a real app, load from storage
    // For demo, we'll use mock data
    this.guardians = [
      { id: 1, name: 'Mother', phone: '+91 98765 43210', active: true },
      { id: 2, name: 'Father', phone: '+91 98765 43211', active: true },
      { id: 3, name: 'Friend', phone: '+91 98765 43212', active: false }
    ];
  }

  private async sendToGuardian(
    guardian: { id: number; name: string; phone: string; active: boolean },
    data: any
  ) {
    // In a real app, this would send an SMS, push notification, or app notification
    // For demo, we'll just simulate the send
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Alert sent to ${guardian.name} (${guardian.phone})`);
        resolve(true);
      }, 500);
    });
  }

  private async sendWellnessToGuardian(
    guardian: { id: number; name: string; phone: string; active: boolean },
    mood: string
  ) {
    // In a real app, this would send a wellness update
    // For demo, we'll just simulate the send
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Wellness update sent to ${guardian.name} (${guardian.phone}): Mood is ${mood}`);
        resolve(true);
      }, 500);
    });
  }
}