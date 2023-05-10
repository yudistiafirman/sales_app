import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';

function BStatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

export default BStatusBar;
