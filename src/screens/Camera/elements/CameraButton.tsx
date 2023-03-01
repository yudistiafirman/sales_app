import * as React from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { layout } from '@/constants';

type configType = {
  style?: StyleProp<ViewStyle>;
  takePhoto: () => void;
};

const CameraButton = ({ style, takePhoto }: configType) => {
  return (
    <>
      <View style={[styles.cameraBtn, style]}>
        <TouchableOpacity onPress={() => takePhoto()}>
          <View style={styles.outerShutter}>
            <View style={styles.innerShutter} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cameraBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerShutter: {
    flex: 1,
    borderRadius: 40,
    height: 68,
    width: 68,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.pad.lg,
  },
  innerShutter: {
    borderRadius: 40,
    height: 58,
    width: 58,
  },
});

export default CameraButton;
