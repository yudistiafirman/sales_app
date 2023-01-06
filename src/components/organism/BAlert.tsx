import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import React from 'react';
import { Image, StyleSheet, TextStyle, View } from 'react-native';
import Modal from 'react-native-modal';
import BButtonPrimary from '../atoms/BButtonPrimary';
import BText from '../atoms/BText';

interface BAlertProps {
  isVisible: boolean;
  content: string;
  type: 'warning' | 'success';
  contentStyle?: TextStyle;
  onClose?: () => void;
}

const BAlertDefaultContentStyle: TextStyle = {
  fontFamily: font.family.montserrat['600'],
  fontSize: scaleSize.moderateScale(16),
  textAlign: 'center',
  marginBottom: scaleSize.moderateScale(34),
};

const BalertDefaultProps = {
  type: 'warning',
  content:
    'Pengiriman tidak dapat dilakukan karena jarak Batching Plant dengan lokasi Anda lebih dari 40km.',
  contentStyle: BAlertDefaultContentStyle,
};

const BAlert = ({
  isVisible,
  content,
  type,
  contentStyle,
  onClose,
}: BAlertProps & typeof BalertDefaultProps) => {
  const warningIcon = require('@/assets/icon/ic_warning.png');
  const successIcon = require('@/assets/icon/ic_success.png');

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.alertOuterContainer}>
          <View style={styles.alertContainer}>
            <Image
              source={type === 'warning' ? warningIcon : successIcon}
              style={styles.image}
            />
            <BText style={contentStyle}>{content}</BText>
            {type === 'warning' && (
              <BButtonPrimary
                onPress={onClose}
                isOutline
                title="Saya Mengerti"
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

BAlert.defaultProps = BalertDefaultProps;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    flex: 1,
  },
  alertOuterContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  alertContainer: {
    paddingVertical: scaleSize.moderateScale(20),
    paddingHorizontal: scaleSize.moderateScale(16),
    alignItems: 'center',
    minHeight: scaleSize.moderateScale(160),
    borderRadius: scaleSize.moderateScale(8),
    backgroundColor: colors.white,
  },
  image: {
    width: scaleSize.moderateScale(66),
    height: scaleSize.moderateScale(66),
    marginBottom: scaleSize.moderateScale(31),
  },
  content: {},
});

export default BAlert;
