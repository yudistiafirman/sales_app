import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import { Dimensions, StyleSheet } from 'react-native';

const LocationStyles = StyleSheet.create({
  bottomSheetContainer: {
    minHeight: resScale(143),
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    borderTopStartRadius: resScale(16),
    borderTopEndRadius: resScale(16),
  },
  coordinateDetailsOuterContainer: {
    flex: 1,
    marginHorizontal: resScale(16),
    height: resScale(67),
    marginTop: resScale(10),
    marginBottom: resScale(16),
    backgroundColor: colors.tertiary,
  },
  coordinateDetailsInnerContainer: {
    marginHorizontal: resScale(11),
    marginVertical: resScale(8),
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
    fontSize: resScale(14),
    color: colors.text.darker,
    marginBottom: resScale(4),
  },
  addressDetails: {
    fontFamily: font.family.montserrat['300'],
    fontSize: resScale(12),
    color: colors.text.darker,
    marginBottom: resScale(4),
    textAlign: 'left',
  },
});

export default LocationStyles;
