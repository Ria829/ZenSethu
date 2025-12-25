export class RouteSafetyService {
  // Mock data for demonstration
  private mockRiskZones = [
    { 
      id: 1, 
      name: 'Dimly Lit Street', 
      coordinates: { lat: 12.9716, lng: 77.5946 },
      riskLevel: 'high',
      riskFactors: ['Poor lighting', 'Low foot traffic']
    },
    { 
      id: 2, 
      name: 'Busy Market Area', 
      coordinates: { lat: 12.9352, lng: 77.6214 },
      riskLevel: 'low',
      riskFactors: ['High foot traffic', 'Good lighting']
    },
    { 
      id: 3, 
      name: 'Isolated Park', 
      coordinates: { lat: 12.9154, lng: 77.6098 },
      riskLevel: 'high',
      riskFactors: ['Low foot traffic', 'Poor lighting at night']
    }
  ];

  private mockHistoricalIncidents = [
    { 
      id: 1, 
      location: { lat: 12.9235, lng: 77.5872 },
      time: '22:00-23:00',
      type: 'harassment'
    },
    { 
      id: 2, 
      location: { lat: 12.9456, lng: 77.5678 },
      time: '01:00-02:00',
      type: 'theft'
    }
  ];

  async analyzeRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }, timeOfDay: 'day' | 'night' = 'day') {
    // In a real implementation, this would call an AI model
    // For demo purposes, we'll simulate the analysis
    
    // Calculate mock safety score (70-100)
    const baseScore = Math.floor(Math.random() * 30) + 70;
    
    // Adjust based on time of day
    let timeAdjustment = 0;
    if (timeOfDay === 'night') {
      timeAdjustment = -15;
    }
    
    // Check for risk zones along route
    const routeRiskZones = this.getRiskZonesAlongRoute(start, end);
    const riskZoneAdjustment = routeRiskZones.length * -5;
    
    // Check for historical incidents
    const incidentAdjustment = this.getIncidentsAlongRoute(start, end) * -3;
    
    const finalScore = Math.max(30, Math.min(100, baseScore + timeAdjustment + riskZoneAdjustment + incidentAdjustment));
    
    return {
      safetyScore: finalScore,
      riskLevel: this.getRiskLevel(finalScore),
      riskZones: routeRiskZones,
      timeRisk: timeOfDay === 'night' ? 'High' : 'Low',
      lighting: finalScore > 85 ? 'Good' : finalScore > 70 ? 'Moderate' : 'Poor',
      crowdDensity: finalScore > 80 ? 'High' : finalScore > 60 ? 'Medium' : 'Low',
      saferAlternatives: this.getSaferAlternatives(start, end, finalScore)
    };
  }

  private getRiskZonesAlongRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }) {
    // Simple proximity check for demo
    return this.mockRiskZones.filter(zone => {
      const distanceToStart = this.calculateDistance(
        start.lat, start.lng, 
        zone.coordinates.lat, zone.coordinates.lng
      );
      
      const distanceToEnd = this.calculateDistance(
        end.lat, end.lng, 
        zone.coordinates.lat, zone.coordinates.lng
      );
      
      // If within 500m of either start or end point
      return distanceToStart < 500 || distanceToEnd < 500;
    });
  }

  private getIncidentsAlongRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }) {
    // Simple proximity check for demo
    return this.mockHistoricalIncidents.filter(incident => {
      const distanceToStart = this.calculateDistance(
        start.lat, start.lng, 
        incident.location.lat, incident.location.lng
      );
      
      const distanceToEnd = this.calculateDistance(
        end.lat, end.lng, 
        incident.location.lat, incident.location.lng
      );
      
      // If within 300m of either start or end point
      return distanceToStart < 300 || distanceToEnd < 300;
    }).length;
  }

  private getSaferAlternatives(start: { lat: number, lng: number }, end: { lat: number, lng: number }, currentScore: number) {
    if (currentScore > 80) return []; // Already safe enough
    
    // Generate 2 alternative routes with better scores
    return [
      {
        name: 'Main Road Route',
        safetyScore: Math.min(100, currentScore + 15),
        distance: '2.8 km',
        duration: '32 mins'
      },
      {
        name: 'Market Street Route',
        safetyScore: Math.min(100, currentScore + 10),
        distance: '3.1 km',
        duration: '35 mins'
      }
    ];
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score > 85) return 'low';
    if (score > 70) return 'medium';
    return 'high';
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