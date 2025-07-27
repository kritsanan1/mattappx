
import '@testing-library/jest-native/extend-expect';

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock React Native core modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
}));

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

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Lucide React Native icons
jest.mock('lucide-react-native', () => ({
  Home: jest.fn(() => 'MockedHomeIcon'),
  TrendingUp: jest.fn(() => 'MockedTrendingUpIcon'),
  Heart: jest.fn(() => 'MockedHeartIcon'),
  Brain: jest.fn(() => 'MockedBrainIcon'),
  Users: jest.fn(() => 'MockedUsersIcon'),
  BookOpen: jest.fn(() => 'MockedBookOpenIcon'),
  User: jest.fn(() => 'MockedUserIcon'),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  Tabs: jest.fn(({ children }) => children),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
