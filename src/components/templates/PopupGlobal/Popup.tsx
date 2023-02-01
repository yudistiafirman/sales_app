import Modal from 'react-native-modal';
import {
  View,
  Text,
  Button,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIsPopUpVisible } from '@/redux/reducers/modalReducer';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BBackContinueBtn from '@/components/molecules/BBackContinueBtn';
import { BHighlightText } from '@/components';

export default function Popup() {
  const dispatch = useDispatch();
  const { isPopUpVisible, popUpOptions } = useSelector(
    (state: RootState) => state.modal
  );

  return (
    <Modal
      style={styles.modalStyle}
      isVisible={isPopUpVisible}
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
        </View>
        <BHighlightText
          name={popUpOptions.popUpText}
          searchQuery={popUpOptions.highlightedText}
        />
        {/* <Text style={styles.popUptext}>{popUpOptions.popUpText}</Text> */}
        {popUpOptions.isRenderActions && (
          <View style={styles.actionContainer}>
            <BBackContinueBtn
              onPressContinue={() => {
                DeviceEventEmitter.emit('continue/Popup');
              }}
              onPressBack={() => {
                DeviceEventEmitter.emit('back/Popup');
              }}
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
    height: resScale(160),
    width: resScale(300),
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
  },
  popUptext: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    textAlign: 'center',
  },
  actionContainer: {},
});
