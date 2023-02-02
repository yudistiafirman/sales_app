import { View, StyleSheet } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import BButtonPrimary from '../atoms/BButtonPrimary';

type BackContinueBtnType = {
  onPressBack?: () => void;
  onPressContinue?: () => void;
  disableContinue?: boolean;
  loadingContinue?: boolean;
  backText?: string;
  continueText?: string;
  isContinueIcon?: boolean;
};

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

export default function BBackContinueBtn({
  onPressBack = () => {},
  onPressContinue = () => {},
  disableContinue,
  loadingContinue,
  backText = 'Kembali',
  continueText = 'Lanjut',
  isContinueIcon = true,
}: BackContinueBtnType) {
  return (
    <View style={style.buttonContainer}>
      <View style={style.backButtonContainer}>
        <BButtonPrimary onPress={onPressBack} title={backText} isOutline />
      </View>
      <View style={style.continueButtonContainer}>
        <BButtonPrimary
          rightIcon={isContinueIcon ? ContinueIcon : null}
          onPress={onPressContinue}
          title={continueText}
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
    width: '40%',
  },
  continueButtonContainer: {
    width: '55%',
  },
});
