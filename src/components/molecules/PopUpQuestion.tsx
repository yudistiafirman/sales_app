import { View, Text, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import Modal from 'react-native-modal';
import { colors, fonts, layout } from '@/constants';
import BBackContinueBtn from './BBackContinueBtn';
import { resScale } from '@/utils';

type PopUpQuestionType = {
  isVisible: boolean;
  setIsPopupVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  actionButton: () => void;
  text?: string;
  desc?: string;
  descContent?: ReactNode;
  actionText?: string;
  cancelText?: string;
};

export default function PopUpQuestion({
  isVisible,
  setIsPopupVisible,
  actionButton,
  text,
  desc,
  descContent,
  actionText,
  cancelText,
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
            {text ? text : 'Apakah Anda Ingin Tambah Foto Lagi?'}
          </Text>
        </View>
        {descContent && <View>{descContent}</View>}
        {desc && (
          <View>
            <Text style={styles.questionDescText}>{desc}</Text>
          </View>
        )}
        <View
          style={{
            paddingHorizontal: layout.pad.md,
            paddingVertical: layout.pad.sm,
          }}
        >
          <BBackContinueBtn
            onPressBack={() => {
              setIsPopupVisible && setIsPopupVisible((curr) => !curr);
            }}
            onPressContinue={actionButton}
            isContinueIcon={false}
            continueText={actionText ? actionText : 'Ya, Tambah'}
            backText={cancelText ? cancelText : 'Tidak'}
          />
        </View>
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
  questionDescText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.md,
    textAlign: 'center',
    paddingTop: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
    paddingBottom: layout.pad.xl,
  },
});
