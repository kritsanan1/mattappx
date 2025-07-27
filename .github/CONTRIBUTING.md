
# Contributing to Thai Recovery App

Thank you for your interest in contributing to the Thai Recovery App! This document provides guidelines and information for contributors.

## 🎯 Project Mission

The Thai Recovery App is designed to support individuals in their addiction recovery journey with culturally appropriate tools, AI-driven insights, and evidence-based practices specifically tailored for Thai users.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Requirements](#documentation-requirements)
- [Security & Privacy](#security--privacy)
- [Localization](#localization)
- [Review Process](#review-process)

## 🤝 Code of Conduct

### Our Commitment

We are committed to providing a safe, inclusive, and supportive environment for all contributors, especially considering the sensitive nature of addiction recovery.

### Expected Behavior

- **Respectful Communication**: Use inclusive language and be respectful of different viewpoints
- **Privacy Awareness**: Never request or share personal recovery information
- **Professional Conduct**: Maintain professional behavior in all interactions
- **Cultural Sensitivity**: Respect Thai cultural values and recovery approaches
- **Evidence-Based Approach**: Support suggestions with research or best practices

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Sharing personal recovery stories without consent
- Promoting unproven or harmful recovery methods
- Violating user privacy or confidentiality
- Disrespectful comments about addiction or recovery

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

```bash
# Required Software
Node.js >= 18.0.0
npm >= 8.0.0 or yarn >= 1.22.0
Git
Expo CLI (npm install -g @expo/cli)

# Recommended Tools
Visual Studio Code with extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Hero
- ESLint
- Prettier
- GitLens
```

### First-Time Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/your-username/thai-recovery-app.git
   cd thai-recovery-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with appropriate values
   ```

4. **Verify Setup**
   ```bash
   npm run dev
   # Should start Expo development server
   ```

## 🛠 Development Setup

### Branch Strategy

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features
staging       # Pre-production testing

# Feature branches
feature/TRA-123-mood-tracking-ui
bugfix/TRA-456-profile-crash
hotfix/TRA-789-security-patch
```

### Local Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Clear cache if needed
npx expo start -c
```

## 🔄 Contributing Process

### 1. Issue Creation

Before starting work:

- **Check existing issues** to avoid duplicates
- **Create a detailed issue** using appropriate templates
- **Wait for approval** from maintainers before starting work

### 2. Development Workflow

```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/TRA-123-feature-name

# 2. Make changes following coding standards
# 3. Test thoroughly on multiple platforms
# 4. Commit with clear messages

git add .
git commit -m "feat(mood): add mood tracking chart component

- Implement line chart for mood trends
- Add date range selector
- Include accessibility labels
- Support Thai and English languages

Closes #123"

# 5. Push and create pull request
git push origin feature/TRA-123-feature-name
```

### 3. Pull Request Process

1. **Create PR** using the provided template
2. **Fill all sections** completely and accurately
3. **Request reviews** from appropriate team members
4. **Address feedback** promptly and professionally
5. **Ensure CI/CD passes** all checks

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Proper interface definition
interface UserProfile {
  id: string;
  name: string;
  soberStartDate: Date;
  goals: RecoveryGoal[];
  preferences: UserPreferences;
}

// ✅ Good: Function with proper typing
const calculateSoberDays = (startDate: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ✅ Good: Component with proper props
interface MoodTrackerProps {
  userId: string;
  onMoodSubmit: (mood: MoodEntry) => void;
  isLoading?: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  userId, 
  onMoodSubmit, 
  isLoading = false 
}) => {
  // Implementation
};
```

### React Native Best Practices

```typescript
// ✅ Good: StyleSheet usage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'NotoSansThai_700Bold',
  },
});

// ✅ Good: Accessibility support
<TouchableOpacity
  style={styles.button}
  onPress={handlePress}
  accessible={true}
  accessibilityLabel="Submit mood entry"
  accessibilityHint="Tap to save your current mood"
  accessibilityRole="button"
>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
```

### File Organization

```
src/features/mood-tracking/
├── components/
│   ├── MoodSelector.tsx
│   ├── MoodChart.tsx
│   └── MoodHistory.tsx
├── hooks/
│   ├── useMoodTracking.ts
│   └── useMoodAnalytics.ts
├── utils/
│   ├── moodCalculations.ts
│   └── moodValidation.ts
└── types/
    └── mood.ts
```

### Naming Conventions

```typescript
// Files: PascalCase for components, camelCase for utilities
MoodSelector.tsx
useMoodTracking.ts
moodCalculations.ts

// Variables and functions: camelCase
const currentMood = 'happy';
const calculateMoodAverage = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_MOOD_ENTRIES = 100;
const DEFAULT_MOOD_SCALE = 10;

// Interfaces: PascalCase with descriptive names
interface MoodEntry {
  id: string;
  value: number;
  timestamp: Date;
}
```

## 🧪 Testing Guidelines

### Testing Requirements

All contributions must include appropriate tests:

```typescript
// ✅ Component Testing
import { render, fireEvent } from '@testing-library/react-native';
import { MoodSelector } from '../MoodSelector';

describe('MoodSelector', () => {
  it('should render mood options correctly', () => {
    const onMoodSelect = jest.fn();
    const { getByText } = render(
      <MoodSelector onMoodSelect={onMoodSelect} />
    );
    
    expect(getByText('😊 Happy')).toBeTruthy();
    expect(getByText('😢 Sad')).toBeTruthy();
  });

  it('should call onMoodSelect when mood is selected', () => {
    const onMoodSelect = jest.fn();
    const { getByText } = render(
      <MoodSelector onMoodSelect={onMoodSelect} />
    );
    
    fireEvent.press(getByText('😊 Happy'));
    expect(onMoodSelect).toHaveBeenCalledWith('happy');
  });
});

// ✅ Utility Testing
import { calculateMoodTrend } from '../moodCalculations';

describe('moodCalculations', () => {
  it('should calculate positive trend correctly', () => {
    const moodData = [
      { value: 5, timestamp: new Date('2024-01-01') },
      { value: 7, timestamp: new Date('2024-01-02') },
      { value: 8, timestamp: new Date('2024-01-03') },
    ];
    
    const trend = calculateMoodTrend(moodData);
    expect(trend).toBe('improving');
  });
});
```

### Testing Checklist

- [ ] Unit tests for new functions/components
- [ ] Integration tests for feature workflows
- [ ] Accessibility testing
- [ ] Multi-platform testing (iOS/Android)
- [ ] Thai language testing
- [ ] Edge case testing
- [ ] Error handling testing

## 📚 Documentation Requirements

### Code Documentation

```typescript
/**
 * Calculates the user's recovery progress based on various metrics
 * 
 * @param startDate - The date when recovery journey began
 * @param moodEntries - Array of mood tracking entries
 * @param goals - User's recovery goals
 * @returns Progress object with completion percentage and insights
 * 
 * @example
 * ```typescript
 * const progress = calculateRecoveryProgress(
 *   new Date('2024-01-01'),
 *   moodEntries,
 *   userGoals
 * );
 * console.log(`Progress: ${progress.percentage}%`);
 * ```
 */
const calculateRecoveryProgress = (
  startDate: Date,
  moodEntries: MoodEntry[],
  goals: RecoveryGoal[]
): RecoveryProgress => {
  // Implementation
};
```

### Documentation Updates

When making changes, update:

- [ ] README.md (if setup process changes)
- [ ] API documentation (if APIs change)
- [ ] Architecture documentation (if structure changes)
- [ ] User guides (if user-facing features change)
- [ ] Code comments (for complex logic)

## 🔒 Security & Privacy

### Security Requirements

All contributions must consider:

```typescript
// ✅ Good: Secure data handling
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const storeUserData = async (userData: UserData) => {
  try {
    // Encrypt sensitive data before storage
    const encryptedData = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      JSON.stringify(userData)
    );
    
    await SecureStore.setItemAsync('userData', encryptedData);
  } catch (error) {
    console.error('Failed to store user data securely:', error);
  }
};

// ✅ Good: Input validation
const validateMoodEntry = (entry: MoodEntry): boolean => {
  if (!entry.id || typeof entry.id !== 'string') return false;
  if (!Number.isInteger(entry.value) || entry.value < 1 || entry.value > 10) return false;
  if (!(entry.timestamp instanceof Date) || isNaN(entry.timestamp.getTime())) return false;
  return true;
};
```

### Privacy Considerations

- **Data Minimization**: Only collect necessary data
- **User Consent**: Explicit consent for data collection
- **Data Encryption**: Encrypt all sensitive data
- **Anonymous Options**: Provide anonymous usage options
- **Right to Deletion**: Support complete data removal

### PDPA Compliance

```typescript
// ✅ Good: PDPA-compliant data handling
interface DataProcessingConsent {
  collection: boolean;
  processing: boolean;
  sharing: boolean;
  marketing: boolean;
  timestamp: Date;
}

const requestDataProcessingConsent = async (): Promise<DataProcessingConsent> => {
  // Show consent form in Thai language
  // Store consent decisions securely
  // Provide easy withdrawal mechanism
};
```

## 🌐 Localization

### Language Support

The app supports Thai and English languages:

```typescript
// ✅ Good: Localized text
const texts = {
  th: {
    mood: {
      happy: 'มีความสุข',
      sad: 'เศร้า',
      angry: 'โกรธ',
      calm: 'สงบ',
    },
    actions: {
      submit: 'ส่ง',
      cancel: 'ยกเลิก',
      save: 'บันทึก',
    },
  },
  en: {
    mood: {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      calm: 'Calm',
    },
    actions: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
    },
  },
};

// ✅ Good: Text externalization
const getText = (key: string, language: 'th' | 'en' = 'th') => {
  return texts[language][key] || key;
};
```

### Cultural Considerations

- **Thai Cultural Values**: Respect for family, community, and Buddhism
- **Recovery Approaches**: Integrate traditional Thai healing concepts
- **Visual Design**: Use culturally appropriate colors and imagery
- **Content Sensitivity**: Consider Thai attitudes toward mental health

## 🔍 Review Process

### Review Criteria

All pull requests are reviewed for:

**Technical Quality:**
- [ ] Code follows style guidelines
- [ ] TypeScript types are proper
- [ ] Performance considerations addressed
- [ ] Security best practices followed

**Functionality:**
- [ ] Features work as specified
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] User experience is intuitive

**Recovery App Specific:**
- [ ] Supports recovery goals
- [ ] Maintains user privacy
- [ ] Culturally appropriate
- [ ] Evidence-based approach

**Testing & Documentation:**
- [ ] Adequate test coverage
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Multi-platform tested

### Review Timeline

- **Initial Review**: Within 2 business days
- **Feedback Response**: Within 1 business day
- **Final Approval**: Within 1 business day after all feedback addressed
- **Merge**: Immediately after approval

### Review Assignments

- **Frontend Changes**: UI/UX team + Frontend developers
- **Backend Changes**: Backend developers + DevOps
- **Security Changes**: Security team + Senior developers
- **Recovery Features**: Product team + Clinical advisors

## 🎯 Recovery App Guidelines

### Evidence-Based Practices

All recovery features should be based on:
- Peer-reviewed research
- Clinical best practices
- Established recovery methodologies
- Cultural appropriateness for Thai users

### User Safety

Priority considerations:
- Crisis intervention features
- Emergency contact accessibility
- Harmful content prevention
- Professional resource connections

### Ethical Development

- Never replace professional treatment
- Promote healthy coping strategies
- Respect user autonomy
- Maintain hope and positivity

## 📞 Getting Help

### Development Questions

- **Technical Issues**: Create an issue with 'question' label
- **Architecture Decisions**: Tag @tech-leads in discussions
- **Recovery Features**: Consult with @clinical-team

### Community

- **GitHub Discussions**: For general questions and ideas
- **Issue Tracker**: For bugs and feature requests
- **Email**: dev-team@thairecovery.com for private concerns

### Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Thai Localization Guidelines](./docs/thai-localization.md)

## 🙏 Recognition

Contributors are recognized through:
- **Contributors section** in README.md
- **Release notes** for significant contributions
- **Community highlights** in project updates
- **Professional references** when appropriate

Thank you for contributing to the Thai Recovery App and helping support individuals in their recovery journey! 🌟
