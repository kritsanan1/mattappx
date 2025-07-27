
import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../(tabs)/index';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  it('should render home screen without crashing', () => {
    const { getByText } = render(<HomeScreen />);
    
    // Check if key elements are rendered
    expect(getByText(/thai recovery/i)).toBeTruthy();
  });

  it('should display welcome message', () => {
    const { getByText } = render(<HomeScreen />);
    
    // Look for welcome or greeting text
    const welcomeElement = getByText(/welcome/i);
    expect(welcomeElement).toBeTruthy();
  });

  it('should render dashboard cards', () => {
    const { getByTestId } = render(<HomeScreen />);
    
    // Assuming you have testIDs on your dashboard elements
    expect(getByTestId('dashboard-container')).toBeTruthy();
  });
});
