import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export interface UserData {
  id: string;
  name: string;
  soberStartDate: string;
  dailyExpense: number;
  goals: string[];
  notifications: {
    dailyMotivation: boolean;
    cravingReminders: boolean;
    milestoneAlerts: boolean;
  };
  privacy: {
    anonymousMode: boolean;
    dataSharing: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Craving {
  id: string;
  timestamp: Date;
  intensity: number;
  trigger: string;
  actionTaken: string;
  notes: string;
}

const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  CRAVINGS: 'cravings_data',
  ENCRYPTION_KEY: 'encryption_key',
};

class DataManagerClass {
  private encryptionKey: string | null = null;

  async initialize() {
    try {
      let key = await SecureStore.getItemAsync(STORAGE_KEYS.ENCRYPTION_KEY);
      if (!key) {
        // Generate new encryption key
        key = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `${Date.now()}_${Math.random()}`
        );
        await SecureStore.setItemAsync(STORAGE_KEYS.ENCRYPTION_KEY, key);
      }
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Failed to initialize secure storage');
    }
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }
    
    // Simple encoding for demo - in production, use proper encryption
    const encoded = btoa(data);
    return encoded;
  }

  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }
    
    try {
      const decoded = atob(encryptedData);
      return decoded;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  async getUserData(): Promise<UserData> {
    try {
      const encryptedData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      if (!encryptedData) {
        // Return default user data
        return {
          id: await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            `user_${Date.now()}`
          ),
          name: '',
          soberStartDate: '',
          dailyExpense: 200,
          goals: [],
          notifications: {
            dailyMotivation: true,
            cravingReminders: true,
            milestoneAlerts: true,
          },
          privacy: {
            anonymousMode: true,
            dataSharing: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const decryptedData = await this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw new Error('Failed to retrieve user data');
    }
  }

  async updateUserData(userData: Partial<UserData>): Promise<void> {
    try {
      const currentData = await this.getUserData();
      const updatedData = {
        ...currentData,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      const encryptedData = await this.encrypt(JSON.stringify(updatedData));
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, encryptedData);
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  async getCravings(): Promise<Craving[]> {
    try {
      const encryptedData = await SecureStore.getItemAsync(STORAGE_KEYS.CRAVINGS);
      if (!encryptedData) {
        return [];
      }

      const decryptedData = await this.decrypt(encryptedData);
      const cravings = JSON.parse(decryptedData);
      
      // Convert timestamp strings back to Date objects
      return cravings.map((craving: any) => ({
        ...craving,
        timestamp: new Date(craving.timestamp),
      }));
    } catch (error) {
      console.error('Failed to get cravings:', error);
      return [];
    }
  }

  async addCraving(craving: Craving): Promise<void> {
    try {
      const currentCravings = await this.getCravings();
      const updatedCravings = [craving, ...currentCravings];

      // Keep only the last 100 cravings to manage storage
      const trimmedCravings = updatedCravings.slice(0, 100);

      const encryptedData = await this.encrypt(JSON.stringify(trimmedCravings));
      await SecureStore.setItemAsync(STORAGE_KEYS.CRAVINGS, encryptedData);
    } catch (error) {
      console.error('Failed to add craving:', error);
      throw new Error('Failed to save craving data');
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CRAVINGS);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ENCRYPTION_KEY);
      this.encryptionKey = null;
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  // PDPA Compliance methods
  async exportUserData(): Promise<string> {
    try {
      const userData = await this.getUserData();
      const cravings = await this.getCravings();
      
      const exportData = {
        userData,
        cravings,
        exportedAt: new Date().toISOString(),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export user data');
    }
  }

  async getDataProcessingConsent(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      return userData.privacy?.dataSharing || false;
    } catch (error) {
      console.error('Failed to get consent status:', error);
      return false;
    }
  }

  async updateDataProcessingConsent(consent: boolean): Promise<void> {
    try {
      const userData = await this.getUserData();
      userData.privacy = {
        ...userData.privacy,
        dataSharing: consent,
      };
      await this.updateUserData(userData);
    } catch (error) {
      console.error('Failed to update consent:', error);
      throw new Error('Failed to update consent status');
    }
  }

  async storeSecureData(key: string, data: string): Promise<void> {
    try {
      const encryptedData = await this.encrypt(data);
      await SecureStore.setItemAsync(`app_${key}`, encryptedData);
    } catch (error) {
      console.error(`Failed to store secure data for key ${key}:`, error);
      throw new Error(`Failed to store secure data: ${key}`);
    }
  }

  async getSecureData(key: string): Promise<string | null> {
    try {
      const encryptedData = await SecureStore.getItemAsync(`app_${key}`);
      if (!encryptedData) return null;
      
      return await this.decrypt(encryptedData);
    } catch (error) {
      console.error(`Failed to get secure data for key ${key}:`, error);
      return null;
    }
  }

  async removeSecureData(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(`app_${key}`);
    } catch (error) {
      console.error(`Failed to remove secure data for key ${key}:`, error);
      throw new Error(`Failed to remove secure data: ${key}`);
    }
  }
}

export const DataManager = new DataManagerClass();