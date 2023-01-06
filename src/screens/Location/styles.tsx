import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import { Dimensions, StyleSheet } from 'react-native';

const LocationStyles = StyleSheet.create({
  bottomSheetContainer: {
    minHeight: scaleSize.moderateScale(143),
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    borderTopStartRadius: scaleSize.moderateScale(16),
    borderTopEndRadius: scaleSize.moderateScale(16),
  },
  coordinateDetailsOuterContainer: {
    flex: 1,
    marginHorizontal: scaleSize.moderateScale(16),
    height: scaleSize.moderateScale(67),
    marginTop: scaleSize.moderateScale(10),
    marginBottom: scaleSize.moderateScale(16),
    backgroundColor: colors.tertiary,
  },
  coordinateDetailsInnerContainer: {
    marginHorizontal: scaleSize.moderateScale(11),
    marginVertical: scaleSize.moderateScale(8),
    flexDirection: 'row',
  },
  mapIconContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  addressTitle: {
    fontFamily: font.family.montserrat['500'],
    fontSize: scaleSize.moderateScale(14),
    color: colors.text.darker,
    marginBottom: scaleSize.moderateScale(4),
  },
  addressDetails: {
    fontFamily: font.family.montserrat['300'],
    fontSize: scaleSize.moderateScale(12),
    color: colors.text.darker,
    marginBottom: scaleSize.moderateScale(4),
    textAlign: 'left',
  },
});

export default LocationStyles;
