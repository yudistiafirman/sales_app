import { View, StyleSheet } from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import BButtonPrimary from '../atoms/BButtonPrimary';
import { layout } from '@/constants';

type BackContinueBtnType = {
  onPressBack?: () => void;
  onPressContinue?: () => void;
  disableContinue?: boolean;
  loadingContinue?: boolean;
  backText?: string;
  continueText?: string;
  isContinueIcon?: boolean;
  disableBack?: boolean;
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
  disableBack = false,
}: BackContinueBtnType) {
  console.log('safasf', onPressBack);
  return (
    <View style={style.buttonContainer}>
      {!disableBack && (
        <View style={style.backButtonContainer}>
          <BButtonPrimary
            emptyIconEnable
            onPress={onPressBack}
            title={backText}
            isOutline
          />
        </View>
      )}
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
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    flex: 1,
    paddingEnd: layout.pad.md,
  },
  continueButtonContainer: {
    flex: 1.5,
    paddingStart: layout.pad.md,
  },
});
