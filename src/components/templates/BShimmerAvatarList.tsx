import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import BSpacer from '../atoms/BSpacer';
import font from '@/constants/fonts';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const BShimmerAvatarList = () => {
  return (
    <View style={styles.container}>
      <ShimmerPlaceholder style={styles.avatar} />
      <BSpacer size="extraSmall" />
      <View style={{ flex: 1 }}>
        <View style={styles.infoContainer}>
          <ShimmerPlaceholder />
          <ShimmerPlaceholder style={{ width: layout.pad.xxl }} />
        </View>
        <BSpacer size="extraSmall" />
        <View style={styles.credContainer}>
          <ShimmerPlaceholder style={{ flex: 0.45 }} />
          <ShimmerPlaceholder style={{ flex: 0.45 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: layout.pad.lg,
  },
  avatar: {
    borderRadius: layout.pad.xl + layout.pad.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: layout.pad.xl + layout.pad.md,
    height: layout.pad.xl + layout.pad.md,
    backgroundColor: colors.avatar,
  },
  textAvatar: {
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.lg,
    color: colors.text.pinkRed,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  credContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  credText: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.darker,
  },
});

export default BShimmerAvatarList;
