import { DataManager } from './DataManager';

export interface MoodEntry {
  id: string;
  mood: number; // 1-5 scale
  date: string;
  notes?: string;
  triggers?: string[];
  activities?: string[];
  intensity?: number; // 1-10 scale for mood intensity
}

export class MoodTracker {
  private static readonly STORAGE_KEY = 'mood_entries';
  private static readonly TRIGGERS_KEY = 'mood_triggers';
  private static readonly PATTERNS_KEY = 'mood_patterns';

  static async logMood(mood: number, triggers?: string[], notes?: string, activities?: string[], intensity?: number): Promise<MoodEntry> {
    try {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        date: new Date().toISOString(),
        notes,
        triggers,
        activities,
        intensity: intensity || mood,
      };

      const existingEntries = await this.getMoodHistory();

      // Check if there's already an entry for today and update it
      const today = new Date().toDateString();
      const todayEntryIndex = existingEntries.findIndex(e => 
        new Date(e.date).toDateString() === today
      );

      if (todayEntryIndex >= 0) {
        existingEntries[todayEntryIndex] = entry;
      } else {
        existingEntries.unshift(entry);
      }

      await DataManager.storeSecureData(this.STORAGE_KEY, JSON.stringify(existingEntries));

      // Update trigger frequency
      if (triggers && triggers.length > 0) {
        await this.updateTriggerFrequency(triggers);
      }

      return entry;
    } catch (error) {
      console.error('Error logging mood:', error);
      throw error;
    }
  }

  static async quickMoodEntry(): Promise<MoodEntry> {
    // Quick entry with just a mood rating
    const mood = 3; // Default neutral mood
    return this.logMood(mood);
  }

  static async getMoodHistory(days?: number): Promise<MoodEntry[]> {
    try {
      const data = await DataManager.getSecureData(this.STORAGE_KEY);
      if (!data) return [];

      const entries: MoodEntry[] = JSON.parse(data);

      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return entries.filter(entry => new Date(entry.date) >= cutoffDate);
      }

      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting mood history:', error);
      return [];
    }
  }

  static async getTodayMood(): Promise<MoodEntry | null> {
    try {
      const entries = await this.getMoodHistory();
      const today = new Date().toDateString();

      return entries.find(entry => 
        new Date(entry.date).toDateString() === today
      ) || null;
    } catch (error) {
      console.error('Error getting today mood:', error);
      return null;
    }
  }

  static async getMoodAverage(days: number = 7): Promise<number> {
    try {
      const entries = await this.getMoodHistory(days);
      if (entries.length === 0) return 0;

      const sum = entries.reduce((total, entry) => total + entry.mood, 0);
      return Math.round((sum / entries.length) * 10) / 10;
    } catch (error) {
      console.error('Error calculating mood average:', error);
      return 0;
    }
  }

  static async getMoodTrend(days: number = 14): Promise<'improving' | 'declining' | 'stable'> {
    try {
      const entries = await this.getMoodHistory(days);
      if (entries.length < 3) return 'stable';

      const recentAvg = entries.slice(0, Math.floor(entries.length / 2))
        .reduce((sum, entry) => sum + entry.mood, 0) / Math.floor(entries.length / 2);

      const olderAvg = entries.slice(Math.floor(entries.length / 2))
        .reduce((sum, entry) => sum + entry.mood, 0) / Math.ceil(entries.length / 2);

      const difference = recentAvg - olderAvg;

      if (difference > 0.3) return 'improving';
      if (difference < -0.3) return 'declining';
      return 'stable';
    } catch (error) {
      console.error('Error calculating mood trend:', error);
      return 'stable';
    }
  }

  static async getTopTriggers(limit: number = 5): Promise<Array<{trigger: string, count: number}>> {
    try {
      const data = await DataManager.getSecureData(this.TRIGGERS_KEY);
      if (!data) return [];

      const triggers: {[key: string]: number} = JSON.parse(data);
      return Object.entries(triggers)
        .map(([trigger, count]) => ({ trigger, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top triggers:', error);
      return [];
    }
  }

  private static async updateTriggerFrequency(triggers: string[]): Promise<void> {
    try {
      const data = await DataManager.getSecureData(this.TRIGGERS_KEY);
      const triggerCounts: {[key: string]: number} = data ? JSON.parse(data) : {};

      triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });

      await DataManager.storeSecureData(this.TRIGGERS_KEY, JSON.stringify(triggerCounts));
    } catch (error) {
      console.error('Error updating trigger frequency:', error);
    }
  }

  static async getWeeklyMoodPattern(): Promise<{[key: string]: number}> {
    try {
      const entries = await this.getMoodHistory(28); // Last 4 weeks
      const dayPattern: {[key: string]: number[]} = {
        'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [],
        'Thursday': [], 'Friday': [], 'Saturday': []
      };

      entries.forEach(entry => {
        const dayName = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
        dayPattern[dayName].push(entry.mood);
      });

      const averages: {[key: string]: number} = {};
      Object.entries(dayPattern).forEach(([day, moods]) => {
        averages[day] = moods.length > 0 
          ? Math.round((moods.reduce((sum, mood) => sum + mood, 0) / moods.length) * 10) / 10
          : 0;
      });

      return averages;
    } catch (error) {
      console.error('Error getting weekly mood pattern:', error);
      return {};
    }
  }

  static async deleteMoodEntry(entryId: string): Promise<void> {
    try {
      const entries = await this.getMoodHistory();
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      await DataManager.storeSecureData(this.STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  }

  static async exportMoodData(): Promise<string> {
    try {
      const entries = await this.getMoodHistory();
      return JSON.stringify(entries, null, 2);
    } catch (error) {
      console.error('Error exporting mood data:', error);
      throw error;
    }
  }
}