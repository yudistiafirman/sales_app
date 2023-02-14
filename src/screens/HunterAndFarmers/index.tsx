import { bStorage } from '@/actions';
import { BSpacer, BSvg, BText, SVGName } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import useCustomHeaderCenter from '@/hooks/useCustomHeaderCenter';
import { APPOINTMENT, TAB_HOME, TAB_ROOT } from '@/navigation/ScreenNames';
import { toggleHunterScreen } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const HunterAndFarmers = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { hunterScreen } = useSelector((state: RootState) => state.auth);
  useCustomHeaderCenter({
    customHeaderCenter: (
      <Image
        style={{ width: resScale(70), height: resScale(33) }}
        source={require('@/assets/logo/brik_logo.png')}
      />
    ),
  });

  const goToHome = () => {
    bStorage
      .deleteItem('firstLogin')
      .then(() => {
        navigation.navigate(TAB_ROOT);
      })
      .catch((err) => {
        console.log('ini error', err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => navigation.navigate(APPOINTMENT)}
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
  );
};

const styles = StyleSheet.create({
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
