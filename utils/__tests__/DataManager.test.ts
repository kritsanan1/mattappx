
import { DataManager } from '../DataManager';
import * as SecureStore from 'expo-secure-store';

// Mock SecureStore
jest.mock('expo-secure-store');
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('DataManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUserData', () => {
    it('should save user data to secure store', async () => {
      const userData = {
        name: 'Test User',
        soberStartDate: '2024-01-01',
        goals: ['Stay sober', 'Exercise daily'],
      };

      mockSecureStore.setItemAsync.mockResolvedValue();

      await DataManager.saveUserData(userData);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(userData)
      );
    });

    it('should handle save errors gracefully', async () => {
      const userData = { name: 'Test User' };
      const error = new Error('Storage error');
      
      mockSecureStore.setItemAsync.mockRejectedValue(error);

      await expect(DataManager.saveUserData(userData)).rejects.toThrow('Storage error');
    });
  });

  describe('getUserData', () => {
    it('should retrieve and parse user data', async () => {
      const userData = {
        name: 'Test User',
        soberStartDate: '2024-01-01',
        goals: ['Stay sober'],
      };

      mockSecureStore.getItemAsync.mockResolvedValue(JSON.stringify(userData));

      const result = await DataManager.getUserData();

      expect(result).toEqual(userData);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('userData');
    });

    it('should return null when no data exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await DataManager.getUserData();

      expect(result).toBeNull();
    });
  });
});
