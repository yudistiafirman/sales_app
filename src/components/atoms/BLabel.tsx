import React from 'react';
import { View, ViewStyle } from 'react-native';
import BText from './BText';

interface IProps {
  label: string;
  isRequired?: boolean;
  bold?:
    | 'bold'
    | '400'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}

const container: ViewStyle = {
  flexDirection: 'row',
};

const BLabel = ({ label, isRequired, bold }: IProps) => {
  return (
    <View style={container}>
      <BText bold={bold ? bold : '700'}>{label}</BText>
      {isRequired && (
        <BText color="primary" bold={bold ? bold : 'bold'}>
          {' '}
          *
        </BText>
      )}
    </View>
  );
};

export default BLabel;
