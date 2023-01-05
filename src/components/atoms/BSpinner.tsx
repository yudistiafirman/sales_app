import colors from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface BSpinnerProps {
  size?: 'large' | 'small';
  color?: string;
}

const BSpinnerDefaultProps = {
  size: 'small',
  color: colors.primary,
};

const BSpinner = ({
  size,
  color,
}: BSpinnerProps & typeof BSpinnerDefaultProps) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator animating size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

BSpinner.defaultProps = BSpinnerDefaultProps;

export default BSpinner;
