import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { BBackContinueBtn } from '@/components';
import { colors, fonts, layout } from '@/constants';

type PopUpQuestionType = {
  isVisible: boolean;
  setIsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initiateCameraModule: () => void;
};

export default function PopUpQuestion({
  isVisible,
  setIsPopupVisible,
  initiateCameraModule,
}: PopUpQuestionType) {
  return (
    <Modal
      isVisible={isVisible}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      backdropColor="#000000"
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Apakah Anda Ingin Tambah Foto Lagi?
          </Text>
        </View>
        <BBackContinueBtn
          onPressBack={() => {
            setIsPopupVisible((curr) => !curr);
          }}
          onPressContinue={() => {
            initiateCameraModule();
          }}
          isContinueIcon={false}
          continueText="Ya, Tambah"
          backText="Tidak"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {},
  modalContent: {
    padding: layout.pad.md,
    backgroundColor: 'white',
    borderRadius: layout.radius.md,
  },
  questionContainer: {
    alignItems: 'center',
  },
  questionText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.lg,
    textAlign: 'center',
    padding: layout.pad.lg,
  },
});
