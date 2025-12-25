# ZenSethu AI - Safety & Wellbeing App

ZenSethu AI is a proactive safety application designed for girls and young individuals in India. The app predicts danger before it happens using AI-powered analysis and sensor-based detection, without requiring manual SOS activation.

## Features

### 1. AI Safe Route & Risk Prediction
- Generates a Safe Route Score before travel begins
- Analyzes lighting levels, crowd density, time of travel, and historical incident patterns
- Suggests safer alternative routes with warnings

### 2. Behaviour-Aware Distress Detection
- Uses phone sensors (accelerometer, gyroscope, GPS) to detect:
  - Abrupt stopping
  - Panic-like shaking
  - Unusually slow movement
  - Route deviation
  - Sudden pulling or erratic motion
- Auto-triggers alerts without user input when multiple signals combine

### 3. Guardian Circle Auto-Alert
- Sends live location, risk level, and route deviation info to pre-approved guardians
- Includes short ambient audio clip (3 seconds) for context

### 4. CalmCheck - Emotional Wellbeing
- Detects hesitation or anxiety patterns during travel
- Provides breathing cues and reassurance prompts
- Offers simple mood check-ins
- Optional wellness alert to guardian (with consent)

### 5. Safety & Wellness Heatmaps
- Generates anonymized heatmaps showing unsafe zones
- Uses aggregated behavior + route data
- No personal identification

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Navigation**: React Navigation
- **Sensors**: Expo Sensors (Accelerometer, Gyroscope, Location)
- **State Management**: React Context API
- **UI Components**: Native Base & Custom Components
- **Maps**: Mapbox (placeholder implementation)
- **Backend**: Firebase (conceptual, mock services used in prototype)

## App Architecture

### Core Modules
1. **Sensor Service** - Handles accelerometer, gyroscope, and location data
2. **Route Safety Service** - Analyzes routes and provides safety scores
3. **Alert Service** - Manages emergency notifications to guardians
4. **App Context** - Centralized state management

### UI Components
- Home Screen - Dashboard with safety status
- Route Screen - Plan safe routes with risk analysis
- Map Screen - Interactive map with safety heatmap
- Wellbeing Screen - Mood tracking and breathing exercises
- Profile Screen - Guardian management and settings
- Alert Screen - Emergency alert interface

## Privacy & Security

- Privacy-first design with minimal data collection
- All processing happens on-device (no cloud dependency for core features)
- Location data is only shared during emergencies with explicit consent
- Guardian information is stored locally

## Future Enhancements

1. Integration with actual AI models for route safety analysis
2. Wearable device support for enhanced sensor data
3. Community reporting features for crowd-sourced safety data
4. Offline functionality for all critical features
5. Multi-language support for wider accessibility in India
6. Integration with local emergency services

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Run on Android: `npm run android`
5. Run on iOS: `npm run ios`

## Contributing

This is a prototype built for demonstration purposes. Contributions are welcome to enhance the functionality and prepare it for production use.

## License

This project is licensed under the MIT License - see the LICENSE file for details.