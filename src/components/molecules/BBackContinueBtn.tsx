import { View, StyleSheet } from 'react-native';
import React from 'react';
import { BButtonPrimary } from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';

type BackContinueBtnType = {
  onPressBack: () => void;
  onPressContinue: () => void;
  disableContinue?: boolean;
  loadingContinue?: boolean;
};

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

export default function BackContinueBtn({
  onPressBack = () => {},
  onPressContinue = () => {},
  disableContinue,
  loadingContinue,
}: BackContinueBtnType) {
  return (
    <View style={style.buttonContainer}>
      <View style={style.backButtonContainer}>
        <BButtonPrimary onPress={onPressBack} title="Kembali" isOutline />
      </View>
      <View style={style.continueButtonContainer}>
        <BButtonPrimary
          rightIcon={ContinueIcon}
          onPress={onPressContinue}
          title="Lanjut"
          disable={disableContinue}
          isLoading={loadingContinue}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    width: '35%',
  },
  continueButtonContainer: {
    width: '55%',
  },
});
