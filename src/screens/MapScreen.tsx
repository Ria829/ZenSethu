import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const MapScreen = () => {
  const [mapMode, setMapMode] = useState('safety');
  const [legendVisible, setLegendVisible] = useState(true);

  // Mock heatmap data
  const heatmapData = [
    { id: 1, name: 'Railway Station', risk: 'high', coordinates: { lat: 12.9716, lng: 77.5946 } },
    { id: 2, name: 'College Campus', risk: 'low', coordinates: { lat: 12.9352, lng: 77.6214 } },
    { id: 3, name: 'Market Street', risk: 'medium', coordinates: { lat: 12.9154, lng: 77.6098 } },
    { id: 4, name: 'Park Area', risk: 'high', coordinates: { lat: 12.9235, lng: 77.5872 } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Map placeholder - in a real app this would be a map component */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Interactive Map with Safety Heatmap</Text>
          <Ionicons name="map" size={64} color="#3B82F6" />
        </View>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="add" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="remove" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="locate" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Legend */}
      {legendVisible && (
        <View style={styles.legend}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>Safety Legend</Text>
            <TouchableOpacity onPress={() => setLegendVisible(false)}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Safe Areas</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.legendText}>Medium Risk</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>High Risk</Text>
            </View>
          </View>
        </View>
      )}
      
      {!legendVisible && (
        <TouchableOpacity 
          style={styles.showLegendButton}
          onPress={() => setLegendVisible(true)}
        >
          <Ionicons name="information-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Risk Zones List */}
      <View style={styles.riskZonesContainer}>
        <Text style={styles.sectionTitle}>Nearby Risk Zones</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {heatmapData.map((zone) => (
            <View 
              key={zone.id} 
              style={[
                styles.zoneCard,
                { 
                  borderLeftColor: zone.risk === 'high' ? '#EF4444' : 
                                  zone.risk === 'medium' ? '#F59E0B' : '#10B981'
                }
              ]}
            >
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={[
                styles.zoneRisk,
                { 
                  color: zone.risk === 'high' ? '#EF4444' : 
                         zone.risk === 'medium' ? '#F59E0B' : '#10B981'
                }
              ]}>
                {zone.risk.charAt(0).toUpperCase() + zone.risk.slice(1)} Risk
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 16,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  legend: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  showLegendButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  riskZonesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  zoneCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderLeftWidth: 4,
    width: 150,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  zoneRisk: {
    fontSize: 12,
    fontWeight: '500',
  },
});