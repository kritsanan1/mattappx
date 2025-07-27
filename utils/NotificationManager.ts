import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DataManager } from './DataManager';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification: Notifications.Notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Added missing property
    shouldShowList: true,   // Added missing property
  }),
});

class NotificationManagerClass {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      if (Platform.OS === 'web') {
        console.log('Notifications not supported on web platform');
        return;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }

      // Configure notification categories
      await this.setupNotificationCategories();
      
      this.isInitialized = true;
      console.log('Notification manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async setupNotificationCategories() {
    await Notifications.setNotificationCategoryAsync('motivation', [
      {
        identifier: 'view',
        buttonTitle: 'ดู',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'ปิด',
        options: { opensAppToForeground: false },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('craving_help', [
      {
        identifier: 'coping_strategies',
        buttonTitle: 'วิธีรับมือ',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'call_support',
        buttonTitle: 'โทรขอความช่วยเหลือ',
        options: { opensAppToForeground: true },
      },
    ]);
  }

  async scheduleMotivationalNotifications() {
    try {
      if (Platform.OS === 'web') return;

      const userData = await DataManager.getUserData();
      if (!userData.notifications.dailyMotivation) return;

      // Cancel existing motivational notifications
      await this.cancelNotificationsByCategory('daily_motivation');

      const motivationalMessages = [
        'วันนี้คือโอกาสใหม่! คุณทำได้ 💪',
        'ทุกวันที่ผ่านไปคือชัยชนะ เก่งมาก! 🌟',
        'คุณแข็งแกร่งกว่าที่คิดไว้ ทำต่อไป! 🌈',
        'การเปลี่ยนแปลงต้องใช้เวลา แต่คุณกำลังก้าวไปในทิศทางที่ถูก ✨',
        'ร่างกายและจิตใจของคุณขอบคุณสำหรับการตัดสินใจที่ดี 🙏',
        'วันนี้มีความหวังและความเป็นไปได้ใหม่ๆ รอคุณอยู่ 🌅',
        'คุณกำลังสร้างอนาคตที่ดีกว่าให้กับตัวเอง 🚀',
      ];

      // Schedule daily notifications for the next 30 days
      for (let i = 1; i <= 30; i++) {
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        await Notifications.scheduleNotificationAsync({
          identifier: `daily_motivation_${i}`,
          content: {
            title: 'Thai Recovery',
            body: message,
            categoryIdentifier: 'motivation',
            data: { type: 'daily_motivation' },
          },
          trigger: {
            type: 'calendar', // Added missing property
            hour: 9, // 9 AM
            minute: 0,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      }

      console.log('Motivational notifications scheduled');
    } catch (error) {
      console.error('Failed to schedule motivational notifications:', error);
    }
  }

  async scheduleCravingReminders() {
    try {
      if (Platform.OS === 'web') return;

      const userData = await DataManager.getUserData();
      if (!userData.notifications.cravingReminders) return;

      // Cancel existing craving reminders
      await this.cancelNotificationsByCategory('craving_reminder');

      const reminderMessages = [
        'หากรู้สึกอยากเสพ ลองหายใจลึกๆ 5 ครั้ง 🌬️',
        'ความอยากจะผ่านไป จำไว้ว่าทำไมเราถึงเลิก 💭',
        'เมื่อรู้สึกอยาก ลองเปลี่ยนสภาพแวดล้อม 🚶‍♂️',
        'ติดต่อเพื่อนหรือคนที่ไว้ใจได้เมื่ออยากเสพ 📞',
        'ความอยากเป็นเพียงความรู้สึกชั่วคราว คุณแข็งแกร่งกว่านั้น 💪',
      ];

      // Schedule reminders at high-risk times
      const riskTimes = [
        { hour: 17, minute: 0 }, // 5 PM - after work
        { hour: 20, minute: 0 }, // 8 PM - evening
        { hour: 22, minute: 0 }, // 10 PM - night
      ];

      for (const time of riskTimes) {
        const message = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
        
        await Notifications.scheduleNotificationAsync({
          identifier: `craving_reminder_${time.hour}`,
          content: {
            title: 'การเตือนใจ',
            body: message,
            categoryIdentifier: 'craving_help',
            data: { type: 'craving_reminder' },
          },
          trigger: {
            type: 'calendar', // Added missing property
            hour: time.hour,
            minute: time.minute,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      }

      console.log('Craving reminder notifications scheduled');
    } catch (error) {
      console.error('Failed to schedule craving reminders:', error);
    }
  }

  async scheduleMilestoneNotification(days: number) {
    try {
      if (Platform.OS === 'web') return;

      const userData = await DataManager.getUserData();
      if (!userData.notifications.milestoneAlerts) return;

      const milestoneMessages: { [key: number]: string } = {
        1: '🎉 ครบ 1 วันแล้ว! เริ่มต้นที่ดี',
        3: '🌟 ครบ 3 วันแล้ว! ร่างกายเริ่มปรับตัว',
        7: '💪 ครบ 1 สัปดาห์แล้ว! ทำได้ดีมาก',
        14: '🚀 ครบ 2 สัปดาห์แล้ว! คุณแข็งแกร่งขึ้น',
        30: '🏆 ครบ 1 เดือนแล้ว! ความสำเร็จครั้งใหญ่',
        60: '🌈 ครบ 2 เดือนแล้ว! ชีวิตดีขึ้นแล้วใช่ไหม',
        90: '💎 ครบ 3 เดือนแล้ว! คุณเป็นแรงบันดาลใจ',
        180: '🌟 ครบ 6 เดือนแล้ว! การเปลี่ยนแปลงที่ยิ่งใหญ่',
        365: '👑 ครบ 1 ปีแล้ว! คุณคือผู้ชนะตัวจริง',
      };

      const message = milestoneMessages[days];
      if (!message) return;

      await Notifications.scheduleNotificationAsync({
        identifier: `milestone_${days}`,
        content: {
          title: `ครบ ${days} วันแล้ว!`,
          body: message,
          categoryIdentifier: 'motivation',
          data: { type: 'milestone', days },
        },
        trigger: null, // Immediate notification
      });

      console.log(`Milestone notification sent for ${days} days`);
    } catch (error) {
      console.error('Failed to schedule milestone notification:', error);
    }
  }

  async sendCravingAlert() {
    try {
      if (Platform.OS === 'web') return;

      await Notifications.scheduleNotificationAsync({
        identifier: `craving_alert_${Date.now()}`,
        content: {
          title: 'ต้องการความช่วยเหลือ?',
          body: 'หากรู้สึกอยากเสพอย่างแรง สามารถขอความช่วยเหลือได้',
          categoryIdentifier: 'craving_help',
          data: { type: 'craving_alert' },
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.error('Failed to send craving alert:', error);
    }
  }

  private async cancelNotificationsByCategory(category: string) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const categoryNotifications = scheduledNotifications.filter(
        notification => notification.identifier.includes(category)
      );

      for (const notification of categoryNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error(`Failed to cancel ${category} notifications:`, error);
    }
  }

  async cancelAllNotifications() {
    try {
      if (Platform.OS === 'web') return;
      
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async updateNotificationSettings() {
    try {
      const userData = await DataManager.getUserData();
      
      // Cancel all existing notifications
      await this.cancelAllNotifications();
      
      // Reschedule based on current settings
      if (userData.notifications.dailyMotivation) {
        await this.scheduleMotivationalNotifications();
      }
      
      if (userData.notifications.cravingReminders) {
        await this.scheduleCravingReminders();
      }
      
      console.log('Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }
}

export const NotificationManager = new NotificationManagerClass();