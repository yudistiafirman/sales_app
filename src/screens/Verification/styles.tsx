import { colors } from '@/constants';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import { StyleSheet } from 'react-native';
const VerificationStyles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: resScale(16) },
  otpMessageImage: {
    width: resScale(180),
    height: resScale(125.5),
    alignSelf: 'center',
    marginBottom: resScale(28),
    marginTop: resScale(40),
  },
  intructionsTextDark: {
    fontFamily: font.family.montserrat['300'],
    color: colors.text.dark,
    fontSize: font.size.md,
    marginBottom: resScale(25),
    textAlign: 'center',
  },
  intructionsTextRed: {
    fontFamily: font.family.montserrat['500'],
    fontSize: font.size.md,
    color: colors.primary,
    textAlign: 'left',
  },
  intrutructionsTextDarkBold: {
    fontFamily: font.family.montserrat['500'],
    fontSize: font.size.md,
    color: colors.text.dark,
  },
  otpLabel: {
    fontFamily: font.family.montserrat['500'],
    color: colors.text.dark,
    fontSize: font.size.sm,
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: resScale(25),
    justifyContent: 'center',
    marginBottom: resScale(23),
  },
});
export default VerificationStyles;
