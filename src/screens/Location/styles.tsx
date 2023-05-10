import { Dimensions, StyleSheet } from 'react-native';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';

const LocationStyles = StyleSheet.create({
  bottomSheetContainer: {
    minHeight: resScale(150),
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    borderTopStartRadius: layout.pad.lg,
    borderTopEndRadius: layout.pad.lg,
  },
  coordinateDetailsOuterContainer: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
    height: resScale(67),
    marginTop: layout.pad.xs + layout.pad.md,
    marginBottom: layout.pad.md,
    backgroundColor: colors.tertiary,
  },
  coordinateDetailsInnerContainer: {
    marginHorizontal: layout.pad.md,
    marginVertical: layout.pad.md,
    flexDirection: 'row',
  },
  mapIconContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  addressTitle: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.text.darker,
    marginBottom: layout.pad.sm,
  },
  addressDetails: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.sm,
    color: colors.text.darker,
    marginBottom: layout.pad.sm,
    textAlign: 'left',
  },
  buttonStyles: {
    borderRadius: layout.radius.md,
    marginHorizontal: layout.pad.lg,
  },
});

export default LocationStyles;
