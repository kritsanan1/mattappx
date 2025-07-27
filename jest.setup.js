
import '@testing-library/jest-native/extend-expect';

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo modules
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

// Mock Lucide React Native icons
jest.mock('lucide-react-native', () => ({
  Home: 'MockedHomeIcon',
  TrendingUp: 'MockedTrendingUpIcon',
  Heart: 'MockedHeartIcon',
  Brain: 'MockedBrainIcon',
  Users: 'MockedUsersIcon',
  BookOpen: 'MockedBookOpenIcon',
  User: 'MockedUserIcon',
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
