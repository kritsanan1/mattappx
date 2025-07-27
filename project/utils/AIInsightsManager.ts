import { DataManager, Craving, UserData } from './DataManager';

export interface InsightData {
  id: string;
  type: 'pattern' | 'risk' | 'strategy' | 'milestone';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionItems: string[];
  createdAt: Date;
}

export interface RelapsePrevention {
  id: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  copingStrategies: string[];
  triggerAvoidance: string[];
  safeSpaces: string[];
  warningSignsChecklist: string[];
  createdAt: Date;
  updatedAt: Date;
}

class AIInsightsManagerClass {
  
  async generateInsights(): Promise<InsightData[]> {
    try {
      const userData = await DataManager.getUserData();
      const cravings = await DataManager.getCravings();
      const insights: InsightData[] = [];

      // Pattern Analysis
      const patternInsight = this.analyzePatterns(cravings);
      if (patternInsight) insights.push(patternInsight);

      // Risk Assessment
      const riskInsight = this.assessRelapsRisk(userData, cravings);
      if (riskInsight) insights.push(riskInsight);

      // Milestone Recognition
      const milestoneInsight = this.checkMilestones(userData);
      if (milestoneInsight) insights.push(milestoneInsight);

      // Strategy Suggestions
      const strategyInsight = this.suggestStrategies(cravings);
      if (strategyInsight) insights.push(strategyInsight);

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  private analyzePatterns(cravings: Craving[]): InsightData | null {
    if (cravings.length < 3) return null;

    const recentCravings = cravings.slice(0, 10);
    const triggerCounts: { [key: string]: number } = {};
    const timePatterns: { [key: string]: number } = {};

    recentCravings.forEach(craving => {
      // Count triggers
      if (craving.trigger) {
        triggerCounts[craving.trigger] = (triggerCounts[craving.trigger] || 0) + 1;
      }

      // Analyze time patterns
      const hour = new Date(craving.timestamp).getHours();
      const timeSlot = this.getTimeSlot(hour);
      timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1;
    });

    const mostCommonTrigger = Object.keys(triggerCounts).reduce((a, b) => 
      triggerCounts[a] > triggerCounts[b] ? a : b
    );

    const mostCommonTime = Object.keys(timePatterns).reduce((a, b) => 
      timePatterns[a] > timePatterns[b] ? a : b
    );

    return {
      id: `pattern_${Date.now()}`,
      type: 'pattern',
      title: 'รูปแบบความอยากที่พบ',
      description: `คุณมักจะมีความอยากเมื่อ "${mostCommonTrigger}" และในช่วง${mostCommonTime}`,
      severity: triggerCounts[mostCommonTrigger] > 3 ? 'high' : 'medium',
      actionItems: [
        `หลีกเลี่ยงสถานการณ์ที่เกี่ยวข้องกับ "${mostCommonTrigger}"`,
        `เตรียมแผนรับมือสำหรับช่วง${mostCommonTime}`,
        'ฝึกเทคนิคการผ่อนคลายเมื่อเจอสถานการณ์เสี่ยง'
      ],
      createdAt: new Date()
    };
  }

  private assessRelapsRisk(userData: UserData, cravings: Craving[]): InsightData | null {
    const soberDays = userData.soberStartDate ? 
      Math.floor((new Date().getTime() - new Date(userData.soberStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const recentCravings = cravings.filter(c => 
      new Date(c.timestamp).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
    );

    const avgIntensity = recentCravings.length > 0 ? 
      recentCravings.reduce((sum, c) => sum + c.intensity, 0) / recentCravings.length : 0;

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let riskDescription = '';
    let actionItems: string[] = [];

    if (recentCravings.length > 5 && avgIntensity > 7) {
      riskLevel = 'high';
      riskDescription = 'ความเสี่ยงสูง: ความอยากเพิ่มขึ้นและมีความแรงมาก';
      actionItems = [
        'ติดต่อที่ปรึกษาหรือสายด่วนทันที',
        'หาคนที่ไว้ใจได้มาอยู่ด้วย',
        'หลีกเลี่ยงสถานการณ์เสี่ยงทั้งหมด',
        'ทบทวนแรงจูงใจในการหยุด'
      ];
    } else if (recentCravings.length > 3 || avgIntensity > 5) {
      riskLevel = 'medium';
      riskDescription = 'ความเสี่ยงปานกลาง: ควรระวังและเพิ่มการดูแลตนเอง';
      actionItems = [
        'เพิ่มกิจกรรมที่ทำให้ผ่อนคลาย',
        'ติดต่อกลุ่มสนับสนุนบ่อยขึ้น',
        'ทบทวนเทคนิคการรับมือ',
        'ดูแลสุขภาพกายและใจให้ดี'
      ];
    } else {
      riskLevel = 'low';
      riskDescription = 'ความเสี่ยงต่ำ: คุณกำลังทำได้ดีมาก!';
      actionItems = [
        'ทำต่อไปในสิ่งที่ทำอยู่',
        'แบ่งปันประสบการณ์ให้คนอื่น',
        'วางแผนกิจกรรมใหม่ๆ',
        'เฉลิมฉลองความสำเร็จเล็กๆ'
      ];
    }

    return {
      id: `risk_${Date.now()}`,
      type: 'risk',
      title: 'การประเมินความเสี่ยง',
      description: riskDescription,
      severity: riskLevel,
      actionItems,
      createdAt: new Date()
    };
  }

  private checkMilestones(userData: UserData): InsightData | null {
    if (!userData.soberStartDate) return null;

    const soberDays = Math.floor(
      (new Date().getTime() - new Date(userData.soberStartDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const milestones = [
      { days: 1, title: 'วันแรกที่สะอาด!', reward: 'เริ่มต้นใหม่' },
      { days: 7, title: '1 สัปดาห์แล้ว!', reward: 'ความมุ่งมั่น' },
      { days: 30, title: '1 เดือนแล้ว!', reward: 'พลังใจ' },
      { days: 90, title: '3 เดือนแล้ว!', reward: 'ความเข้มแข็ง' },
      { days: 180, title: '6 เดือนแล้ว!', reward: 'ความภาคภูมิใจ' },
      { days: 365, title: '1 ปีแล้ว!', reward: 'ชัยชนะ' }
    ];

    const currentMilestone = milestones.find(m => m.days === soberDays);
    if (!currentMilestone) return null;

    return {
      id: `milestone_${Date.now()}`,
      type: 'milestone',
      title: `🎉 ${currentMilestone.title}`,
      description: `คุณได้รับรางวัล: ${currentMilestone.reward}`,
      severity: 'low',
      actionItems: [
        'เฉลิมฉลองความสำเร็จนี้',
        'แบ่งปันความภาคภูมิใจกับคนใกล้ชิด',
        'ตั้งเป้าหมายใหม่สำหรับขั้นต่อไป',
        'ให้รางวัลตัวเองด้วยสิ่งที่ชอบ'
      ],
      createdAt: new Date()
    };
  }

  private suggestStrategies(cravings: Craving[]): InsightData | null {
    if (cravings.length === 0) return null;

    const recentCraving = cravings[0];
    const strategies = this.getStrategiesForTrigger(recentCraving.trigger);

    return {
      id: `strategy_${Date.now()}`,
      type: 'strategy',
      title: 'เทคนิคการรับมือที่แนะนำ',
      description: `สำหรับสถานการณ์: ${recentCraving.trigger}`,
      severity: 'medium',
      actionItems: strategies,
      createdAt: new Date()
    };
  }

  private getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'ตอนเช้า';
    if (hour >= 12 && hour < 18) return 'ตอนบ่าย';
    if (hour >= 18 && hour < 22) return 'ตอนเย็น';
    return 'ตอนกลางคืน';
  }

  private getStrategiesForTrigger(trigger: string): string[] {
    const strategies: { [key: string]: string[] } = {
      'เครียด': [
        'ฝึกหายใจลึก 4-7-8',
        'ทำสมาธิ 10 นาที',
        'ออกกำลังกายเบาๆ',
        'ฟังเพลงที่ชอบ'
      ],
      'เหงา': [
        'โทรหาเพื่อนสนิท',
        'เข้าร่วมกลุ่มสนับสนุน',
        'ทำกิจกรรมที่ชอบ',
        'เขียนไดอารี่'
      ],
      'โกรธ': [
        'นับจาก 1 ถึง 10',
        'ออกไปเดินข้างนอก',
        'ฟังเพลงเบาๆ',
        'เขียนความรู้สึกลงกระดาษ'
      ],
      'เบื่อ': [
        'หากิจกรรมใหม่ทำ',
        'อ่านหนังสือ',
        'ดูหนังหรือซีรีส์',
        'ทำงานอดิเรก'
      ]
    };

    return strategies[trigger] || [
      'หายใจลึกๆ และนับจาก 1 ถึง 10',
      'เปลี่ยนสภาพแวดล้อม',
      'ทำกิจกรรมที่ทำให้ผ่อนคลาย',
      'ติดต่อคนที่ไว้ใจได้'
    ];
  }

  async generateRelapsePrevention(): Promise<RelapsePrevention> {
    const userData = await DataManager.getUserData();
    const cravings = await DataManager.getCravings();

    // Analyze user's most common triggers
    const triggerCounts: { [key: string]: number } = {};
    cravings.forEach(craving => {
      if (craving.trigger) {
        triggerCounts[craving.trigger] = (triggerCounts[craving.trigger] || 0) + 1;
      }
    });

    const topTriggers = Object.keys(triggerCounts)
      .sort((a, b) => triggerCounts[b] - triggerCounts[a])
      .slice(0, 3);

    return {
      id: `prevention_${Date.now()}`,
      emergencyContacts: [
        { name: 'สายด่วนกรมสุขภาพจิต', phone: '1323', relationship: 'หน่วยงานรัฐ' },
        { name: 'ฉุกเฉินการแพทย์', phone: '1669', relationship: 'หน่วยงานรัฐ' }
      ],
      copingStrategies: [
        'หายใจลึก 4-7-8 เป็นเวลา 5 นาที',
        'โทรหาเพื่อนสนิทหรือครอบครัว',
        'ออกไปเดินข้างนอก 15 นาที',
        'ฟังเพลงที่ทำให้ผ่อนคลาย',
        'ทำสมาธิหรือโยคะ',
        'เขียนไดอารี่หรือบันทึกความรู้สึก'
      ],
      triggerAvoidance: topTriggers.map(trigger => `หลีกเลี่ยง: ${trigger}`),
      safeSpaces: [
        'บ้านของตัวเอง',
        'ห้องสมุด',
        'ศูนย์ออกกำลังกาย',
        'สวนสาธารณะ',
        'ศูนย์ชุมชน'
      ],
      warningSignsChecklist: [
        'ความอยากเพิ่มขึ้นอย่างต่อเนื่อง',
        'หลีกเลี่ยงกิจกรรมที่เคยชอบ',
        'อารมณ์แปรปรวนมาก',
        'นอนไม่หลับหรือนอนมากเกินไป',
        'หลีกเลี่ยงเพื่อนฝูงและครอบครัว',
        'ความคิดเชิงลบเพิ่มขึ้น'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

export const AIInsightsManager = new AIInsightsManagerClass();