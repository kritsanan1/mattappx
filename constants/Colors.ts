
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark theme.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#667eea';
const tintColorDark = '#8b5cf6';

export const Colors = {
  light: {
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    background: '#f8fafc',
    backgroundSecondary: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Surface Colors
    surface: '#ffffff',
    surfaceSecondary: '#f1f5f9',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Brand Colors
    primary: '#667eea',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    
    // Mood Colors
    moodVeryBad: '#ef4444',
    moodBad: '#f97316',
    moodNeutral: '#6b7280',
    moodGood: '#10b981',
    moodVeryGood: '#059669',
    
    // Calm UI Colors
    calm: {
      background: '#f8fafc',
      surface: '#ffffff',
      primary: '#667eea',
      secondary: '#94a3b8',
      accent: '#e0e7ff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.08)',
    }
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Surface Colors
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    border: '#334155',
    borderLight: '#475569',
    
    // Brand Colors
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    
    // Mood Colors
    moodVeryBad: '#ef4444',
    moodBad: '#f97316',
    moodNeutral: '#6b7280',
    moodGood: '#10b981',
    moodVeryGood: '#059669',
    
    // Calm UI Colors (Dark Mode)
    calm: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#312e81',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      border: '#334155',
      shadow: 'rgba(0, 0, 0, 0.25)',
    }
  },
};
