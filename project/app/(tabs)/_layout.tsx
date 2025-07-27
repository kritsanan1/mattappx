import { Tabs } from 'expo-router';
import { Chrome as Home, ChartBar as BarChart3, MessageCircle, BookOpen, User, Brain, Heart } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'ติดตาม',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'อารมณ์',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'AI วิเคราะห์',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Brain size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'ชุมชน',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'ทรัพยากร',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}