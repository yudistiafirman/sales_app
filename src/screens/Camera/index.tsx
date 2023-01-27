import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CameraPage from './elements/CameraPage';
import { useNavigation } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';

const Camera = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
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
  });

  return (
    <View style={styles.parent}>
      <SafeAreaView style={styles.container}>
        <CameraPage title="DO" />
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
