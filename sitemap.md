
# Thai Recovery App - Sitemap

## 🗺️ Application Navigation Structure

This document outlines the complete navigation structure and user journey mapping for the Thai Recovery App.

## 📱 Main Navigation Flow

```
Thai Recovery App
├── 🏠 หน้าหลัก (Home/Dashboard)
│   ├── Welcome Message & Daily Motivation
│   ├── Quick Stats Overview
│   ├── Today's Goals
│   ├── Recent Activity Summary
│   ├── Quick Actions
│   │   ├── Log Mood
│   │   ├── Track Craving
│   │   ├── View Progress
│   │   └── Emergency Support
│   └── AI Insights Preview
│
├── 😊 อารมณ์ (Mood Tracking)
│   ├── Current Mood Entry
│   │   ├── Mood Scale (1-10)
│   │   ├── Emotion Categories
│   │   ├── Notes/Journal Entry
│   │   ├── Triggers Identification
│   │   └── Coping Strategies Used
│   ├── Mood History
│   │   ├── Daily Entries List
│   │   ├── Weekly Summary
│   │   ├── Monthly Overview
│   │   └── Search/Filter Options
│   ├── Mood Analytics
│   │   ├── Trend Charts
│   │   ├── Pattern Recognition
│   │   ├── Trigger Analysis
│   │   └── Correlation Reports
│   └── Mood Resources
│       ├── Coping Techniques
│       ├── Mindfulness Exercises
│       ├── Emergency Contacts
│       └── Professional Help
│
├── 📈 ความคืบหน้า (Progress & Analytics)
│   ├── Recovery Overview
│   │   ├── Days Sober Counter
│   │   ├── Milestone Achievements
│   │   ├── Goal Progress
│   │   └── Overall Health Score
│   ├── Detailed Analytics
│   │   ├── Mood Trends
│   │   ├── Activity Patterns
│   │   ├── Goal Completion Rates
│   │   ├── Streak Tracking
│   │   └── Weekly/Monthly Reports
│   ├── Achievements & Badges
│   │   ├── Recovery Milestones
│   │   ├── Consistency Awards
│   │   ├── Goal Achievements
│   │   ├── Special Recognitions
│   │   └── Badge Collection
│   ├── Goal Management
│   │   ├── Current Goals
│   │   ├── Completed Goals
│   │   ├── Goal Creation
│   │   ├── Goal Editing
│   │   └── Goal Tracking
│   └── Progress Sharing
│       ├── Progress Reports
│       ├── Share with Support Network
│       ├── Export Data
│       └── Print Reports
│
└── 👤 โปรไฟล์ (Profile & Settings)
    ├── User Profile
    │   ├── Personal Information
    │   ├── Recovery Start Date
    │   ├── Profile Picture
    │   ├── Recovery Goals
    │   └── Bio/Story (Optional)
    ├── Account Settings
    │   ├── Security Settings
    │   ├── Privacy Controls
    │   ├── Notification Preferences
    │   ├── Language Selection
    │   └── Theme Selection
    ├── Data Management
    │   ├── Data Export (PDPA)
    │   ├── Data Deletion (PDPA)
    │   ├── Privacy Settings
    │   ├── Consent Management
    │   └── Data Usage Reports
    ├── App Information
    │   ├── About the App
    │   ├── Version Information
    │   ├── Privacy Policy
    │   ├── Terms of Service
    │   └── Contact Support
    └── Recovery Resources
        ├── Educational Content
        ├── Professional Contacts
        ├── Support Groups
        ├── Crisis Hotlines
        └── Helpful Links
```

## 🔄 User Journey Mapping

### 🆕 New User Journey

```
App Launch → Onboarding → Profile Setup → Tutorial → Dashboard
     ↓              ↓            ↓           ↓          ↓
First Time     Welcome Flow   Basic Info   Feature    Begin
Experience     (3-4 screens)  Collection   Guide      Journey
```

**Onboarding Screens:**
1. **Welcome Screen** - App introduction and purpose
2. **Privacy & Consent** - PDPA compliance and data usage
3. **Profile Setup** - Basic information collection
4. **Recovery Goals** - Initial goal setting
5. **Tutorial** - Feature overview and navigation guide
6. **Dashboard** - First-time dashboard with sample data

### 🏃‍♀️ Daily User Journey

```
App Open → Dashboard → Quick Action → Feature Use → Return to Dashboard
    ↓         ↓           ↓             ↓              ↓
Morning   Overview    Mood/Goal      Deep Dive      Continue
Check-in  Review      Tracking       Analysis       Journey
```

**Typical Daily Flow:**
1. **Morning Check-in** - Review overnight insights and plan day
2. **Mood Logging** - Multiple times throughout day
3. **Progress Review** - Evening reflection and planning
4. **Goal Updates** - Weekly goal review and adjustment

### 🎯 Feature Discovery Journey

```
Dashboard Widget → Full Feature → Deep Analytics → Action Planning
       ↓              ↓              ↓               ↓
   Preview        Complete View   Detailed        Next Steps
   Content        of Feature      Analysis        & Goals
```

## 📊 Screen Hierarchy & Access Patterns

### 🏠 Dashboard (Home) - Entry Point

**Primary Access Points:**
- App launch (default)
- Tab navigation
- Return from other screens

**Quick Actions Available:**
- Mood entry (1 tap)
- Progress view (1 tap)
- Goal check-in (1 tap)
- Emergency support (1 tap)

**Information Density:**
- High-level overview
- Recent activity
- Key metrics
- Action prompts

### 😊 Mood Tracking - High Frequency

**Access Patterns:**
- Direct from dashboard (1 tap)
- Tab navigation
- Notification prompts
- Widget shortcuts

**User Flow:**
```
Mood Tab → Current Entry → (Optional) History → Return
    ↓           ↓              ↓               ↓
Main View   Input Form     Past Entries    Dashboard
```

**Screen Depths:**
- Level 1: Mood entry form
- Level 2: Mood history list
- Level 3: Individual entry details
- Level 4: Analytics and insights

### 📈 Progress - Medium Frequency

**Access Patterns:**
- Weekly review sessions
- Achievement notifications
- Goal deadline reminders
- Milestone celebrations

**Information Architecture:**
```
Progress Tab → Overview → Detailed Analytics → Action Items
     ↓            ↓            ↓                ↓
Main Dashboard  Charts &    Deep Dive       Goal Updates
               Graphs      Analysis         & Planning
```

### 👤 Profile - Low Frequency

**Access Patterns:**
- Initial setup
- Settings adjustment
- Privacy management
- Account maintenance

**Organization:**
```
Profile Tab → Settings Category → Specific Setting → Confirmation
     ↓              ↓                    ↓              ↓
Main Profile   Personal/Privacy/    Individual       Save/Update
    View       App/Data/About      Setting Page     Confirmation
```

## 🔗 Cross-Feature Navigation

### Deep Linking Structure

```
thairecovery://
├── dashboard/
├── mood/
│   ├── entry/
│   ├── history/
│   └── analytics/
├── progress/
│   ├── overview/
│   ├── goals/
│   └── achievements/
├── profile/
│   ├── settings/
│   ├── privacy/
│   └── about/
└── emergency/
```

### Modal & Overlay Screens

**Modal Presentations:**
- Goal creation/editing
- Mood entry form
- Settings panels
- Emergency support
- Data export/import
- Privacy consent forms

**Overlay Components:**
- Tooltips and help
- Confirmation dialogs
- Loading states
- Error messages
- Success notifications

## 🎯 Navigation Patterns

### Tab Navigation (Primary)

**Tab Structure:**
```
📱 Tab Bar (Always Visible)
├── 🏠 หน้าหลัก (Home)
├── 😊 อารมณ์ (Mood)
├── 📈 ความคืบหน้า (Progress)
└── 👤 โปรไฟล์ (Profile)
```

**Tab Behavior:**
- Persistent bottom navigation
- Badge notifications for updates
- Quick access to main features
- State preservation between tabs

### Stack Navigation (Secondary)

**Stack Patterns:**
- Modal presentations for forms
- Detail screens for data exploration
- Settings and configuration screens
- Help and information screens

### Gesture Navigation

**Supported Gestures:**
- Swipe between tabs (optional)
- Pull to refresh data
- Swipe to dismiss modals
- Pinch to zoom charts
- Long press for context menus

## 📱 Platform-Specific Considerations

### iOS Navigation

**iOS-Specific Features:**
- Back gesture (swipe from left edge)
- 3D Touch quick actions (if supported)
- Spotlight search integration
- Siri Shortcuts support
- Widget support (iOS 14+)

### Android Navigation

**Android-Specific Features:**
- Hardware back button support
- App shortcuts (long press app icon)
- Android Auto integration (future)
- Google Assistant actions
- Android widgets

### Web (PWA) Navigation

**Web-Specific Features:**
- Browser back/forward buttons
- URL routing for deep links
- Keyboard navigation support
- Desktop-optimized layouts
- Bookmark support

## 🔄 State Management

### Navigation State

**Persistent State:**
- Current tab selection
- Navigation history
- Form data (temporary)
- User preferences

**Session State:**
- Login status
- User permissions
- Feature flags
- Network connectivity

### Deep State Preservation

**State Restoration:**
- App backgrounding/foregrounding
- Memory pressure recovery
- Crash recovery
- Update installations

## 📊 Analytics & User Flow Tracking

### Navigation Analytics

**Tracked Events:**
- Screen views and duration
- Tab switches and frequency
- Feature usage patterns
- User journey completion
- Drop-off points

**User Behavior Metrics:**
- Most visited screens
- Average session duration
- Feature adoption rates
- Navigation pain points
- Conversion funnels

### Performance Monitoring

**Navigation Performance:**
- Screen transition times
- Tab switch performance
- Deep link resolution
- State restoration speed
- Memory usage patterns

## 🎯 Accessibility Navigation

### Screen Reader Support

**Navigation Announcements:**
- Screen titles and context
- Tab descriptions
- Button actions
- Form field labels
- Error messages

### Keyboard Navigation

**Keyboard Accessibility:**
- Tab order management
- Focus indicators
- Keyboard shortcuts
- Skip links
- Escape key handling

### Voice Control

**Voice Navigation:**
- Voice commands for navigation
- Screen content reading
- Action execution by voice
- Navigation assistance

## 🔮 Future Navigation Enhancements

### Planned Features

**Enhanced Navigation:**
- Smart navigation suggestions
- Personalized quick actions
- Contextual menus
- Advanced search functionality
- Cross-feature workflows

**AI-Powered Features:**
- Intelligent content recommendations
- Predictive navigation
- Personalized dashboards
- Smart notifications
- Adaptive interfaces

This sitemap provides a comprehensive overview of the Thai Recovery App's navigation structure, ensuring users can efficiently access all features while maintaining a logical and intuitive user experience.
