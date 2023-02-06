import React from 'react';
import { View, ViewStyle } from 'react-native';
import BText from './BText';

interface IProps {
  label: string;
  isRequired?: boolean;
}

const container: ViewStyle = {
  flexDirection: 'row',
};

const BLabel = ({ label, isRequired }: IProps) => {
  return (
    <View style={container}>
      <BText bold="700">{label}</BText>
      {isRequired && (
        <BText color="primary" bold="bold">
          {' '}
          *
        </BText>
      )}
    </View>
  );
};

export default BLabel;
