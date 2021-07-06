import React, { FC } from 'react';

import MaterialBottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Divider from '@material-ui/core/Divider';

import { BottomNavigationContainer } from './styles';

interface BottomNavigationProps {
  value: string;
  onChange(newValue: string): void;
}

const BottomNavigation: FC<BottomNavigationProps> = (props) => {
  const { value, onChange } = props;

  const handleBottomNavigationChange = (event: object, newValue: string) => {
    onChange(newValue);
  }

  return (
    <BottomNavigationContainer>
      <Divider />
      <MaterialBottomNavigation
        value={value}
        onChange={handleBottomNavigationChange}
        showLabels
      >
        <BottomNavigationAction label="Home" value="home" />
        <BottomNavigationAction label="PRs" value="rural-properties" />
        <BottomNavigationAction label="CEASA" value="ceasa" />
      </MaterialBottomNavigation>
    </BottomNavigationContainer>
  );
};

export default BottomNavigation;