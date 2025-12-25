import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen';
import { RouteScreen } from './screens/RouteScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MapScreen } from './screens/MapScreen';
import { AlertScreen } from './screens/AlertScreen';
import { WellbeingScreen } from './screens/WellbeingScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './contexts/AppContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Routes') iconName = 'navigate';
        else if (route.name === 'Map') iconName = 'map';
        else if (route.name === 'Wellbeing') iconName = 'heart';
        else if (route.name === 'Profile') iconName = 'person';
        
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Routes" component={RouteScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Wellbeing" component={WellbeingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Alert" 
            component={AlertScreen} 
            options={{ title: 'Emergency Alert' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}