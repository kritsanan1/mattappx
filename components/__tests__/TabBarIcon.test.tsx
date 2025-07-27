
import React from 'react';
import { render } from '@testing-library/react-native';
import { TabBarIcon } from '../navigation/TabBarIcon';

describe('TabBarIcon', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(
      <TabBarIcon name="Home" testID="tab-icon" />
    );

    const icon = getByTestId('tab-icon');
    expect(icon).toBeTruthy();
  });

  it('should apply color prop correctly', () => {
    const { getByTestId } = render(
      <TabBarIcon name="Home" color="#FF0000" testID="tab-icon" />
    );

    const icon = getByTestId('tab-icon');
    expect(icon.props.color).toBe('#FF0000');
  });

  it('should apply custom style', () => {
    const customStyle = { marginLeft: 10 };
    
    const { getByTestId } = render(
      <TabBarIcon 
        name="Home" 
        style={customStyle}
        testID="tab-icon"
      />
    );

    const icon = getByTestId('tab-icon');
    expect(icon.props.style).toContainEqual(customStyle);
  });
});
