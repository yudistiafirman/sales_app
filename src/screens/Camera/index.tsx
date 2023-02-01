import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Config from './elements/Config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { RootStackScreenProps } from '@/navigation/navTypes';
import { hasCameraPermissions } from '@/utils/permissions';

const Camera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();

  const navigateTo = route?.params?.navigateTo;
  const photoTitle = route?.params?.photoTitle;

  useEffect(() => {
    navigation.addListener('focus', () => {
      hasCameraPermissions();
    });
    const backAction = () => {
      dispatch(resetImageURLS(undefined));
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.parent}>
      <SafeAreaView style={styles.container}>
        <Config navigateTo={navigateTo} title={photoTitle} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
});

export default Camera;
