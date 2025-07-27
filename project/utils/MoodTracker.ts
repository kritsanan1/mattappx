import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export interface MoodEntry {
  id: string;
  timestamp: Date;
  mood: 'very_sad' | 'sad' | 'neutral' | 'happy' | 'very_happy';
  energy: number; // 1-10
  stress: number; // 1-10
  notes?: string;
  triggers?: string[];
}

export interface MoodStats {
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  commonTriggers: string[];
}

const MOOD_STORAGE_KEY = 'mood_entries';

class MoodTrackerClass {
  private encryptionKey: string | null = null;

  async initialize() {
    try {
      let key = await SecureStore.getItemAsync('mood_encryption_key');
      if (!key) {
        key = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `mood_${Date.now()}_${Math.random()}`
        );
        await SecureStore.setItemAsync('mood_encryption_key', key);
      }
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize mood tracker:', error);
      throw new Error('Failed to initialize mood tracking');
    }
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }
    return btoa(data);
  }

  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }
    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt mood data');
    }
  }

  async addMoodEntry(entry: Omit<MoodEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const moodEntry: MoodEntry = {
        id: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `mood_${Date.now()}_${Math.random()}`
        ),
        timestamp: new Date(),
        ...entry
      };

      const existingEntries = await this.getMoodEntries();
      const updatedEntries = [moodEntry, ...existingEntries].slice(0, 100); // Keep last 100 entries

      const encryptedData = await this.encrypt(JSON.stringify(updatedEntries));
      await SecureStore.setItemAsync(MOOD_STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to add mood entry:', error);
      throw new Error('Failed to save mood entry');
    }
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    try {
      const encryptedData = await SecureStore.getItemAsync(MOOD_STORAGE_KEY);
      if (!encryptedData) {
        return [];
      }

      const decryptedData = await this.decrypt(encryptedData);
      const entries = JSON.parse(decryptedData);
      
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    } catch (error) {
      console.error('Failed to get mood entries:', error);
      return [];
    }
  }

  async getMoodStats(days: number = 30): Promise<MoodStats> {
    try {
      const entries = await this.getMoodEntries();
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const recentEntries = entries.filter(entry => new Date(entry.timestamp) >= cutoffDate);

      if (recentEntries.length === 0) {
        return {
          averageMood: 0,
          averageEnergy: 0,
          averageStress: 0,
          moodTrend: 'stable',
          commonTriggers: []
        };
      }

      const moodValues = recentEntries.map(entry => this.moodToNumber(entry.mood));
      const averageMood = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
      const averageEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length;
      const averageStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length;

      // Calculate trend
      const firstHalf = moodValues.slice(0, Math.floor(moodValues.length / 2));
      const secondHalf = moodValues.slice(Math.floor(moodValues.length / 2));
      const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

      let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (secondHalfAvg > firstHalfAvg + 0.3) {
        moodTrend = 'improving';
      } else if (secondHalfAvg < firstHalfAvg - 0.3) {
        moodTrend = 'declining';
      }

      // Common triggers
      const triggerCounts: { [key: string]: number } = {};
      recentEntries.forEach(entry => {
        entry.triggers?.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      });

      const commonTriggers = Object.keys(triggerCounts)
        .sort((a, b) => triggerCounts[b] - triggerCounts[a])
        .slice(0, 5);

      return {
        averageMood,
        averageEnergy,
        averageStress,
        moodTrend,
        commonTriggers
      };
    } catch (error) {
      console.error('Failed to get mood stats:', error);
      return {
        averageMood: 0,
        averageEnergy: 0,
        averageStress: 0,
        moodTrend: 'stable',
        commonTriggers: []
      };
    }
  }

  private moodToNumber(mood: MoodEntry['mood']): number {
    const moodMap = {
      'very_sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very_happy': 5
    };
    return moodMap[mood];
  }

  getMoodEmoji(mood: MoodEntry['mood']): string {
    const emojiMap = {
      'very_sad': '😢',
      'sad': '😔',
      'neutral': '😐',
      'happy': '😊',
      'very_happy': '😄'
    };
    return emojiMap[mood];
  }

  getMoodLabel(mood: MoodEntry['mood']): string {
    const labelMap = {
      'very_sad': 'เศร้ามาก',
      'sad': 'เศร้า',
      'neutral': 'ปกติ',
      'happy': 'ดี',
      'very_happy': 'ดีมาก'
    };
    return labelMap[mood];
  }

  async clearAllMoodData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(MOOD_STORAGE_KEY);
      await SecureStore.deleteItemAsync('mood_encryption_key');
      this.encryptionKey = null;
    } catch (error) {
      console.error('Failed to clear mood data:', error);
      throw new Error('Failed to clear mood data');
    }
  }
}

export const MoodTracker = new MoodTrackerClass();