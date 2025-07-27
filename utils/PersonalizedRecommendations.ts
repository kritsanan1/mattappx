
import { MoodTracker, MoodEntry } from './MoodTracker';
import { DataManager } from './DataManager';

export interface PersonalizedRecommendation {
  id: string;
  type: 'activity' | 'resource' | 'technique' | 'goal';
  category: 'immediate' | 'daily' | 'weekly' | 'long_term';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  personalizedReason: string;
  actionSteps: string[];
  successMetrics: string[];
  confidence: number;
}

export interface UserPreferences {
  preferredActivities: string[];
  availableTime: 'short' | 'medium' | 'long';
  difficultyPreference: 'easy' | 'mixed' | 'challenging';
  focusAreas: string[];
}

class PersonalizedRecommendationsClass {
  
  async generateRecommendations(currentMood?: number): Promise<PersonalizedRecommendation[]> {
    try {
      const moodHistory = await MoodTracker.getMoodHistory(14);
      const userData = await DataManager.getUserData();
      const userPreferences = await this.getUserPreferences();
      
      const recommendations: PersonalizedRecommendation[] = [];

      // Immediate mood-based recommendations
      if (currentMood && currentMood <= 2) {
        recommendations.push(...await this.getEmergencyRecommendations(moodHistory));
      }

      // Daily recommendations based on patterns
      recommendations.push(...await this.getDailyRecommendations(moodHistory, userPreferences));

      // Weekly goals and activities
      recommendations.push(...await this.getWeeklyRecommendations(moodHistory, userPreferences));

      // Long-term development suggestions
      recommendations.push(...await this.getLongTermRecommendations(moodHistory, userData));

      return recommendations.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  private async getEmergencyRecommendations(moodHistory: MoodEntry[]): Promise<PersonalizedRecommendation[]> {
    return [
      {
        id: `emergency_${Date.now()}_1`,
        type: 'technique',
        category: 'immediate',
        title: '🫁 การหายใจลึกแบบ 4-7-8',
        description: 'เทคนิคการหายใจที่ช่วยลดความเครียดทันที',
        difficulty: 'easy',
        duration: '5 นาที',
        personalizedReason: 'ใช้ได้ผลดีเมื่ออารมณ์ต่ำมาก',
        actionSteps: [
          'หายใจเข้าทางจมูก 4 วินาที',
          'กลั้นหายใจ 7 วินาที',
          'หายใจออกทางปาก 8 วินาที',
          'ทำซ้ำ 4 รอบ'
        ],
        successMetrics: ['รู้สึกสงบมากขึ้น', 'หัวใจเต้นช้าลง'],
        confidence: 95
      },
      {
        id: `emergency_${Date.now()}_2`,
        type: 'activity',
        category: 'immediate',
        title: '🚶‍♀️ เดินเร็วข้างนอก',
        description: 'การออกกำลังกายเบาช่วยปลดปล่อยเอนโดรฟิน',
        difficulty: 'easy',
        duration: '10-15 นาที',
        personalizedReason: 'การเคลื่อนไหวช่วยเปลี่ยนโฟกัสจากความคิดลบ',
        actionSteps: [
          'ออกจากสถานที่ปัจจุบัน',
          'เดินเร็วรอบบ้านหรือในสวน',
          'สังเกตสิ่งรอบตัว 5 อย่าง',
          'หายใจลึกขณะเดิน'
        ],
        successMetrics: ['รู้สึกสดชื่น', 'ความคิดใสขึ้น'],
        confidence: 90
      }
    ];
  }

  private async getDailyRecommendations(moodHistory: MoodEntry[], preferences: UserPreferences): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];
    const avgMood = moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length;

    // Morning routine recommendations
    if (avgMood < 3.5) {
      recommendations.push({
        id: `daily_${Date.now()}_1`,
        type: 'activity',
        category: 'daily',
        title: '🌅 กิจวัตรเช้าเพื่อจิตใจ',
        description: 'เริ่มต้นวันใหม่ด้วยกิจกรรมที่เสริมพลังใจ',
        difficulty: preferences.difficultyPreference === 'easy' ? 'easy' : 'medium',
        duration: preferences.availableTime === 'short' ? '10 นาที' : '20 นาที',
        personalizedReason: `อารมณ์เฉลี่ยของคุณคือ ${avgMood.toFixed(1)} การมีกิจวัตรเช้าจะช่วยเริ่มต้นวันได้ดีขึ้น`,
        actionSteps: [
          'ตื่นขึ้นมาดื่มน้ำ 1 แก้ว',
          'ยืดเส้นยืดสาย 5 นาที',
          'ทำสมาधิหรือระลึกถึงสิ่งดีๆ',
          'วางแผนสิ่งที่อยากทำในวันนี้'
        ],
        successMetrics: ['รู้สึกพร้อมสำหรับวันใหม่', 'มีพลังงานมากขึ้น'],
        confidence: 85
      });
    }

    // Evening reflection
    recommendations.push({
      id: `daily_${Date.now()}_2`,
      type: 'technique',
      category: 'daily',
      title: '🌙 การไตร่ตรองตอนเย็น',
      description: 'สรุปวันและเตรียมจิตใจสำหรับการพักผ่อน',
      difficulty: 'easy',
      duration: '10 นาที',
      personalizedReason: 'ช่วยประมวลผลอารมณ์และเรียนรู้จากประสบการณ์ในวัน',
      actionSteps: [
        'เขียนเหตุการณ์ดีๆ 3 อย่างในวันนี้',
        'ระบุความรู้สึกหลักที่เกิดขึ้น',
        'คิดถึงสิ่งที่เรียนรู้ใหม่',
        'ตั้งความตั้งใจสำหรับวันพรุ่งนี้'
      ],
      successMetrics: ['รู้สึกผ่อนคลาย', 'หลับได้ดีขึ้น'],
      confidence: 80
    });

    return recommendations;
  }

  private async getWeeklyRecommendations(moodHistory: MoodEntry[], preferences: UserPreferences): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];

    // Social connection recommendation
    const hasLonelinessTrigers = moodHistory.some(entry => 
      entry.triggers?.includes('เหงา') || entry.triggers?.includes('โดดเดี่ยว')
    );

    if (hasLonelinessTrigers) {
      recommendations.push({
        id: `weekly_${Date.now()}_1`,
        type: 'activity',
        category: 'weekly',
        title: '🤝 การสร้างความสัมพันธ์',
        description: 'กิจกรรมเชื่อมโยงกับผู้อื่นเพื่อลดความเหงา',
        difficulty: preferences.difficultyPreference === 'easy' ? 'easy' : 'medium',
        duration: '2-3 ชั่วโมง',
        personalizedReason: 'คุณมีความรู้สึกเหงาบ่อย การมีปฏิสัมพันธ์กับผู้อื่นจะช่วยได้',
        actionSteps: [
          'โทรหาเพื่อนเก่าที่ไม่ได้คุยนาน',
          'เข้าร่วมกิจกรรมชุมชนหรือกลุ่มที่สนใจ',
          'อาสาทำกิจกรรมเพื่อสังคม',
          'วางแผนพบเพื่อนหรือครอบครัว'
        ],
        successMetrics: ['รู้สึกเชื่อมโยงกับผู้อื่น', 'มีกำลังใจมากขึ้น'],
        confidence: 90
      });
    }

    // Creative expression
    recommendations.push({
      id: `weekly_${Date.now()}_2`,
      type: 'activity',
      category: 'weekly',
      title: '🎨 การแสดงออกทางสร้างสรรค์',
      description: 'กิจกรรมสร้างสรรค์ที่ช่วยระบายอารมณ์',
      difficulty: 'medium',
      duration: '1-2 ชั่วโมง',
      personalizedReason: 'การสร้างสรรค์ช่วยประมวลผลอารมณ์และเพิ่มความรู้สึกภาคภูมิใจ',
      actionSteps: [
        'เลือกกิจกรรมที่ชอบ (วาดภาพ, เขียน, ทำอาหาร)',
        'ตั้งเวลาสำหรับกิจกรรมนี้',
        'ไม่ต้องกังวลเรื่องผลงาน เน้นความสนุก',
        'แบ่งปันผลงานกับคนใกล้ชิด'
      ],
      successMetrics: ['รู้สึกภาคภูมิใจ', 'มีช่องทางระบายอารมณ์'],
      confidence: 75
    });

    return recommendations;
  }

  private async getLongTermRecommendations(moodHistory: MoodEntry[], userData: any): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];

    // Resilience building
    recommendations.push({
      id: `longterm_${Date.now()}_1`,
      type: 'goal',
      category: 'long_term',
      title: '💪 การสร้างความยืดหยุ่นทางจิตใจ',
      description: 'พัฒนาทักษะการรับมือกับความท้าทายในระยะยาว',
      difficulty: 'medium',
      duration: '2-3 เดือน',
      personalizedReason: 'การมีความยืดหยุ่นทางจิตใจจะช่วยรับมือกับสถานการณ์ยากได้ดีขึ้น',
      actionSteps: [
        'เรียนรู้เทคนิคการจัดการความเครียด',
        'ฝึกการมองโลกในแง่บวก',
        'สร้างเครือข่ายสนับสนุน',
        'พัฒนาทักษะการแก้ปัญหา'
      ],
      successMetrics: [
        'รับมือกับความเครียดได้ดีขึ้น',
        'ฟื้นตัวจากเหตุการณ์ยากได้เร็วขึ้น',
        'มีความมั่นใจในตัวเองมากขึ้น'
      ],
      confidence: 85
    });

    return recommendations;
  }

  private async getUserPreferences(): Promise<UserPreferences> {
    // In a real app, this would be stored in user settings
    return {
      preferredActivities: ['ออกกำลังกาย', 'อ่านหนังสือ', 'ฟังเพลง'],
      availableTime: 'medium',
      difficultyPreference: 'mixed',
      focusAreas: ['การจัดการความเครียด', 'การนอนหลับ']
    };
  }

  async trackRecommendationSuccess(recommendationId: string, success: boolean): Promise<void> {
    try {
      // Store success/failure data for improving future recommendations
      const successData = {
        recommendationId,
        success,
        timestamp: new Date().toISOString()
      };
      
      const existingData = await DataManager.getSecureData('recommendation_feedback');
      const feedbackList = existingData ? JSON.parse(existingData) : [];
      feedbackList.push(successData);
      
      await DataManager.storeSecureData('recommendation_feedback', JSON.stringify(feedbackList));
    } catch (error) {
      console.error('Error tracking recommendation success:', error);
    }
  }
}

export const PersonalizedRecommendations = new PersonalizedRecommendationsClass();
