import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { BBackContinueBtn, BHighlightText, BText } from '@/components';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import { setIsPopUpVisible } from '@/redux/reducers/modalReducer';
import { RootState } from '@/redux/store';
import { resScale } from '@/utils';

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
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.md,
    textAlign: 'center',
    lineHeight: resScale(24),
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

export default function Popup() {
  const dispatch = useDispatch();
  const { isPopUpVisible, popUpOptions } = useSelector((state: RootState) => state.modal);

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
      }}>
      <View style={styles.modalContent}>
        {popUpOptions.popUpType !== 'none' && (
          <View style={{ paddingTop: layout.pad.xl, paddingBottom: layout.pad.ml }}>
            {popUpOptions.popUpType === 'success' && (
              <AntDesign size={resScale(48)} name="checkcircle" color="green" />
            )}
            {popUpOptions.popUpType === 'error' && (
              <AntDesign size={resScale(48)} name="closecircle" color="red" />
            )}
            {popUpOptions.popUpType === 'loading' && (
              <ActivityIndicator size={resScale(60)} color={colors.primary} />
            )}
          </View>
        )}

        {popUpOptions.popUpTitle && (
          <View style={{ paddingBottom: layout.pad.lg }}>
            <BHighlightText
              searchQuery={popUpOptions.highlightedText}
              name={popUpOptions.popUpTitle}
            />
          </View>
        )}
        {popUpOptions.popUpText && (
          <View style={{ paddingBottom: layout.pad.lg }}>
            <BText style={styles.popUpTitle}>{popUpOptions.popUpText}</BText>
          </View>
        )}
        {/* <Text style={styles.popUptext}>{popUpOptions.popUpText}</Text> */}
        {popUpOptions.isRenderActions && (
          <BBackContinueBtn
            isContinueIcon={false}
            continueText={popUpOptions.primaryBtnTitle}
            backText={popUpOptions.outlineBtnTitle}
            unrenderBack={popUpOptions.unRenderBackButton}
            loadingContinue={popUpOptions.isPrimaryButtonLoading}
            onPressBack={popUpOptions.outlineBtnAction}
            onPressContinue={popUpOptions.primaryBtnAction}
            disableBack={popUpOptions.isPrimaryButtonLoading}
          />
        )}
      </View>
    </Modal>
  );
}
