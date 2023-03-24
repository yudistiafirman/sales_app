import * as React from 'react';
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useIsFocused,
  StackActions,
} from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { hasCameraPermissions } from '@/utils/permissions';
import { CAMERA, PO } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { BHeaderIcon } from '@/components';
import { resScale } from '@/utils';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { IMAGE_PREVIEW } from '@/navigation/ScreenNames';
import CameraButton from './elements/CameraButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';

const CameraScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RootStackScreenProps>();
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const { isFirstTimeOpenCamera } = poState.currentState.context;
  const navigateTo = route?.params?.navigateTo;
  const closeButton = route?.params?.closeButton;
  const photoTitle = route?.params?.photoTitle;
  const existingVisitation = route?.params?.existingVisitation;
  const operationAddedStep = route?.params?.operationAddedStep;
  const disabledDocPicker =
    route?.params?.disabledDocPicker !== undefined
      ? route?.params?.disabledDocPicker
      : true;
  const disabledGalleryPicker =
    route?.params?.disabledGalleryPicker !== undefined
      ? route?.params?.disabledGalleryPicker
      : true;
  useHeaderTitleChanged({ title: 'Foto ' + photoTitle });

  const handleBack = React.useCallback(() => {
    if (navigateTo === PO) {
      if (isFirstTimeOpenCamera) {
        if (navigation.canGoBack()) {
          dispatch({ type: 'backToSavedPoFromCamera' });
          navigation.dispatch(StackActions.popToTop());
        }
      } else {
        dispatch({ type: 'backFromCamera' });
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  }, [dispatch, navigateTo, navigation, isFirstTimeOpenCamera]);
  if (closeButton) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomHeaderLeft({
      customHeaderLeft: (
        <BHeaderIcon size={resScale(23)} onBack={handleBack} iconName="x" />
      ),
    });
  }

  const device = useCameraDevices().back;
  const camera = React.useRef<Camera>(null);
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;
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

        navigation.navigate(IMAGE_PREVIEW, {
          photo: takenPhoto,
          picker: undefined,
          photoTitle,
          navigateTo,
          closeButton,
          existingVisitation,
          operationAddedStep,
        });
      } catch (error) {
        Alert.alert('Camera Error');
      }
    }
  };

  const onFileSelect = (data: any) => {
    navigation.navigate(IMAGE_PREVIEW, {
      photo: undefined,
      picker: data,
      photoTitle,
      navigateTo,
      closeButton,
      existingVisitation,
      operationAddedStep,
    });
  };

  const isFocused = useIsFocused();
  React.useEffect(() => {
    crashlytics().log(CAMERA);
    navigation.addListener('focus', () => {
      hasCameraPermissions();
    });
  }, [navigation]);

  return (
    <View style={styles.parent}>
      <SafeAreaView style={styles.container}>
        <View style={styles.containerCamera}>
          {device && (
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
          )}
          <CameraButton
            takePhoto={takePhoto}
            onGalleryPress={(data) => onFileSelect(data)}
            onDocPress={(data) => onFileSelect(data)}
            disabledDocPicker={disabledDocPicker}
            disabledGalleryPicker={disabledGalleryPicker}
          />
        </View>
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
  camera: {
    flex: 1,
  },
  containerCamera: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
  },
});

export default CameraScreen;
