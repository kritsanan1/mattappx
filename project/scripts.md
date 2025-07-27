# Scripts Documentation

This document provides comprehensive information about all available npm scripts in the Thai Recovery App project.

## 📋 Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Starts the Expo development server with telemetry disabled | None | `npm run dev` | If port conflicts occur, Expo will automatically find an available port. Clear cache with `--clear` flag if needed |
| `build:web` | Builds the web version of the app for production deployment | `--platform web` (default) | `npm run build:web` | Ensure all web-compatible dependencies are installed. Check for platform-specific code that may break web builds |
| `lint` | Runs ESLint to check code quality and style consistency | `--fix` (optional) | `npm run lint` or `npm run lint -- --fix` | Fix auto-fixable issues with `--fix`. Check `.eslintrc.js` for custom rules. Ignore specific files with `.eslintignore` |

## 🔧 Detailed Script Information

### Development Script (`dev`)

**Purpose**: Launches the Expo development server for local development and testing.

**Environment Variables**:
- `EXPO_NO_TELEMETRY=1`: Disables telemetry data collection for privacy

**Usage Examples**:
```bash
# Standard development start
npm run dev

# Start with cache cleared
npx expo start --clear

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

**Expected Output**:
```
Starting Metro Bundler
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press d │ show developer menu
› Press shift+d │ toggle development mode

› Press ? │ show all commands
```

**Common Issues & Solutions**:

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Port already in use | `Error: listen EADDRINUSE :::8081` | Kill process on port 8081: `lsof -ti:8081 \| xargs kill -9` |
| Metro bundler cache issues | Stale imports, old code running | Clear cache: `npx expo start --clear` |
| Network connectivity | Can't connect from device | Check firewall settings, ensure devices on same network |
| Expo CLI outdated | Compatibility warnings | Update: `npm install -g @expo/cli@latest` |

### Build Script (`build:web`)

**Purpose**: Creates a production-ready web build of the React Native app.

**Build Process**:
1. Transpiles TypeScript to JavaScript
2. Bundles all assets and dependencies
3. Optimizes for web performance
4. Generates static files for deployment

**Usage Examples**:
```bash
# Standard web build
npm run build:web

# Build with custom output directory
npx expo export --platform web --output-dir ./dist

# Build with development mode
npx expo export --platform web --dev
```

**Output Structure**:
```
dist/
├── _expo/
│   ├── static/
│   │   ├── js/
│   │   ├── css/
│   │   └── media/
│   └── manifest.json
├── index.html
└── favicon.ico
```

**Deployment Ready Files**:
- `index.html`: Main application entry point
- `_expo/static/`: Bundled JavaScript, CSS, and assets
- `favicon.ico`: App icon for browsers

**Common Issues & Solutions**:

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Build fails with TypeScript errors | Compilation errors in terminal | Fix TypeScript errors: `npx tsc --noEmit` |
| Missing web dependencies | Runtime errors in browser | Install web-specific packages: `npx expo install react-native-web` |
| Large bundle size | Slow loading times | Analyze bundle: `npx expo export --platform web --dump-assetmap` |
| Asset loading issues | Images/fonts not loading | Check asset paths and ensure proper imports |

### Lint Script (`lint`)

**Purpose**: Analyzes code for potential errors, style violations, and maintains code quality standards.

**Configuration Files**:
- `eslint.config.js`: Main ESLint configuration
- `.prettierrc`: Code formatting rules
- `tsconfig.json`: TypeScript compiler options

**Usage Examples**:
```bash
# Check all files for issues
npm run lint

# Auto-fix fixable issues
npm run lint -- --fix

# Lint specific files
npx eslint src/components/profile/

# Lint with different output format
npx eslint . --format table
```

**Linting Rules Coverage**:
- **Code Quality**: Unused variables, unreachable code, potential bugs
- **Style Consistency**: Indentation, quotes, semicolons, spacing
- **React/React Native**: Hook rules, component patterns, JSX formatting
- **TypeScript**: Type safety, interface usage, proper typing
- **Expo Specific**: Platform-specific code, proper imports

**Common Issues & Solutions**:

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Parsing errors | `Parsing error: Unexpected token` | Check syntax, ensure proper TypeScript configuration |
| Rule conflicts | Conflicting style rules | Review `.eslintrc.js` and `.prettierrc` for conflicts |
| Performance issues | Slow linting process | Add files to `.eslintignore`, use `--cache` flag |
| False positives | Incorrect error reports | Disable specific rules with `// eslint-disable-next-line` |

## 🚀 Advanced Script Usage

### Custom Script Combinations

**Development with specific platform**:
```bash
# Start development server and open iOS simulator
npm run dev && npx expo start --ios
```

**Build and deploy pipeline**:
```bash
# Lint, build, and prepare for deployment
npm run lint && npm run build:web && echo "Ready for deployment"
```

**Quality assurance workflow**:
```bash
# Complete code quality check
npm run lint -- --fix && npm run build:web
```

### Environment-Specific Scripts

Add these to your `package.json` for different environments:

```json
{
  "scripts": {
    "dev:staging": "EXPO_PUBLIC_ENV=staging expo start",
    "dev:production": "EXPO_PUBLIC_ENV=production expo start",
    "build:staging": "EXPO_PUBLIC_ENV=staging npm run build:web",
    "build:production": "EXPO_PUBLIC_ENV=production npm run build:web"
  }
}
```

## 🔍 Script Debugging

### Enable Verbose Output

```bash
# Debug development server
DEBUG=expo:* npm run dev

# Verbose build output
npm run build:web -- --verbose

# Detailed lint output
npm run lint -- --debug
```

### Performance Monitoring

```bash
# Monitor build performance
time npm run build:web

# Profile Metro bundler
npx expo start --reset-cache --verbose
```

## 📊 Script Performance Metrics

| Script | Average Duration | Memory Usage | CPU Usage |
|--------|------------------|--------------|-----------|
| `dev` | 10-15 seconds | 200-300 MB | Low |
| `build:web` | 30-60 seconds | 500-800 MB | High |
| `lint` | 5-10 seconds | 100-200 MB | Medium |

## 🛠 Custom Script Development

### Adding New Scripts

When adding custom scripts to `package.json`:

1. **Follow naming conventions**: Use kebab-case
2. **Add documentation**: Update this file with new script details
3. **Include error handling**: Ensure scripts fail gracefully
4. **Test across platforms**: Verify compatibility with different OS

### Example Custom Script

```json
{
  "scripts": {
    "test:e2e": "detox test --configuration ios.sim.debug",
    "clean": "rm -rf node_modules && npm install",
    "analyze": "npx expo export --dump-assetmap && npx webpack-bundle-analyzer"
  }
}
```

## 📞 Support

If you encounter issues with any scripts:

1. **Check Prerequisites**: Ensure all required tools are installed
2. **Clear Cache**: Try clearing Metro and npm caches
3. **Update Dependencies**: Ensure all packages are up to date
4. **Check Documentation**: Refer to Expo and React Native docs
5. **Contact Team**: Reach out to the development team for assistance

---

**Last Updated**: 2024-01-15  
**Maintained By**: Thai Recovery Development Team