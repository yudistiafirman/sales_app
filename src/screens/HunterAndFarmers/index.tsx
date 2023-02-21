import { BSpacer, BText } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import {
  APPOINTMENT,
  HUNTER_AND_FARMER,
  TAB_ROOT,
} from '@/navigation/ScreenNames';
import { AppDispatch, RootState } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import crashlytics from '@react-native-firebase/crashlytics';
import { toggleHunterScreen } from '@/redux/reducers/authReducer';
import { bStorage } from '@/actions';
import moment from 'moment';

const { height } = Dimensions.get('screen');
const HunterAndFarmers = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { hunterScreen, userData } = useSelector(
    (state: RootState) => state.auth
  );

  const goToHome = () => {
    dispatch(toggleHunterScreen(false));
    navigation.navigate(TAB_ROOT);
    bStorage.setItem('accessDate', moment().date());
  };

  const goToAppointment = () => {
    dispatch(toggleHunterScreen(false));
    navigation.navigate(APPOINTMENT);
    bStorage.setItem('accessDate', moment().date());
  };

  React.useEffect(() => {
    crashlytics().log(HUNTER_AND_FARMER);
  }, []);

  return (
    <Modal
      isVisible={hunterScreen && userData !== null}
      style={styles.modalContainer}
      deviceHeight={height}
    >
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.imageLogo}
          source={require('@/assets/logo/brik_logo.png')}
        />
        <View>
          <BText style={styles.title}>Bagaimana Anda ingin memulai</BText>
        </View>
        <BSpacer size="extraSmall" />
        <View>
          <BText style={styles.title}>hari ini?</BText>
        </View>
        <BSpacer size="small" />
        <View style={styles.svgGroup}>
          <TouchableOpacity onPress={goToHome} style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={require('@/assets/icon/ic_farmer.png')}
            />
            <BText style={styles.text}>Hunter</BText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToAppointment}
            style={styles.imageWrapper}
          >
            <Image
              style={styles.image}
              source={require('@/assets/icon/ic_hunter.png')}
            />
            <BText style={styles.text}>Farmer</BText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { margin: 0, backgroundColor: colors.white },
  imageLogo: {
    width: resScale(70),
    height: resScale(33),
    position: 'absolute',
    top: layout.pad.lg,
  },
  title: {
    fontFamily: font.family.montserrat['700'],
    fontSize: font.size.md,
    color: '#000000',
  },
  container: {
    marginHorizontal: layout.pad.xl,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: font.family.montserrat['400'],
    fontSize: font.size.md,
    color: '#000000',
  },
  svgGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  image: { width: resScale(120), height: resScale(120) },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HunterAndFarmers;
