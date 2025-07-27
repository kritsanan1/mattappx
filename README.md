# Thai Recovery App

A comprehensive React Native Expo application designed to support addiction recovery with AI-driven insights, mood tracking, gamification features, and community support specifically tailored for Thai users.

## 🎯 Project Overview

Thai Recovery App provides a holistic approach to addiction recovery through:
- **AI-Powered Insights**: Pattern analysis and personalized recommendations
- **Mood Tracking**: Emotional state monitoring with detailed analytics
- **Craving Management**: Comprehensive tracking and coping strategies
- **Community Support**: Anonymous peer support and messaging
- **Gamification**: Achievement system with badges and progress tracking
- **Resource Library**: Self-help guides, meditation exercises, and emergency contacts
- **PDPA Compliance**: Full data privacy and user rights protection

## 🛠 Technical Stack

- **Framework**: React Native with Expo SDK 53.0.20
- **Language**: TypeScript for type safety and better developer experience
- **Navigation**: Expo Router 5.1.4 with tab-based navigation
- **State Management**: React hooks and local state
- **Data Storage**: Expo SecureStore with encryption for sensitive data
- **Notifications**: Expo Notifications for motivational alerts
- **Styling**: React Native StyleSheet with custom components
- **Icons**: Lucide React Native for consistent iconography
- **Charts**: React Native Chart Kit for data visualization
- **Fonts**: Noto Sans Thai for proper Thai language support

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or yarn 1.22.0+)
- **Expo CLI**: Latest version (`npm install -g @expo/cli`)
- **Git**: For version control
- **iOS Simulator** (macOS only) or **Android Studio** (for Android development)
- **Physical device** with Expo Go app for testing

### System Requirements

**macOS:**
- macOS 10.15 (Catalina) or newer
- Xcode 12.0 or newer (for iOS development)

**Windows:**
- Windows 10 version 1903 or newer
- Android Studio with Android SDK

**Linux:**
- Ubuntu 18.04 LTS or newer
- Android Studio with Android SDK

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/thai-recovery-app.git
cd thai-recovery-app
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration

Create environment files based on the examples:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# App Configuration
EXPO_PUBLIC_APP_NAME=Thai Recovery
EXPO_PUBLIC_APP_VERSION=1.0.0

# API Configuration (if using external services)
EXPO_PUBLIC_API_URL=https://api.thairecovery.com
EXPO_PUBLIC_API_KEY=your_api_key_here

# Analytics (optional)
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_INSIGHTS=true
EXPO_PUBLIC_ENABLE_COMMUNITY=true
```

### 4. Font Setup

The app uses Noto Sans Thai fonts which are automatically loaded. No additional setup required.

### 5. Start Development Server

```bash
# Start Expo development server
npm run dev

# Or with yarn
yarn dev
```

### 6. Run on Device/Simulator

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan QR code with Expo Go app

## 🏗 Project Structure

```
thai-recovery-app/
├── 📄 app.json                    # Expo app configuration
├── 📄 package.json               # Dependencies and scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 .prettierrc                # Code formatting rules
├── 📄 eslint.config.js           # Linting configuration
├── 📄 AI_RULES.md                # Development guidelines
│
├── 📁 app/                       # Main application routes
│   ├── 📄 _layout.tsx            # Root layout with navigation
│   ├── 📄 +not-found.tsx         # 404 error page
│   └── 📁 (tabs)/               # Tab-based navigation
│       ├── 📄 _layout.tsx        # Tab navigation config
│       ├── 📄 index.tsx          # Home dashboard
│       ├── 📄 tracker.tsx        # Craving tracking
│       ├── 📄 mood.tsx           # Mood tracking
│       ├── 📄 insights.tsx       # AI insights
│       ├── 📄 community.tsx      # Community support
│       ├── 📄 resources.tsx      # Help resources
│       └── 📄 profile.tsx        # User profile
│
├── 📁 src/                       # Source components
│   └── 📁 components/            # Reusable UI components
│       └── 📁 profile/           # Profile-specific components
│
├── 📁 utils/                     # Utility classes
│   ├── 📄 DataManager.ts         # Secure data storage
│   ├── 📄 MoodTracker.ts         # Mood tracking logic
│   ├── 📄 AIInsightsManager.ts   # AI analysis engine
│   └── 📄 GamificationManager.ts # Achievement system
│
├── 📁 hooks/                     # Custom React hooks
├── 📁 types/                     # TypeScript definitions
└── 📁 assets/                    # Static assets
```

## 🔧 Development Guidelines

### Code Style

We follow strict TypeScript and React Native conventions:

```typescript
// ✅ Good: Proper interface definition
interface UserData {
  id: string;
  name: string;
  soberStartDate: string;
  goals: string[];
}

// ✅ Good: Functional component with proper typing
const ProfileCard: React.FC<{ user: UserData }> = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
};

// ✅ Good: StyleSheet usage
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

### File Organization

- **Components**: One component per file, named with PascalCase
- **Utilities**: Singleton classes with clear responsibilities
- **Types**: Centralized in `types/` directory
- **Styles**: Use StyleSheet.create() for all styling

### Git Workflow

**Branch Naming Convention:**
```
feature/TRA-123-add-mood-tracking
bugfix/TRA-456-fix-notification-crash
hotfix/TRA-789-security-patch
```

**Commit Messages:**
```
feat(mood): add mood tracking with analytics
fix(auth): resolve login validation issue
docs(readme): update installation instructions
```

### Pull Request Template

```markdown
## 📝 Description
Brief description of changes made.

## 🔄 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested on iOS
- [ ] Tested on Android

## 📱 Screenshots
Include screenshots for UI changes.

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🚀 Deployment

### Development Build

```bash
# Create development build
npx expo build:android --type apk
npx expo build:ios --type simulator
```

### Production Build

```bash
# Build for production
npx expo build:android --type app-bundle
npx expo build:ios --type archive
```

### Environment-Specific Deployments

**Staging:**
```bash
EXPO_PUBLIC_ENV=staging npx expo publish --release-channel staging
```

**Production:**
```bash
EXPO_PUBLIC_ENV=production npx expo publish --release-channel production
```

## 🔐 Security Considerations

### Data Protection
- All sensitive data encrypted using Expo SecureStore
- PDPA compliance with user consent management
- Anonymous mode for community features
- Secure key generation and storage

### Privacy Features
- Optional data sharing controls
- Complete data export functionality
- Right to deletion (GDPR/PDPA compliant)
- Anonymous community participation

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Individual component and utility testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Complete user journey testing
- **Manual Testing**: Device-specific testing

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS build failures:**
```bash
cd ios && pod install && cd ..
npx expo run:ios
```

**Android build issues:**
```bash
npx expo run:android --variant debug
```

**Font loading issues:**
```bash
npx expo install --fix
```

### Debug Mode

Enable debug logging:
```typescript
// In app/_layout.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
}
```

## 📊 Performance Monitoring

### Key Metrics
- App startup time
- Screen transition performance
- Memory usage
- Battery consumption
- Network requests

### Optimization Tips
- Use FlatList for large datasets
- Implement proper image caching
- Minimize re-renders with React.memo
- Use lazy loading for heavy components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Review Checklist

- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Documentation is updated
- [ ] Performance impact considered
- [ ] Accessibility guidelines followed
- [ ] Security best practices applied

## 📞 Support

### Emergency Contacts
- **Technical Issues**: dev-team@thairecovery.com
- **Security Concerns**: security@thairecovery.com
- **General Support**: support@thairecovery.com

### Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thai Department of Mental Health for guidance
- Recovery community for feedback and testing
- Open source contributors and maintainers

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Maintainers**: Thai Recovery Development Team"# mattappx" 
