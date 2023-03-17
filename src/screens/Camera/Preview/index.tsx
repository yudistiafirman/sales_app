import * as React from 'react';
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
  CREATE_VISITATION,
  GALLERY_DEPOSIT,
  GALLERY_VISITATION,
  IMAGE_PREVIEW,
  PO,
  OPERATION,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { ENTRY_TYPE } from '@/models/EnumModel';
import Pdf from 'react-native-pdf';
import { LocalFileType } from '@/interfaces/LocalFileType';
import { customLog } from '@/utils/generalFunc';

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
  const _style = React.useMemo(() => style, [style]);
  const photo = route?.params?.photo?.path;
  const picker = route?.params?.picker;
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

  const getTypeOfImagePayload = () => {
    if (navigateTo) {
      if (
        navigateTo !== CREATE_DEPOSIT &&
        navigateTo !== GALLERY_VISITATION &&
        navigateTo !== GALLERY_DEPOSIT &&
        navigateTo !== PO
      ) {
        return 'COVER';
      } else {
        return 'GALLERY';
      }
    } else {
      return 'GALLERY';
    }
  };

  const savePhoto = () => {
    const imagePayloadType: 'COVER' | 'GALLERY' = getTypeOfImagePayload();
    const photoName = photo?.split('/').pop();
    const pdfName = picker?.name;
    const photoNameParts = photoName?.split('.');
    let photoType =
      photoNameParts && photoNameParts.length > 0
        ? photoNameParts[photoNameParts.length - 1]
        : '';

    if (photoType === 'jpg') {
      photoType = 'jpeg';
    }

    let localFile: LocalFileType | undefined;
    if (photo) {
      localFile = {
        file: {
          uri: `file:${photo}`,
          type: `image/${photoType}`,
          name: photoName,
        },
        isFromPicker: false,
        type: imagePayloadType,
      };
    } else if (picker) {
      localFile = {
        file: {
          uri: picker?.uri,
          type: picker?.type,
          name: pdfName,
        },
        isFromPicker: true,
        type: imagePayloadType,
      };
    }

    if (photo) DeviceEventEmitter.emit('Camera.preview', photo);
    else DeviceEventEmitter.emit('Camera.preview', picker);
    if (navigateTo) {
      customLog('screen::: ', navigateTo);
      switch (navigateTo) {
        case CREATE_VISITATION:
          dispatch(
            setImageURLS({ file: localFile, source: CREATE_VISITATION })
          );
          navigation.goBack();
          navigation.dispatch(
            StackActions.replace(navigateTo, { existingVisitation })
          );
          return;
        case PO:
          dispatch({
            type: 'addImages',
            value: localFile,
          });
          navigation.dispatch(StackActions.replace(navigateTo));
          return;
        case ENTRY_TYPE[ENTRY_TYPE.BATCHER]:
          dispatch(setImageURLS({ file: localFile, source: OPERATION }));
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
          dispatch(setImageURLS({ file: localFile, source: OPERATION }));
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
            dispatch(setImageURLS({ file: localFile, source: OPERATION, key: 'penuangan' }));
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
          dispatch(setImageURLS({ file: localFile, source: OPERATION }));
          navigation.navigate(SUBMIT_FORM, {
            operationType: ENTRY_TYPE.RETURN,
          });
          return;
        case CREATE_DEPOSIT:
          dispatch(setImageURLS({ file: localFile, source: CREATE_DEPOSIT }));
          navigation.goBack();
          navigation.dispatch(StackActions.replace(navigateTo));
          return;
        case GALLERY_VISITATION:
          dispatch(
            setImageURLS({ file: localFile, source: CREATE_VISITATION })
          );
          navigation.dispatch(StackActions.pop(2));
          return;
        case GALLERY_DEPOSIT:
          dispatch(setImageURLS({ file: localFile, source: CREATE_DEPOSIT }));
          navigation.dispatch(StackActions.pop(2));
          return;
        default:
          dispatch(setImageURLS({ file: localFile }));
          navigation.goBack();
          navigation.dispatch(StackActions.replace(navigateTo));
          return;
      }
    } else {
      dispatch(setImageURLS({ file: localFile }));
      navigation.dispatch(StackActions.pop(2));
    }
  };

  return (
    <View style={[_style, styles.parent]}>
      <View style={styles.container}>
        {photo && (
          <Image source={{ uri: `file:${photo}` }} style={styles.image} />
        )}
        {picker && picker.type === 'application/pdf' && (
          <Pdf style={styles.image} source={{ uri: picker?.uri }} />
        )}
        {picker &&
          (picker.type === 'image/jpeg' || picker.type === 'image/png') && (
            <Image source={{ uri: picker?.uri }} style={styles.image} />
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
