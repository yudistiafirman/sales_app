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
import { useDispatch, useSelector } from 'react-redux';
import { setImageURLS } from '@/redux/reducers/cameraReducer';
import {
  CAMERA,
  CREATE_DEPOSIT,
  CREATE_VISITATION,
  FORM_SO,
  GALLERY_DEPOSIT,
  GALLERY_OPERATION,
  GALLERY_SO,
  GALLERY_VISITATION,
  IMAGE_PREVIEW,
  PO,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { ENTRY_TYPE } from '@/models/EnumModel';
import Pdf from 'react-native-pdf';
import { LocalFileType } from '@/interfaces/LocalFileType';
import {
  resetAllStepperFocused,
  updateDataVisitation,
} from '@/redux/reducers/VisitationReducer';
import {
  onChangeProjectDetails,
  resetInputsValue,
  setOperationPhoto,
} from '@/redux/reducers/operationReducer';
import { RootState } from '@/redux/store';
import {
  onUpdateSOID,
  onUpdateSONumber,
  setAllSOPhoto,
  setSOPhoto,
} from '@/redux/reducers/salesOrder';
import { updateDeliverOrder } from '@/models/updateDeliveryOrder';
import { updateDeliveryOrder } from '@/actions/OrderActions';

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
  const operationTempData = route?.params?.operationTempData;
  const closeButton = route?.params?.closeButton;
  const existingVisitation = route?.params?.existingVisitation;
  const soNumber = route?.params?.soNumber;
  const soID = route?.params?.soID;
  const visitationData = useSelector((state: RootState) => state.visitation);
  const operationData = useSelector((state: RootState) => state.operation);

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
        navigateTo !== PO &&
        navigateTo !== ENTRY_TYPE.DRIVER &&
        navigateTo !== ENTRY_TYPE.DISPATCH &&
        navigateTo !== ENTRY_TYPE.RETURN &&
        navigateTo !== ENTRY_TYPE.IN &&
        navigateTo !== ENTRY_TYPE.OUT &&
        navigateTo !== GALLERY_OPERATION &&
        navigateTo !== FORM_SO &&
        navigateTo !== GALLERY_SO
      ) {
        return 'COVER';
      } else {
        return 'GALLERY';
      }
    } else {
      return 'GALLERY';
    }
  };

  const onArrivedDriver = async () => {
    try {
      const payload = {} as updateDeliverOrder;
      payload.status = 'ARRIVED';
      const responseUpdateDeliveryOrder = await updateDeliveryOrder(
        payload,
        operationTempData?.deliveryOrderId ||
          operationData?.projectDetails?.deliveryOrderId
      );

      if (responseUpdateDeliveryOrder.data.success) {
        // do nothing
        console.log('SUCCESS ARRIVED');
      } else {
        // do nothing
        console.log('FAILED ARRIVED');
      }
    } catch (error) {
      // do nothing
      console.log('FAILED ARRIVED, ', error);
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

    if (
      navigateTo === ENTRY_TYPE.DRIVER ||
      navigateTo === ENTRY_TYPE.DISPATCH ||
      navigateTo === ENTRY_TYPE.RETURN ||
      navigateTo === ENTRY_TYPE.IN ||
      navigateTo === ENTRY_TYPE.OUT
    ) {
      if (operationTempData) {
        dispatch(resetInputsValue());
        dispatch(onChangeProjectDetails({ projectDetails: operationTempData }));
      }
    }

    if (navigateTo === FORM_SO) {
      dispatch(onUpdateSONumber({ number: soNumber }));
      dispatch(onUpdateSOID({ id: soID }));
      dispatch(setAllSOPhoto({ file: [{ file: null }] }));
    }

    if (photo) DeviceEventEmitter.emit('Camera.preview', photo);
    else DeviceEventEmitter.emit('Camera.preview', picker);
    let images: any[] = [];
    if (navigateTo) {
      switch (navigateTo) {
        case CREATE_VISITATION:
          dispatch(
            setImageURLS({ file: localFile, source: CREATE_VISITATION })
          );
          if (visitationData.images && visitationData.images.length > 0)
            images = [{ file: null }];
          images.push(localFile);
          dispatch(updateDataVisitation({ type: 'images', value: images }));
          dispatch(resetAllStepperFocused());
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
        case ENTRY_TYPE.BATCHER:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Mix Design',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.BATCHER,
            });
          }
          return;
        case ENTRY_TYPE.DISPATCH:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'DO',
              navigateTo: navigateTo,
              operationAddedStep: 'driver',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'driver') {
            navigation.navigate(CAMERA, {
              photoTitle: 'NOPOL',
              navigateTo: navigateTo,
              operationAddedStep: 'DO',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'DO') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Segel',
              navigateTo: navigateTo,
              operationAddedStep: 'NOPOL',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'NOPOL') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Kondom',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.DISPATCH,
            });
          }
          return;
        case ENTRY_TYPE.DRIVER:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            onArrivedDriver();
            navigation.navigate(CAMERA, {
              photoTitle: 'Beton Dalam Gentong Pas Sampai',
              navigateTo: navigateTo,
              operationAddedStep: 'bnib',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'bnib') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Penerima',
              navigateTo: navigateTo,
              operationAddedStep: 'receipient',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'receipient') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Penambahan Air (jika ada)',
              navigateTo: navigateTo,
              operationAddedStep: 'water',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'water') {
            navigation.navigate(CAMERA, {
              photoTitle: 'DO',
              navigateTo: navigateTo,
              operationAddedStep: 'DO',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'DO') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Beton Saat Dituang',
              navigateTo: navigateTo,
              operationAddedStep: 'unboxing',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'unboxing') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Gentong Saat Sudah Selesei Dituang (kosong)',
              navigateTo: navigateTo,
              operationAddedStep: 'out',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'out') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Lokasi Proyek Saat Selesai Dituang',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.DRIVER,
            });
          }
          return;
        case ENTRY_TYPE.IN:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Hasil',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.IN,
            });
          }
          return;
        case ENTRY_TYPE.OUT:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Hasil',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.OUT,
            });
          }
          return;
        case ENTRY_TYPE.RETURN:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: true })
          );
          if (!operationAddedStep || operationAddedStep === '') {
            navigation.navigate(CAMERA, {
              photoTitle: 'Kondisi TM',
              navigateTo: navigateTo,
              operationAddedStep: 'finished',
              operationTempData: operationTempData,
            });
          } else if (operationAddedStep === 'finished') {
            navigation.navigate(SUBMIT_FORM, {
              operationType: ENTRY_TYPE.RETURN,
            });
          }
          return;
        case FORM_SO:
          dispatch(setSOPhoto({ file: localFile }));
          navigation.dispatch(StackActions.pop(2));
          navigation.navigate(navigateTo);
          return;
        case GALLERY_SO:
          dispatch(setSOPhoto({ file: localFile }));
          navigation.dispatch(StackActions.pop(2));
          return;
        case CREATE_DEPOSIT:
          dispatch(setSOPhoto({ file: localFile }));
          navigation.goBack();
          navigation.dispatch(StackActions.replace(navigateTo));
          return;
        case GALLERY_VISITATION:
          dispatch(
            setImageURLS({ file: localFile, source: CREATE_VISITATION })
          );
          if (visitationData.images && visitationData.images.length > 0)
            images = [...visitationData.images];
          images.push(localFile);
          dispatch(updateDataVisitation({ type: 'images', value: images }));
          navigation.dispatch(StackActions.pop(2));
          return;
        case GALLERY_DEPOSIT:
          dispatch(setImageURLS({ file: localFile, source: CREATE_DEPOSIT }));
          navigation.dispatch(StackActions.pop(2));
          return;
        case GALLERY_OPERATION:
          dispatch(
            setOperationPhoto({ file: localFile, withoutAddButton: false })
          );
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
