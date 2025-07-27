
# File Structure Documentation

## Project Overview
Thai Recovery App - A React Native Expo application for addiction recovery support with AI-driven insights, mood tracking, and gamification features specifically tailored for Thai users.

```
thai-recovery-app/
├── 📄 .replit 🟢                                   # Replit configuration for development environment
├── 📄 AI_RULES.md 🟢                               # AI assistant development guidelines and tech stack
├── 📄 README.md 🟢                                 # Project overview, setup, and comprehensive documentation
├── 📄 app.json 🟢                                  # Expo app configuration and metadata
├── 📄 eslint.config.js 🟢                          # ESLint configuration for code quality
├── 📄 expo-env.d.ts 🟢                             # Expo TypeScript environment declarations
├── 📄 package-lock.json 🟢                         # NPM dependency lock file
├── 📄 package.json 🟡                              # Project dependencies, scripts, and metadata
├── 📄 pnpm-lock.yaml 🟢                            # PNPM dependency lock file (alternative package manager)
├── 📄 scripts.md 🟢                                # Comprehensive scripts documentation and usage
├── 📄 tsconfig.json 🟢                             # TypeScript compiler configuration
│
├── 📁 app/ (Main application routes and screens using Expo Router)
│   ├── 📄 _layout.tsx 🟡                           # Root layout with font loading and navigation setup
│   ├── 📄 modal.tsx 🟢                             # Modal presentation component
│   │
│   └── 📁 (tabs)/ (Tab-based navigation screens)
│       ├── 📄 _layout.tsx 🟡                       # Tab navigation configuration with Thai labels
│       ├── 📄 index.tsx 🟡                         # Home dashboard with recovery overview
│       ├── 📄 mood.tsx 🟡                          # Mood tracking and emotional state logging
│       ├── 📄 profile.tsx 🟡                       # User profile, settings, and account management
│       └── 📄 progress.tsx 🟡                      # Progress tracking and analytics visualization
│
├── 📁 attached_assets/ (Temporary assets and uploads)
│   └── 📄 Pasted-*.txt 🟢                          # Uploaded documentation specification file
│
├── 📁 components/ (Reusable UI components)
│   └── 📁 navigation/
│       └── 📄 TabBarIcon.tsx 🟢                    # Custom tab bar icon component with Ionicons
│
├── 📁 constants/ (Application constants and configuration)
│   └── 📄 Colors.ts 🟢                             # Theme colors for light and dark modes
│
├── 📁 hooks/ (Custom React hooks)
│   └── 📄 useFrameworkReady.ts 🟢                  # Framework initialization and readiness hook
│
├── 📁 src/ (Source code components and utilities)
│   └── 📁 components/ (Feature-specific components)
│       └── 📁 profile/ (Profile management components)
│           ├── 📄 AboutCard.tsx 🟢                 # App information and version display
│           ├── 📄 ProfileDataManagement.tsx 🟢    # PDPA compliance and data management
│           ├── 📄 ProfileForm.tsx 🟢               # User profile editing form
│           ├── 📄 ProfileGoals.tsx 🟢              # Personal recovery goals management
│           ├── 📄 ProfileHeader.tsx 🟡             # Profile header with user stats and avatar
│           └── 📄 ProfileSettings.tsx 🟢           # App settings and preferences
│
├── 📁 types/ (TypeScript type definitions)
│   └── 📄 declarations.d.ts 🟢                     # Module declarations for external libraries
│
└── 📁 utils/ (Utility classes and managers)
    ├── 📄 AIInsightsManager.ts 🟡                  # AI-driven recovery insights and pattern analysis
    ├── 📄 DataManager.ts 🟡                        # Secure data storage with encryption
    ├── 📄 GamificationManager.ts 🟡                # Achievement system and progress tracking
    ├── 📄 MoodTracker.ts 🟡                        # Mood logging and emotional analytics
    └── 📄 NotificationManager.ts 🟡                # Push notifications and reminders
```

## File Complexity Analysis

### 🟢 Low Complexity (0-3 imports) - 18 files
- Configuration files (.replit, app.json, tsconfig.json, etc.)
- Simple components (AboutCard, ProfileForm, ProfileGoals, etc.)
- Type definitions and declarations
- Constants and basic utilities

### 🟡 Medium Complexity (4-7 imports) - 10 files
- Main application screens (index.tsx, mood.tsx, progress.tsx, etc.)
- Layout components with navigation setup
- Complex utility managers with multiple dependencies
- Profile components with state management

### 🔴 High Complexity (8+ imports) - 0 files
- Well-maintained import discipline throughout the codebase
- No files exceed the high complexity threshold

## Architecture Patterns

### 📱 **Expo Router File-Based Navigation**
- Tab-based navigation using (tabs) directory convention
- Root layout with font loading and splash screen management
- Modal presentations and nested navigation

### 🏗️ **Component Organization**
- Feature-based component grouping (profile/, navigation/)
- Utility managers with single responsibilities
- Secure data handling with encryption

### 🔒 **Security & Privacy**
- PDPA compliance components
- Secure data storage utilities
- Privacy-first design patterns

### 🌐 **Internationalization**
- Thai language support with Noto Sans Thai fonts
- Localized UI labels and navigation
- Cultural considerations in design

**Total Files**: 28  
**Average Complexity**: Low to Medium  
**Architecture Score**: Well-organized and maintainable
