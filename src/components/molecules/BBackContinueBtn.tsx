import React from 'react';
import { View, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { layout } from '@/constants';
import { resScale } from '@/utils';
import BButtonPrimary from '../atoms/BButtonPrimary';

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

type BackContinueBtnType = {
  onPressBack?: () => void;
  onPressContinue?: () => void;
  disableContinue?: boolean;
  loadingContinue?: boolean;
  backText?: string;
  continueText?: string;
  isContinueIcon?: boolean;
  disableBack?: boolean;
  emptyIconEnable?: boolean;
  unrenderBack?: boolean;
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
  unrenderBack = false,
  emptyIconEnable = false,
}: BackContinueBtnType) {
  return (
    <View style={style.buttonContainer}>
      {!unrenderBack && (
        <View style={style.backButtonContainer}>
          <BButtonPrimary
            emptyIconEnable={isContinueIcon ? true : emptyIconEnable}
            onPress={onPressBack}
            title={backText}
            isOutline
            disable={disableBack}
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
