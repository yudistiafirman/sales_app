import Modal from 'react-native-modal';
import {
  View,
  Text,
  Button,
  StyleSheet,
  DeviceEventEmitter,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIsPopUpVisible } from '@/redux/reducers/modalReducer';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BBackContinueBtn from '@/components/molecules/BBackContinueBtn';
import { BButtonPrimary, BHighlightText, BSpacer, BText } from '@/components';
import font from '@/constants/fonts';

export default function Popup() {
  const dispatch = useDispatch();
  const { isPopUpVisible, popUpOptions } = useSelector(
    (state: RootState) => state.modal
  );

  return (
    <Modal
      style={styles.modalStyle}
      isVisible={isPopUpVisible}
      hideModalContentWhileAnimating={false}
      backdropOpacity={0.3}
      onBackdropPress={() => {
        if (popUpOptions.outsideClickClosePopUp) {
          dispatch(setIsPopUpVisible());
        }
      }}
    >
      <View style={styles.modalContent}>
        <View>
          {popUpOptions.popUpType === 'success' && (
            <AntDesign size={resScale(48)} name="checkcircle" color={'green'} />
          )}
          {popUpOptions.popUpType === 'error' && (
            <AntDesign size={resScale(48)} name="closecircle" color={'red'} />
          )}
          {popUpOptions.popUpType === 'loading' && (
            <ActivityIndicator size={resScale(60)} color={colors.primary} />
          )}
        </View>
        {popUpOptions.popUpTitle && (
          <BText style={styles.popUpTitle}>{popUpOptions.popUpTitle}</BText>
        )}
        {popUpOptions.popUpText && (
          <BHighlightText
            name={popUpOptions.popUpText}
            searchQuery={popUpOptions.highlightedText}
          />
        )}

        {/* <Text style={styles.popUptext}>{popUpOptions.popUpText}</Text> */}
        {popUpOptions.isRenderActions && (
          <View style={styles.actionContainer}>
            <BButtonPrimary
              onPress={popUpOptions.outlineBtnAction}
              isOutline
              buttonStyle={{ paddingHorizontal: layout.pad.xl }}
              title={popUpOptions.outlineBtnTitle}
            />
            <BSpacer size="large" />
            <BButtonPrimary
              title={popUpOptions.primaryBtnTitle}
              buttonStyle={{ paddingHorizontal: layout.pad.xl }}
              onPress={popUpOptions.primaryBtnAction}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    minHeight: resScale(144),
    minWidth: resScale(327),
  },
  popUpTitle: {
    color: colors.text.darker,
    fontFamily: font.family.montserrat['700'],
    fontSize: font.size.lg,
  },
  popUptext: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
