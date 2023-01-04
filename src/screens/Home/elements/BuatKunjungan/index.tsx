import { StyleSheet } from 'react-native';
import React from 'react';
import { BottomSheetFooter } from '@gorhom/bottom-sheet';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import respFS from '@/utils/respFS';
import BButtonPrimary from '@/components/atoms/BButtonPrimary';

export default function BuatKunjungan(props: any, kunjunganAction: () => void) {
  return (
    <BottomSheetFooter {...props} style={style.container} bottomInset={2}>
      <BButtonPrimary
        onPress={kunjunganAction}
        title="Buat Kunjungan"
        isOutline={true}
      />
    </BottomSheetFooter>
  );
}
const style = StyleSheet.create({
  container: {},
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  footerText: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: font.family.montserrat[600],
    fontSize: respFS(16),
    fontWeight: '600',
  },
});
