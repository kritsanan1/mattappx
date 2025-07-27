
import { DataManager } from './DataManager';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'story' | 'question' | 'tip' | 'achievement';
  mood: number;
  isAnonymous: boolean;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: Date;
}

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  moderators: string[];
  createdAt: Date;
}

export interface Mentor {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  rating: number;
  isAvailable: boolean;
  responseTime: string;
}

class SocialFeaturesClass {
  
  async shareStory(content: string, mood: number, isAnonymous: boolean = false, tags: string[] = []): Promise<CommunityPost> {
    try {
      const userData = await DataManager.getUserData();
      
      const post: CommunityPost = {
        id: `post_${Date.now()}`,
        authorId: userData.id,
        authorName: isAnonymous ? 'ผู้ใช้ไม่ประสงค์ออกนาม' : userData.name || 'ผู้ใช้',
        content,
        type: 'story',
        mood,
        isAnonymous,
        tags,
        likes: 0,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // In a real app, this would be sent to a server
      await this.savePostLocally(post);
      
      return post;
    } catch (error) {
      console.error('Error sharing story:', error);
      throw error;
    }
  }

  async getCommunityFeed(limit: number = 20): Promise<CommunityPost[]> {
    try {
      // Mock data for demonstration
      return [
        {
          id: 'post_1',
          authorId: 'user_1',
          authorName: 'สมชาย',
          content: 'วันนี้ครบ 30 วันที่หยุดสูบบุหรี่แล้ว! รู้สึกดีมากที่หายใจได้สะดวกขึ้น',
          type: 'achievement',
          mood: 5,
          isAnonymous: false,
          tags: ['เลิกสูบ', 'ความสำเร็จ'],
          likes: 15,
          comments: [
            {
              id: 'comment_1',
              authorId: 'user_2',
              authorName: 'มานี',
              content: 'เก่งมาก! เป็นแรงบันดาลใจให้เราด้วย',
              isAnonymous: false,
              likes: 3,
              createdAt: new Date('2024-01-15T10:30:00Z')
            }
          ],
          createdAt: new Date('2024-01-15T09:00:00Z'),
          updatedAt: new Date('2024-01-15T09:00:00Z')
        },
        {
          id: 'post_2',
          authorId: 'anonymous_1',
          authorName: 'ผู้ใช้ไม่ประสงค์ออกนาม',
          content: 'มีใครมีเทคนิคการจัดการกับความเครียดจากการทำงานบ้างไหม? เหนื่อยมากเลย',
          type: 'question',
          mood: 2,
          isAnonymous: true,
          tags: ['ความเครียด', 'การทำงาน'],
          likes: 8,
          comments: [
            {
              id: 'comment_2',
              authorId: 'user_3',
              authorName: 'ดร.วิทย์',
              content: 'ลองเทคนิค Pomodoro ดูครับ ทำงาน 25 นาที พัก 5 นาที',
              isAnonymous: false,
              likes: 5,
              createdAt: new Date('2024-01-15T11:00:00Z')
            }
          ],
          createdAt: new Date('2024-01-15T08:45:00Z'),
          updatedAt: new Date('2024-01-15T08:45:00Z')
        }
      ];
    } catch (error) {
      console.error('Error getting community feed:', error);
      return [];
    }
  }

  async getSupportGroups(): Promise<SupportGroup[]> {
    // Mock data for demonstration
    return [
      {
        id: 'group_1',
        name: 'กลุ่มเลิกสูบบุหรี่',
        description: 'สำหรับผู้ที่ต้องการเลิกสูบบุหรี่และหาเพื่อนร่วมทาง',
        memberCount: 1250,
        isPrivate: false,
        tags: ['เลิกสูบ', 'สุขภาพ'],
        moderators: ['mod_1', 'mod_2'],
        createdAt: new Date('2023-06-01')
      },
      {
        id: 'group_2',
        name: 'การจัดการความเครียด',
        description: 'เรียนรู้เทคนิคและแบ่งปันประสบการณ์การจัดการความเครียด',
        memberCount: 890,
        isPrivate: false,
        tags: ['ความเครียด', 'สุขภาพจิต'],
        moderators: ['mod_3'],
        createdAt: new Date('2023-08-15')
      },
      {
        id: 'group_3',
        name: 'วัยรุ่นและสุขภาพจิต',
        description: 'พื้นที่ปลอดภัยสำหรับวัยรุ่นที่ต้องการพูดคุยเรื่องสุขภาพจิต',
        memberCount: 567,
        isPrivate: true,
        tags: ['วัยรุ่น', 'ความปลอดภัย'],
        moderators: ['mod_4', 'mod_5'],
        createdAt: new Date('2023-09-20')
      }
    ];
  }

  async getAvailableMentors(): Promise<Mentor[]> {
    // Mock data for demonstration
    return [
      {
        id: 'mentor_1',
        name: 'ดร.สุนีย์ ใจดี',
        bio: 'นักจิตวิทยาคลินิกที่มีประสบการณ์ 15 ปี เชี่ยวชาญด้านการบำบัดความเครียด',
        expertise: ['ความเครียด', 'ความวิตกกังวล', 'การนอนหลับ'],
        rating: 4.8,
        isAvailable: true,
        responseTime: 'ภายใน 2 ชั่วโมง'
      },
      {
        id: 'mentor_2',
        name: 'อาจารย์มณี สบายใจ',
        bio: 'ผู้เชี่ยวชาญด้านการสร้างแรงจูงใจและการเปลี่ยนแปลงพฤติกรรม',
        expertise: ['แรงจูงใจ', 'การเปลี่ยนแปลง', 'เป้าหมายชีวิต'],
        rating: 4.9,
        isAvailable: true,
        responseTime: 'ภายใน 1 ชั่วโมง'
      },
      {
        id: 'mentor_3',
        name: 'โค้ช วิชญ์ พลังใจ',
        bio: 'Life Coach ผู้ผ่านการฝึกอบรมมาตรฐานสากล เชี่ยวชaญการพัฒนาตนเอง',
        expertise: ['การพัฒนาตนเอง', 'ความมั่นใจ', 'ความสัมพันธ์'],
        rating: 4.7,
        isAvailable: false,
        responseTime: 'ภายใน 4 ชั่วโมง'
      }
    ];
  }

  async requestMentorChat(mentorId: string, message: string): Promise<{ success: boolean; chatId?: string }> {
    try {
      // In a real app, this would create a chat request to the mentor
      const chatId = `chat_${Date.now()}_${mentorId}`;
      
      // Mock successful request
      return {
        success: true,
        chatId
      };
    } catch (error) {
      console.error('Error requesting mentor chat:', error);
      return { success: false };
    }
  }

  async joinSupportGroup(groupId: string): Promise<boolean> {
    try {
      // In a real app, this would send a join request to the server
      await this.saveGroupMembershipLocally(groupId);
      return true;
    } catch (error) {
      console.error('Error joining support group:', error);
      return false;
    }
  }

  async likePost(postId: string): Promise<boolean> {
    try {
      // In a real app, this would update the like count on the server
      console.log(`Liked post: ${postId}`);
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  }

  async addComment(postId: string, content: string, isAnonymous: boolean = false): Promise<Comment> {
    try {
      const userData = await DataManager.getUserData();
      
      const comment: Comment = {
        id: `comment_${Date.now()}`,
        authorId: userData.id,
        authorName: isAnonymous ? 'ผู้ใช้ไม่ประสงค์ออกนาม' : userData.name || 'ผู้ใช้',
        content,
        isAnonymous,
        likes: 0,
        createdAt: new Date()
      };

      // In a real app, this would be sent to a server
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async reportContent(contentId: string, reason: string): Promise<boolean> {
    try {
      // In a real app, this would send a report to moderators
      console.log(`Reported content ${contentId} for: ${reason}`);
      return true;
    } catch (error) {
      console.error('Error reporting content:', error);
      return false;
    }
  }

  async getMyPosts(): Promise<CommunityPost[]> {
    try {
      const userData = await DataManager.getUserData();
      const allPosts = await this.getCommunityFeed(100);
      return allPosts.filter(post => post.authorId === userData.id);
    } catch (error) {
      console.error('Error getting my posts:', error);
      return [];
    }
  }

  private async savePostLocally(post: CommunityPost): Promise<void> {
    try {
      const existingPosts = await DataManager.getSecureData('community_posts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      posts.unshift(post);
      
      // Keep only last 50 posts locally
      const trimmedPosts = posts.slice(0, 50);
      await DataManager.storeSecureData('community_posts', JSON.stringify(trimmedPosts));
    } catch (error) {
      console.error('Error saving post locally:', error);
    }
  }

  private async saveGroupMembershipLocally(groupId: string): Promise<void> {
    try {
      const existingMemberships = await DataManager.getSecureData('group_memberships');
      const memberships = existingMemberships ? JSON.parse(existingMemberships) : [];
      
      if (!memberships.includes(groupId)) {
        memberships.push(groupId);
        await DataManager.storeSecureData('group_memberships', JSON.stringify(memberships));
      }
    } catch (error) {
      console.error('Error saving group membership:', error);
    }
  }
}

export const SocialFeatures = new SocialFeaturesClass();
