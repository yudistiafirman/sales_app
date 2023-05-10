import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Icons from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { colors, layout } from '@/constants';
import BLabel from '../atoms/BLabel';
import BText from '../atoms/BText';

import { resScale } from '@/utils';
import BSpacer from '../atoms/BSpacer';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

type BLocationDetailType = {
  isLoading?: boolean;
  nameAddress?: string;
  formattedAddress?: string;
  onPress?: () => void;
};

export default function BLocationDetail({
  isLoading,
  nameAddress,
  formattedAddress,
  onPress = () => {},
}: BLocationDetailType) {
  return (
    <TouchableOpacity style={styles.touchContainer} onPress={onPress}>
      <View style={styles.row}>
        <Icons name="map-pin" size={resScale(20)} color={colors.primary} />
        {/* <BSpacer size="extraSmall" /> */}
        <View>
          {isLoading ? (
            <View style={styles.textContainer}>
              <ShimmerPlaceholder style={styles.titleShimmer} />
              <ShimmerPlaceholder style={styles.secondaryTextShimmer} />
            </View>
          ) : (
            <View style={styles.textContainer}>
              <BLabel label={nameAddress || 'Nama Alamat'} />
              <BText>{formattedAddress || 'Detail Alamat'}</BText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  touchContainer: {
    paddingVertical: layout.pad.md,
    paddingHorizontal: layout.pad.md,
    backgroundColor: colors.border.disabled,
    borderRadius: layout.radius.sm,
  },
  titleShimmer: {
    width: resScale(108),
    height: resScale(17),
    marginBottom: layout.pad.sm,
  },
  secondaryTextShimmer: { width: resScale(296), height: resScale(15) },
  textContainer: {
    // backgroundColor: 'red',
    paddingHorizontal: layout.pad.md,
  },
});
