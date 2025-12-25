import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const RouteScreen = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [safetyScore, setSafetyScore] = useState<number | null>(null);
  const [routeDetails, setRouteDetails] = useState<any>(null);

  // Mock route safety analysis
  const analyzeRoute = () => {
    if (!startLocation || !endLocation) {
      Alert.alert('Error', 'Please enter both start and end locations');
      return;
    }

    // Simulate route analysis
    const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const mockDetails = {
      distance: '2.5 km',
      duration: '30 mins',
      lighting: mockScore > 85 ? 'Good' : mockScore > 70 ? 'Moderate' : 'Poor',
      crowdDensity: mockScore > 80 ? 'High' : mockScore > 60 ? 'Medium' : 'Low',
      riskFactors: mockScore > 85 ? [] : 
                  mockScore > 70 ? ['Poor lighting in some areas'] : 
                  ['Poor lighting', 'Low crowd density', 'Late night travel'],
      saferAlternatives: mockScore < 80 ? [
        { name: 'Main Road Route', score: 92 },
        { name: 'Market Street Route', score: 87 }
      ] : []
    };

    setSafetyScore(mockScore);
    setRouteDetails(mockDetails);
  };

  const getSafetyColor = (score: number) => {
    if (score > 85) return '#10B981';
    if (score > 70) return '#F59E0B';
    return '#EF4444';
  };

  const getSafetyLabel = (score: number) => {
    if (score > 85) return 'Safe';
    if (score > 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>Plan Safe Route</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Start Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter starting point"
              value={startLocation}
              onChangeText={setStartLocation}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={endLocation}
              onChangeText={setEndLocation}
            />
          </View>
          
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeRoute}>
            <Text style={styles.analyzeButtonText}>Analyze Route Safety</Text>
          </TouchableOpacity>
        </View>

        {safetyScore !== null && (
          <View style={styles.resultCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreLabel}>Route Safety Score</Text>
              <View style={[styles.scoreBadge, { backgroundColor: getSafetyColor(safetyScore) }]}>
                <Text style={styles.scoreText}>{safetyScore}/100</Text>
              </View>
            </View>
            
            <Text style={[styles.safetyStatus, { color: getSafetyColor(safetyScore) }]}>
              {getSafetyLabel(safetyScore)}
            </Text>
            
            {routeDetails && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distance:</Text>
                  <Text style={styles.detailValue}>{routeDetails.distance}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estimated Time:</Text>
                  <Text style={styles.detailValue}>{routeDetails.duration}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lighting:</Text>
                  <Text style={[styles.detailValue, { color: routeDetails.lighting === 'Good' ? '#10B981' : routeDetails.lighting === 'Moderate' ? '#F59E0B' : '#EF4444' }]}>
                    {routeDetails.lighting}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Crowd Density:</Text>
                  <Text style={[styles.detailValue, { color: routeDetails.crowdDensity === 'High' ? '#10B981' : routeDetails.crowdDensity === 'Medium' ? '#F59E0B' : '#EF4444' }]}>
                    {routeDetails.crowdDensity}
                  </Text>
                </View>
                
                {routeDetails.riskFactors.length > 0 && (
                  <View style={styles.riskSection}>
                    <Text style={styles.riskTitle}>Risk Factors:</Text>
                    {routeDetails.riskFactors.map((factor: string, index: number) => (
                      <View key={index} style={styles.riskItem}>
                        <Ionicons name="warning" size={16} color="#F59E0B" />
                        <Text style={styles.riskText}>{factor}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {routeDetails.saferAlternatives.length > 0 && (
                  <View style={styles.alternativesSection}>
                    <Text style={styles.alternativesTitle}>Safer Alternatives:</Text>
                    {routeDetails.saferAlternatives.map((alt: any, index: number) => (
                      <View key={index} style={styles.alternativeItem}>
                        <View>
                          <Text style={styles.alternativeName}>{alt.name}</Text>
                          <Text style={styles.alternativeScore}>Safety Score: {alt.score}/100</Text>
                        </View>
                        <TouchableOpacity style={styles.selectButton}>
                          <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  analyzeButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
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
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  safetyStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  riskSection: {
    marginTop: 20,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  riskText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  alternativesSection: {
    marginTop: 20,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  alternativeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  alternativeScore: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});