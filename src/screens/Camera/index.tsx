import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CameraPage from './elements/CameraPage';

const Camera = () => {
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
