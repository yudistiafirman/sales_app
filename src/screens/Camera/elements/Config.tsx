import React, { useMemo, useRef } from 'react';
import {
  StyleProp,
  ViewStyle,
  View,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Camera,
  CameraDevices,
  useCameraDevices,
  CameraDevice,
} from 'react-native-vision-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { layout } from '@/constants';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { IMAGE_PREVIEW } from '@/navigation/ScreenNames';

type configType = {
  title: string;
  style?: StyleProp<ViewStyle>;
  navigateTo?: string;
  closeButton?: boolean;
};

const Config = ({
  title,
  style,
  navigateTo,
  closeButton = false,
}: configType) => {
  const getCameraDevice = (
    devices: CameraDevices
  ): CameraDevice | undefined => {
    return devices?.back;
  };
  const route = useRoute<RootStackScreenProps>();

  useHeaderTitleChanged({ title: 'Foto ' + title });
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

  const takePhoto = async () => {
    if (camera === undefined || camera.current === undefined) {
      Alert.alert('No Camera Found');
    } else {
      try {
        const takenPhoto = await camera?.current?.takePhoto({
          flash: 'off',
        });
        animateElement();
        const existingVisitation = route?.params?.existingVisitation;

        navigation.navigate(IMAGE_PREVIEW, {
          photo: takenPhoto,
          photoTitle: title,
          navigateTo,
          closeButton,
          existingVisitation,
        });
      } catch (error) {
        Alert.alert('Camera Error');
      }
    }
  };
  const isFocused = useIsFocused();

  return (
    <View style={[_style, styles.parent]}>
      <View style={styles.container}>
        {device && (
          <>
            <Camera
              ref={camera}
              style={styles.camera}
              device={device}
              isActive={isFocused}
              photo
              enableHighQualityPhotos
              enableZoomGesture
              hdr
              lowLightBoost
            />
            <View style={styles.cameraBtn}>
              <TouchableOpacity onPress={() => takePhoto()}>
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
  camera: {
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
