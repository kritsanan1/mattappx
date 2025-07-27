# File Structure Documentation

## Project Overview
Thai Recovery App - A React Native Expo application for addiction recovery support with AI-driven insights, mood tracking, and gamification features.

## File Tree Structure

```
thai-recovery-app/
├── 📄 .npmrc 🟢                                    # NPM configuration with legacy peer deps
├── 📄 .prettierrc 🟢                               # Code formatting configuration
├── 📄 AI_RULES.md 🟢                               # AI assistant development guidelines
├── 📄 README.md 🟢                                 # Project overview and basic setup
├── 📄 app.json 🟢                                  # Expo app configuration and metadata
├── 📄 eslint.config.js 🟢                          # ESLint configuration for code quality
├── 📄 expo-env.d.ts 🟢                             # Expo TypeScript environment declarations
├── 📄 filesExplainer.md 🟢                         # This file - project structure documentation
├── 📄 package.json 🟡                              # Project dependencies and scripts
├── 📄 tsconfig.json 🟢                             # TypeScript compiler configuration
│
├── 📁 app/ (Main application routes and screens)
│   ├── 📄 +not-found.tsx 🟢                        # 404 error page component
│   ├── 📄 _layout.tsx 🟡                           # Root layout with navigation setup
│   │
│   └── 📁 (tabs)/ (Tab-based navigation screens)
│       ├── 📄 _layout.tsx 🟡                       # Tab navigation configuration
│       ├── 📄 community.tsx 🟡                     # Community support and messaging
│       ├── 📄 index.tsx 🟡                         # Home dashboard screen
│       ├── 📄 insights.tsx 🟡                      # AI-driven recovery insights
│       ├── 📄 mood.tsx 🟡                          # Mood tracking and logging
│       ├── 📄 profile.tsx 🟡                       # User profile and settings
│       ├── 📄 resources.tsx 🟡                     # Recovery resources and guides
│       └── 📄 tracker.tsx 🟡                       # Craving tracking and logging
│
├── 📁 hooks/ (Custom React hooks)
│   └── 📄 useFrameworkReady.ts 🟢                  # Framework initialization hook
│
├── 📁 src/ (Source code components and utilities)
│   └── 📁 components/ (Reusable UI components)
│       └── 📁 profile/ (Profile-specific components)
│           ├── 📄 AboutCard.tsx 🟢                 # App information display component
│           ├── 📄 ProfileDataManagement.tsx 🟢    # PDPA compliance data management
│           ├── 📄 ProfileForm.tsx 🟢               # User profile editing form
│           ├── 📄 ProfileGoals.tsx 🟢              # Personal goals management
│           ├── 📄 ProfileHeader.tsx 🟡             # Profile header with stats
│           └── 📄 ProfileSettings.tsx 🟢           # Notification and privacy settings
│
├── 📁 types/ (TypeScript type definitions)
│   └── 📄 declarations.d.ts 🟢                     # Module declarations for external libraries
│
└── 📁 utils/ (Utility classes and managers)
    ├── 📄 AIInsightsManager.ts 🟡                  # AI-driven recovery insights and analysis
    ├── 📄 DataManager.ts 🟡                        # Secure data storage and encryption
    ├── 📄 GamificationManager.ts 🟡                # Badge system and user progress
    └── 📄 MoodTracker.ts 🟡                        # Mood logging and statistics
```

## File Complexity Analysis

### 🟢 Low Complexity (0-3 imports) - 15 files
- Configuration files (.npmrc, .prettierrc, app.json, etc.)
- Simple components (AboutCard, ProfileForm, ProfileGoals, etc.)
- Type definitions and declarations
- Basic utility files

### 🟡 Medium Complexity (4-7 imports) - 12 files
- Main application screens (index.tsx, mood.tsx, insights.tsx, etc.)
- Layout components (_layout.tsx files)
- Complex utility managers (DataManager, AIInsightsManager, etc.)
- Profile header component with multiple dependencies

### 🔴 High Complexity (8+ imports) - 0 files
- No files exceed the high complexity threshold
- Well-maintained import discipline throughout the codebase

## Architecture Patterns

### 📱 **React Native Expo Architecture**
- Tab-based navigation using Expo Router
- TypeScript for type safety
- Secure storage with expo-secure-store
- Cross-platform compatibility

### 🏗️ **Component Organization**
- Feature-based component grouping
- Reusable UI components in src/components/
- Screen-specific logic in app/(tabs)/
- Shared utilities in utils/

### 🔒 **Security & Privacy**
- PDPA compliance implementation
- Encrypted data storage
- Secure user data management
- Privacy controls and consent tracking

### 🎮 **Feature Modules**
- **DataManager**: Secure storage and encryption
- **MoodTracker**: Emotional state monitoring
- **AIInsightsManager**: Pattern analysis and recommendations
- **GamificationManager**: Achievement system and progress tracking

## Statistics Summary
- **Total Files**: 27
- **TypeScript Files**: 20 (74%)
- **Configuration Files**: 7 (26%)
- **Average Complexity**: Medium (well-structured codebase)
- **Architecture**: Feature-based with clear separation of concerns