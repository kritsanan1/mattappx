
import { MoodTracker } from '../MoodTracker';

describe('MoodTracker', () => {
  beforeEach(() => {
    // Clear any existing data
    jest.clearAllMocks();
  });

  describe('addMoodEntry', () => {
    it('should add a new mood entry', async () => {
      const moodEntry = {
        mood: 8,
        energy: 7,
        anxiety: 3,
        notes: 'Feeling great today!',
        timestamp: new Date().toISOString(),
      };

      const result = await MoodTracker.addMoodEntry(moodEntry);

      expect(result).toBe(true);
    });

    it('should validate mood range', async () => {
      const invalidMoodEntry = {
        mood: 15, // Invalid range
        energy: 7,
        anxiety: 3,
        notes: 'Test',
        timestamp: new Date().toISOString(),
      };

      await expect(MoodTracker.addMoodEntry(invalidMoodEntry)).rejects.toThrow(
        'Mood value must be between 1 and 10'
      );
    });
  });

  describe('getMoodHistory', () => {
    it('should return mood history for specified days', async () => {
      // This would normally interact with stored data
      const result = await MoodTracker.getMoodHistory(7);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('calculateAverageMood', () => {
    it('should calculate correct average mood', () => {
      const moodEntries = [
        { mood: 8, energy: 7, anxiety: 3, notes: '', timestamp: '2024-01-01' },
        { mood: 6, energy: 5, anxiety: 4, notes: '', timestamp: '2024-01-02' },
        { mood: 9, energy: 8, anxiety: 2, notes: '', timestamp: '2024-01-03' },
      ];

      const average = MoodTracker.calculateAverageMood(moodEntries);

      expect(average).toBeCloseTo(7.67, 2);
    });

    it('should return 0 for empty array', () => {
      const average = MoodTracker.calculateAverageMood([]);

      expect(average).toBe(0);
    });
  });
});
