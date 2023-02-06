import { BText, BHeaderIcon, BButtonPrimary } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import BCommonCompanyCard from '../molecules/BCommonCompanyCard';
const { height } = Dimensions.get('window');

const ChoosePOModal = ({
  onChoose,
  isVisible,
  dataCompany,
  onCloseModal,
  onSelect,
}) => {
  return (
    <Modal deviceHeight={height} isVisible={true} style={styles.modalContainer}>
      <View style={[styles.contentOuterContainer, { height: height / 1.6 }]}>
        <View style={styles.contentInnerContainer}>
          <View style={styles.headerContainer}>
            <BText style={styles.headerTitle}>Pilih PO</BText>
            <BHeaderIcon
              onBack={onCloseModal}
              size={layout.pad.lg}
              marginRight={0}
              iconName="x"
            />
          </View>

          <BCommonCompanyCard name="PT Guna Darma" location="Waduk Darma" />

          <View style={styles.projectNameListContainer} />
          <BButtonPrimary
            buttonStyle={styles.chooseBtn}
            onPress={onChoose}
            title="Pilih"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: 'flex-end' },
  contentOuterContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: layout.radius.lg,
    borderTopEndRadius: layout.radius.lg,
  },
  contentInnerContainer: { flex: 1, marginHorizontal: layout.pad.lg },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0.15,
  },
  headerTitle: {
    fontFamily: font.family.montserrat['700'],
    fontSize: font.size.lg,
  },
  addProjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyDetailsCardWrapper: { flex: 0.25 },
  projectNameListContainer: { flex: 0.3, paddingTop: layout.pad.lg },
  notFoundProjectText: {
    fontFamily: font.family.montserrat['400'],
    fontSize: font.size.md,
    color: colors.text.dark,
  },
  addProjectButton: { borderRadius: layout.radius.sm },
  addProjectBtnText: { fontFamily: font.family.montserrat['400'] },
  chooseBtn: {
    position: 'absolute',
    width: '100%',
    top: layout.pad.xl + layout.pad.lg,
  },
});

export default ChoosePOModal;
