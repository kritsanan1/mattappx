
import { MoodTracker, MoodEntry } from './MoodTracker';
import { DataManager } from './DataManager';

export interface PredictiveInsight {
  id: string;
  type: 'mood_forecast' | 'risk_alert' | 'opportunity' | 'habit_suggestion';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionItems: string[];
  timeframe: string;
  createdAt: Date;
}

export interface MoodForecast {
  date: string;
  predictedMood: number;
  confidence: number;
  factors: string[];
}

export interface BehaviorPattern {
  id: string;
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}

class SmartInsightsEngineClass {
  
  async generatePredictiveInsights(): Promise<PredictiveInsight[]> {
    try {
      const moodHistory = await MoodTracker.getMoodHistory(30);
      const insights: PredictiveInsight[] = [];

      // Mood pattern prediction
      const moodForecast = await this.predictMoodTrend(moodHistory);
      if (moodForecast) insights.push(moodForecast);

      // Risk assessment
      const riskAlert = await this.assessRiskFactors(moodHistory);
      if (riskAlert) insights.push(riskAlert);

      // Opportunity identification
      const opportunities = await this.identifyOpportunities(moodHistory);
      insights.push(...opportunities);

      // Habit suggestions
      const habitSuggestions = await this.suggestHabits(moodHistory);
      insights.push(...habitSuggestions);

      return insights;
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  private async predictMoodTrend(moodHistory: MoodEntry[]): Promise<PredictiveInsight | null> {
    if (moodHistory.length < 7) return null;

    const recentMoods = moodHistory.slice(0, 7).map(entry => entry.mood);
    const trend = this.calculateTrend(recentMoods);
    const weeklyPattern = await this.analyzeWeeklyPattern(moodHistory);

    const nextWeekForecast = this.forecastNextWeek(recentMoods, weeklyPattern);
    const avgForecast = nextWeekForecast.reduce((sum, mood) => sum + mood, 0) / 7;

    return {
      id: `forecast_${Date.now()}`,
      type: 'mood_forecast',
      title: '🔮 การพยากรณ์อารมณ์สัปดาห์หน้า',
      description: `คาดการณ์ว่าอารมณ์เฉลี่ยของคุณจะอยู่ที่ ${avgForecast.toFixed(1)}/5 (${trend > 0 ? 'ปรับตัวดีขึ้น' : trend < 0 ? 'ต้องระวัง' : 'คงที่'})`,
      confidence: Math.min(85, moodHistory.length * 3),
      actionItems: this.generateForecastActions(avgForecast, trend),
      timeframe: 'สัปดาห์หน้า',
      createdAt: new Date()
    };
  }

  private async assessRiskFactors(moodHistory: MoodEntry[]): Promise<PredictiveInsight | null> {
    const recentEntries = moodHistory.slice(0, 14);
    const lowMoodCount = recentEntries.filter(entry => entry.mood <= 2).length;
    const volatility = this.calculateVolatility(recentEntries.map(e => e.mood));

    if (lowMoodCount >= 3 || volatility > 1.5) {
      return {
        id: `risk_${Date.now()}`,
        type: 'risk_alert',
        title: '⚠️ การแจ้งเตือนความเสี่ยง',
        description: `พบสัญญาณเตือนในการติดตามอารมณ์ของคุณ - ${lowMoodCount > 0 ? `อารมณ์ต่ำ ${lowMoodCount} วัน` : ''} ${volatility > 1.5 ? 'อารมณ์แปรปรวนสูง' : ''}`,
        confidence: Math.min(90, (lowMoodCount * 15) + (volatility * 20)),
        actionItems: [
          'พิจารณาขอความช่วยเหลือจากผู้เชี่ยวชาญ',
          'เพิ่มกิจกรรมที่ทำให้ผ่อนคลาย',
          'ติดต่อเพื่อนหรือครอบครัว',
          'ทบทวนรูปแบบการนอนหลับ'
        ],
        timeframe: 'ทันที',
        createdAt: new Date()
      };
    }

    return null;
  }

  private async identifyOpportunities(moodHistory: MoodEntry[]): Promise<PredictiveInsight[]> {
    const opportunities: PredictiveInsight[] = [];
    const patterns = await this.analyzeBehaviorPatterns(moodHistory);

    patterns.forEach(pattern => {
      if (pattern.impact === 'positive') {
        opportunities.push({
          id: `opportunity_${Date.now()}_${Math.random()}`,
          type: 'opportunity',
          title: '🌟 โอกาสในการพัฒนา',
          description: `คุณมีแนวโน้มที่ดีใน: ${pattern.pattern}`,
          confidence: 75,
          actionItems: pattern.suggestions,
          timeframe: 'สัปดาห์นี้',
          createdAt: new Date()
        });
      }
    });

    return opportunities;
  }

  private async suggestHabits(moodHistory: MoodEntry[]): Promise<PredictiveInsight[]> {
    const habits: PredictiveInsight[] = [];
    const avgMood = moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length;

    if (avgMood < 3.5) {
      habits.push({
        id: `habit_${Date.now()}`,
        type: 'habit_suggestion',
        title: '💪 คำแนะนำการสร้างนิสัยใหม่',
        description: 'นิสัยที่แนะนำเพื่อปรับปรุงอารมณ์',
        confidence: 80,
        actionItems: [
          'ออกกำลังกาย 20 นาทีทุกวัน',
          'ทำสมาธิ 10 นาทีก่อนนอน',
          'เขียนไดอารี่ความดีใจ 3 ข้อทุกคืน',
          'ตื่นเช้าในเวลาเดียวกันทุกวัน'
        ],
        timeframe: '2-4 สัปดาห์',
        createdAt: new Date()
      });
    }

    return habits;
  }

  async generateMoodForecast(days: number = 7): Promise<MoodForecast[]> {
    const moodHistory = await MoodTracker.getMoodHistory(30);
    const weeklyPattern = await this.analyzeWeeklyPattern(moodHistory);
    const forecast: MoodForecast[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const predictedMood = weeklyPattern[dayName] || 3;
      const confidence = Math.min(90, moodHistory.length * 2);

      forecast.push({
        date: date.toISOString().split('T')[0],
        predictedMood,
        confidence,
        factors: this.identifyMoodFactors(dayName, moodHistory)
      });
    }

    return forecast;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = values.reduce((sum, _, index) => sum + (index * index), 0);

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private async analyzeWeeklyPattern(moodHistory: MoodEntry[]): Promise<{[key: string]: number}> {
    const dayPattern: {[key: string]: number[]} = {
      'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [],
      'Thursday': [], 'Friday': [], 'Saturday': []
    };

    moodHistory.forEach(entry => {
      const dayName = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayPattern[dayName].push(entry.mood);
    });

    const averages: {[key: string]: number} = {};
    Object.keys(dayPattern).forEach(day => {
      const moods = dayPattern[day];
      averages[day] = moods.length > 0 
        ? moods.reduce((sum, mood) => sum + mood, 0) / moods.length 
        : 3;
    });

    return averages;
  }

  private forecastNextWeek(recentMoods: number[], weeklyPattern: {[key: string]: number}): number[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const recentTrend = this.calculateTrend(recentMoods);
    
    return days.map(day => {
      const basePattern = weeklyPattern[day] || 3;
      const trendAdjustment = recentTrend * 0.3;
      return Math.max(1, Math.min(5, basePattern + trendAdjustment));
    });
  }

  private generateForecastActions(avgForecast: number, trend: number): string[] {
    const actions = [];
    
    if (avgForecast < 3) {
      actions.push('วางแผนกิจกรรมที่ทำให้อารมณ์ดีขึ้น');
      actions.push('เตรียมแผนรับมือกับอารมณ์ต่ำ');
    }
    
    if (trend < 0) {
      actions.push('ระวังปัจจัยที่อาจทำให้อารมณ์แย่ลง');
      actions.push('เพิ่มการดูแลตนเอง');
    } else if (trend > 0) {
      actions.push('ทำต่อไปในสิ่งที่ทำให้อารมณ์ดีขึ้น');
      actions.push('แบ่งปันความสุขให้คนรอบข้าง');
    }

    return actions;
  }

  private async analyzeBehaviorPatterns(moodHistory: MoodEntry[]): Promise<BehaviorPattern[]> {
    const patterns: BehaviorPattern[] = [];
    
    // Analyze trigger patterns
    const triggerCounts: {[key: string]: {positive: number, negative: number}} = {};
    
    moodHistory.forEach(entry => {
      if (entry.triggers) {
        entry.triggers.forEach(trigger => {
          if (!triggerCounts[trigger]) {
            triggerCounts[trigger] = {positive: 0, negative: 0};
          }
          
          if (entry.mood >= 4) {
            triggerCounts[trigger].positive++;
          } else if (entry.mood <= 2) {
            triggerCounts[trigger].negative++;
          }
        });
      }
    });

    Object.entries(triggerCounts).forEach(([trigger, counts]) => {
      const total = counts.positive + counts.negative;
      if (total >= 3) {
        const impact = counts.positive > counts.negative ? 'positive' : 'negative';
        patterns.push({
          id: `pattern_${trigger}`,
          pattern: trigger,
          frequency: total,
          impact,
          suggestions: this.getSuggestionsForTrigger(trigger, impact)
        });
      }
    });

    return patterns;
  }

  private getSuggestionsForTrigger(trigger: string, impact: 'positive' | 'negative' | 'neutral'): string[] {
    if (impact === 'positive') {
      return [
        `เพิ่มความถี่ของกิจกรรมที่เกี่ยวข้องกับ ${trigger}`,
        `วางแผนให้มีเวลาสำหรับ ${trigger} มากขึ้น`
      ];
    } else {
      return [
        `หลีกเลี่ยงหรือลดสถานการณ์ที่เกี่ยวข้องกับ ${trigger}`,
        `เตรียมแผนรับมือเมื่อเจอสถานการณ์ ${trigger}`
      ];
    }
  }

  private identifyMoodFactors(dayName: string, moodHistory: MoodEntry[]): string[] {
    const factors = [];
    
    // Day-specific factors
    const weekendFactor = ['Saturday', 'Sunday'].includes(dayName) ? 'วันหยุด' : 'วันทำงาน';
    factors.push(weekendFactor);

    // Historical triggers for this day
    const dayEntries = moodHistory.filter(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' }) === dayName
    );

    const commonTriggers = this.getCommonTriggersForDay(dayEntries);
    factors.push(...commonTriggers);

    return factors;
  }

  private getCommonTriggersForDay(dayEntries: MoodEntry[]): string[] {
    const triggerCounts: {[key: string]: number} = {};
    
    dayEntries.forEach(entry => {
      if (entry.triggers) {
        entry.triggers.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      }
    });

    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([trigger]) => trigger);
  }
}

export const SmartInsightsEngine = new SmartInsightsEngineClass();
