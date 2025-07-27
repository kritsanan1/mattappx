# AI Assistant Rules for Thai Recovery App

This document outlines the technical stack and specific library usage guidelines for the Thai Recovery mobile application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React Native & Expo**: The core framework for building cross-platform mobile applications. Expo manages the development workflow and provides access to native device capabilities.
*   **TypeScript**: All application code is written in TypeScript for improved code quality, type safety, and developer experience.
*   **Expo Router & React Navigation**: Used for declarative routing and navigation within the application, managing screen transitions and tab navigation.
*   **React Native StyleSheet**: Styling is primarily handled using React Native's `StyleSheet.create` for component-specific styles.
*   **Lucide React Native**: Provides a consistent set of open-source icons for the user interface.
*   **Expo SecureStore & Expo Crypto**: Utilized for secure local data storage and cryptographic operations, ensuring sensitive user data is protected.
*   **Expo Notifications**: Manages local notifications for daily motivation, craving reminders, and milestone alerts.
*   **Supabase**: The backend-as-a-service solution for authentication, database management, and server-side edge functions.
*   **React Native Chart Kit**: Used for rendering charts and data visualizations, particularly for tracking user progress.

## Library Usage Rules

*   **UI Components**:
    *   Always use standard React Native components (`View`, `Text`, `TouchableOpacity`, `TextInput`, `ScrollView`, `Switch`, `Modal`, `SafeAreaView`).
    *   For styling, use `StyleSheet.create` as demonstrated in existing components.
    *   For icons, use components from `lucide-react-native`.
    *   For gradients, use `expo-linear-gradient`.
*   **Navigation**:
    *   All routing should be managed using `expo-router`.
    *   Tab-based navigation is configured in `app/(tabs)/_layout.tsx`.
    *   Stack navigation is configured in `app/_layout.tsx`.
*   **Data Management**:
    *   For all local data storage (user profiles, cravings), use the `DataManager` utility (`utils/DataManager.ts`), which leverages `expo-secure-store` and `expo-crypto`. Do not directly interact with `expo-secure-store` or `expo-crypto` outside of `DataManager.ts`.
    *   For backend data, authentication, and server-side logic, use Supabase. The Supabase client should be imported from `src/integrations/supabase/client.ts`.
*   **Notifications**:
    *   All notification scheduling and management should be done through the `NotificationManager` utility (`utils/NotificationManager.ts`), which wraps `expo-notifications`. Do not directly interact with `expo-notifications` outside of `NotificationManager.ts`.
*   **Charting**:
    *   If new charts or data visualizations are required, use `react-native-chart-kit` in conjunction with `react-native-svg`.
*   **General**:
    *   Prioritize creating small, focused components and utility files.
    *   Ensure all new files are placed in appropriate directories (e.g., `src/components/`, `src/pages/`, `utils/`, `hooks/`).
    *   Maintain consistency with existing code style and conventions.