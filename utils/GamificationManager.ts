import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'sobriety' | 'engagement' | 'support' | 'milestone';
  requirement: {
    type: 'days_sober' | 'cravings_logged' | 'community_posts' | 'mood_entries' | 'resources_accessed';
    value: number;
  };
  earnedAt?: Date;
  isEarned: boolean;
}

export interface Achievement {
  id: string;
  badgeId: string;
  earnedAt: Date;
  points: number;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: {
    currentSoberStreak: number;
    longestSoberStreak: number;
    dailyCheckInStreak: number;
  };
}

const GAMIFICATION_STORAGE_KEY = 'gamification_data';

class GamificationManagerClass {
  private encryptionKey: string | null = null;

  private defaultBadges: Omit<Badge, 'isEarned' | 'earnedAt'>[] = [
    {
      id: 'first_day',
      name: 'เริ่มต้นใหม่',
      description: 'วันแรกที่สะอาด',
      icon: '🌱',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 1 }
    },
    {
      id: 'week_warrior',
      name: 'นักสู้สัปดาห์',
      description: 'สะอาด 7 วัน',
      icon: '💪',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 7 }
    },
    {
      id: 'month_master',
      name: 'เจ้าแห่งเดือน',
      description: 'สะอาด 30 วัน',
      icon: '🏆',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 30 }
    },
    {
      id: 'quarter_champion',
      name: 'แชมป์ไตรมาส',
      description: 'สะอาด 90 วัน',
      icon: '🥇',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 90 }
    },
    {
      id: 'half_year_hero',
      name: 'ฮีโร่ครึ่งปี',
      description: 'สะอาด 180 วัน',
      icon: '⭐',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 180 }
    },
    {
      id: 'year_legend',
      name: 'ตำนานแห่งปี',
      description: 'สะอาด 365 วัน',
      icon: '👑',
      category: 'sobriety',
      requirement: { type: 'days_sober', value: 365 }
    },
    {
      id: 'craving_tracker',
      name: 'นักติดตามความอยาก',
      description: 'บันทึกความอยาก 10 ครั้ง',
      icon: '📊',
      category: 'engagement',
      requirement: { type: 'cravings_logged', value: 10 }
    },
    {
      id: 'craving_master',
      name: 'เจ้าแห่งการควบคุม',
      description: 'บันทึกความอยาก 50 ครั้ง',
      icon: '🎯',
      category: 'engagement',
      requirement: { type: 'cravings_logged', value: 50 }
    },
    {
      id: 'community_supporter',
      name: 'ผู้สนับสนุนชุมชน',
      description: 'โพสต์ในชุมชน 5 ครั้ง',
      icon: '🤝',
      category: 'support',
      requirement: { type: 'community_posts', value: 5 }
    },
    {
      id: 'mood_tracker',
      name: 'นักติดตามอารมณ์',
      description: 'บันทึกอารมณ์ 30 ครั้ง',
      icon: '😊',
      category: 'engagement',
      requirement: { type: 'mood_entries', value: 30 }
    },
    {
      id: 'resource_explorer',
      name: 'นักสำรวจทรัพยากร',
      description: 'เข้าถึงทรัพยากร 20 ครั้ง',
      icon: '📚',
      category: 'engagement',
      requirement: { type: 'resources_accessed', value: 20 }
    }
  ];

  async initialize() {
    try {
      let key = await SecureStore.getItemAsync('gamification_encryption_key');
      if (!key) {
        key = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          `gamification_${Date.now()}_${Math.random()}`
        );
        await SecureStore.setItemAsync('gamification_encryption_key', key);
      }
      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to initialize gamification:', error);
      throw new Error('Failed to initialize gamification system');
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
      throw new Error('Failed to decrypt gamification data');
    }
  }

  async getUserProgress(): Promise<UserProgress> {
    try {
      const encryptedData = await SecureStore.getItemAsync(GAMIFICATION_STORAGE_KEY);
      if (!encryptedData) {
        return this.createInitialProgress();
      }

      const decryptedData = await this.decrypt(encryptedData);
      const progress = JSON.parse(decryptedData);
      
      // Convert date strings back to Date objects
      progress.achievements = progress.achievements.map((achievement: any) => ({
        ...achievement,
        earnedAt: new Date(achievement.earnedAt)
      }));

      progress.badges = progress.badges.map((badge: any) => ({
        ...badge,
        earnedAt: badge.earnedAt ? new Date(badge.earnedAt) : undefined
      }));

      return progress;
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return this.createInitialProgress();
    }
  }

  private createInitialProgress(): UserProgress {
    return {
      totalPoints: 0,
      level: 1,
      badges: this.defaultBadges.map(badge => ({
        ...badge,
        isEarned: false
      })),
      achievements: [],
      streaks: {
        currentSoberStreak: 0,
        longestSoberStreak: 0,
        dailyCheckInStreak: 0
      }
    };
  }

  async updateProgress(stats: {
    soberDays: number;
    cravingsLogged: number;
    communityPosts: number;
    moodEntries: number;
    resourcesAccessed: number;
  }): Promise<{ newBadges: Badge[], pointsEarned: number }> {
    try {
      const progress = await this.getUserProgress();
      const newBadges: Badge[] = [];
      let pointsEarned = 0;

      // Check each badge for completion
      progress.badges.forEach(badge => {
        if (!badge.isEarned) {
          let isEarned = false;
          
          switch (badge.requirement.type) {
            case 'days_sober':
              isEarned = stats.soberDays >= badge.requirement.value;
              break;
            case 'cravings_logged':
              isEarned = stats.cravingsLogged >= badge.requirement.value;
              break;
            case 'community_posts':
              isEarned = stats.communityPosts >= badge.requirement.value;
              break;
            case 'mood_entries':
              isEarned = stats.moodEntries >= badge.requirement.value;
              break;
            case 'resources_accessed':
              isEarned = stats.resourcesAccessed >= badge.requirement.value;
              break;
          }

          if (isEarned) {
            badge.isEarned = true;
            badge.earnedAt = new Date();
            newBadges.push(badge);

            // Award points based on badge category
            const points = this.getBadgePoints(badge);
            pointsEarned += points;

            // Create achievement record
            const achievement: Achievement = {
              id: `achievement_${Date.now()}_${Math.random()}`,
              badgeId: badge.id,
              earnedAt: new Date(),
              points
            };
            progress.achievements.push(achievement);
          }
        }
      });

      // Update total points and level
      progress.totalPoints += pointsEarned;
      progress.level = this.calculateLevel(progress.totalPoints);

      // Update streaks
      progress.streaks.currentSoberStreak = stats.soberDays;
      progress.streaks.longestSoberStreak = Math.max(
        progress.streaks.longestSoberStreak,
        stats.soberDays
      );

      // Save updated progress
      const encryptedData = await this.encrypt(JSON.stringify(progress));
      await SecureStore.setItemAsync(GAMIFICATION_STORAGE_KEY, encryptedData);

      return { newBadges, pointsEarned };
    } catch (error) {
      console.error('Failed to update progress:', error);
      return { newBadges: [], pointsEarned: 0 };
    }
  }

  private getBadgePoints(badge: Badge): number {
    const pointsMap = {
      'sobriety': 100,
      'engagement': 50,
      'support': 75,
      'milestone': 150
    };
    return pointsMap[badge.category] || 50;
  }

  private calculateLevel(totalPoints: number): number {
    // Level up every 500 points
    return Math.floor(totalPoints / 500) + 1;
  }

  async getLeaderboard(): Promise<Array<{ level: number; points: number; badges: number }>> {
    // In a real app, this would fetch from a server
    // For now, return mock data
    return [
      { level: 5, points: 2500, badges: 8 },
      { level: 4, points: 2000, badges: 6 },
      { level: 3, points: 1500, badges: 5 },
      { level: 3, points: 1200, badges: 4 },
      { level: 2, points: 800, badges: 3 }
    ];
  }

  async clearAllGamificationData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(GAMIFICATION_STORAGE_KEY);
      await SecureStore.deleteItemAsync('gamification_encryption_key');
      this.encryptionKey = null;
    } catch (error) {
      console.error('Failed to clear gamification data:', error);
      throw new Error('Failed to clear gamification data');
    }
  }
}

export const GamificationManager = new GamificationManagerClass();