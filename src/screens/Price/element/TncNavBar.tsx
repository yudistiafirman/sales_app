/* eslint-disable react-native/no-inline-styles */
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import { TextStyle, View, ViewStyle } from 'react-native';
import BText from '../../../components/atoms/BText';
import * as React from 'react';

interface TncBarProps {
  rightComponent?: React.ReactNode | undefined;
  leftComponent?: React.ReactNode | undefined;
  headerTitle?: string | undefined;
}

const TncNavBar = ({
  leftComponent,
  rightComponent,
  headerTitle,
}: TncBarProps) => {
  const NavbarContainerStyles: ViewStyle = {
    height: scaleSize.moderateScale(66),
    flexDirection: 'row',
    alignItems: 'center'
  };

  const leftComponentStyles: ViewStyle = {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  };
  const centerComponentStyles: ViewStyle = {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: leftComponent ? 'flex-start' : 'flex-end',
  };
  const rightComponentStyles: ViewStyle = {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'flex-end',
  };
  const titleStyles: TextStyle = {
    fontFamily: font.family.montserrat['600'],
    fontSize: font.size.lg,
    color: colors.text.darker,
  };
  return (
    <View style={NavbarContainerStyles}>
      {leftComponent && (
        <View style={leftComponentStyles}>{leftComponent}</View>
      )}

      <View
        style={[centerComponentStyles, { flex: rightComponent ? 0.55 : 0.9 }]}
      >
        <BText style={titleStyles}>{headerTitle}</BText>
      </View>
      {rightComponent && (
        <View style={rightComponentStyles}>{rightComponent}</View>
      )}
    </View>
  );
};

export default TncNavBar;
