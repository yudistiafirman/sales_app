import React, { useMemo, useRef } from 'react';
import { StyleProp, ViewStyle, View, Animated, StyleSheet } from 'react-native';
import {
  Camera,
  CameraDevices,
  useCameraDevices,
  CameraDevice,
} from 'react-native-vision-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { layout } from '@/constants';
import { USER_TYPE } from '@/models/EnumModel';

const Config = ({
  title,
  style,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const getCameraDevice = (devices: CameraDevices): CameraDevice => {
    return devices.back;
  };
  useHeaderTitleChanged({ title: 'Foto ' + title, role: USER_TYPE.OPSMANAGER });
  const device = getCameraDevice(useCameraDevices());
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const _style = useMemo(() => style, [style]);
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const animateElement = () => {
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  (async () => {
    let cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'authorized')
      await Camera.requestCameraPermission();
  })();

  const takePhoto = async () => {
    const takenPhoto = await camera.current.takePhoto({
      flash: 'off',
    });
    animateElement();
    navigation.navigate('Preview', { photo: takenPhoto, photoTitle: title });
  };
  const isFocused = useIsFocused();

  return (
    <View style={[_style, styles.parent]}>
      <View style={styles.container}>
        {device && (
          <>
            <Camera
              ref={camera}
              style={{ flex: 1 }}
              device={device}
              isActive={isFocused}
              photo
              enableHighQualityPhotos
              enableZoomGesture
              hdr
              lowLightBoost
            />
            <View style={styles.cameraBtn}>
              <TouchableOpacity onPress={takePhoto}>
                <View style={styles.outerShutter}>
                  <View style={styles.innerShutter} />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
  },
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

export default Config;
