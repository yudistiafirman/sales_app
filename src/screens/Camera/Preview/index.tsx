import React, { useMemo } from 'react';
import { BButtonPrimary, BHeaderIcon } from '@/components';
import { layout } from '@/constants';
import {
  StyleProp,
  ViewStyle,
  View,
  Image,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { useDispatch } from 'react-redux';
import { setImageURLS } from '@/redux/reducers/cameraReducer';
import {
  CAMERA,
  CREATE_DEPOSIT,
  CREATE_SCHEDULE,
  CREATE_VISITATION,
  IMAGE_PREVIEW,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { ENTRY_TYPE } from '@/models/EnumModel';

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

const Preview = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  useHeaderTitleChanged({
    title: 'Foto ' + route?.params?.photoTitle,
  });
  const _style = useMemo(() => style, [style]);
  const photo = route?.params?.photo?.path;
  const navigateTo = route?.params?.navigateTo;
  const operationAddedStep = route?.params?.operationAddedStep;
  const closeButton = route?.params?.closeButton;
  const existingVisitation = route?.params?.existingVisitation;

  if (closeButton) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCustomHeaderLeft({
      customHeaderLeft: (
        <BHeaderIcon
          size={resScale(23)}
          onBack={() => navigation.goBack()}
          iconName="x"
        />
      ),
    });
  }

  React.useEffect(() => {
    crashlytics().log(IMAGE_PREVIEW);
  }, []);

  const savePhoto = () => {
    const imagePayloadType: 'COVER' | 'GALLERY' =
      navigateTo && navigateTo !== CREATE_DEPOSIT ? 'COVER' : 'GALLERY';
    const photoName = photo.split('/').pop();
    const photoNameParts = photoName.split('.');
    let photoType = photoNameParts[photoNameParts.length - 1];

    if (photoType === 'jpg') {
      photoType = 'jpeg';
    }

    const imageUrls = {
      photo: {
        uri: `file:${photo}`,
        type: `image/${photoType}`,
        name: photoName,
      },
      type: imagePayloadType,
    };
    dispatch(setImageURLS(imageUrls));
    DeviceEventEmitter.emit('Camera.preview', photo);
    if (navigateTo) {
      console.log('screen::: ', navigateTo);
      switch (navigateTo) {
        case CREATE_VISITATION:
          navigation.goBack();
          navigation.dispatch(
            StackActions.replace(navigateTo, { existingVisitation })
          );
          return;
        case CREATE_SCHEDULE:
          DeviceEventEmitter.emit('Camera.addedDeposit', 'true');
          navigation.dispatch(StackActions.pop(2));
          return;
        case ENTRY_TYPE[ENTRY_TYPE.BATCHER]:
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Mix Design',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.BATCHER,
            });
          }
          return;
        case ENTRY_TYPE[ENTRY_TYPE.DISPATCH]:
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Driver',
              navigateTo: navigateTo,
              operationAddedStep: 'vehicle_no',
            });
          } else if (operationAddedStep === 'vehicle_no') {
            navigation.navigate(CAMERA, {
              photoTitle: 'No Polisi TM',
              navigateTo: navigateTo,
              operationAddedStep: 'seal',
            });
          } else if (operationAddedStep === 'seal') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Segel',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.DISPATCH,
            });
          }
          return;
        case ENTRY_TYPE[ENTRY_TYPE.DRIVER]:
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Penuangan',
              navigateTo: navigateTo,
              operationAddedStep: 'tm_value',
            });
          } else if (operationAddedStep === 'tm_value') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Isi TM',
              navigateTo: navigateTo,
              operationAddedStep: 'do_signed',
            });
          } else if (operationAddedStep === 'do_signed') {
            navigation.navigate(CAMERA, {
              photoTitle: 'DO Saat Ditandatangan',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.DRIVER,
            });
          }
          return;
        case ENTRY_TYPE[ENTRY_TYPE.RETURN]:
          navigation.navigate(SUBMIT_FORM, {
            operationType: ENTRY_TYPE.RETURN,
          });
          return;
        default:
          navigation.goBack();
          navigation.dispatch(StackActions.replace(navigateTo));
          return;
      }
    } else {
      navigation.dispatch(StackActions.pop(2));
    }
  };

  return (
    <View style={[_style, styles.parent]}>
      <View style={styles.container}>
        {photo && (
          <Image source={{ uri: `file:${photo}` }} style={styles.image} />
        )}
      </View>
      <View style={styles.conButton}>
        <View style={styles.buttonOne}>
          <BButtonPrimary
            title="Ulangi"
            isOutline
            emptyIconEnable
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.buttonTwo}>
          <BButtonPrimary
            title="Lanjut"
            onPress={savePhoto}
            rightIcon={ContinueIcon}
          />
        </View>
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
    backgroundColor: 'black',
    width: '100%',
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  conButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: layout.pad.lg,
  },
  buttonOne: {
    flex: 1,
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    flex: 1.5,
    paddingStart: layout.pad.md,
  },
});

export default Preview;
