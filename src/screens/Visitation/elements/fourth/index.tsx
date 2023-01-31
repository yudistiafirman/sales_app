import React, { useCallback, useEffect, useState } from 'react';
import { colors, layout } from '@/constants';
import {
  DeviceEventEmitter,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { resScale } from '@/utils';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PopUpQuestion from '../PopUpQuestion';
import LastStepPopUp from '../LastStepPopUp';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import {
  CreateVisitationFourthStep,
  locationPayloadType,
  payloadPostType,
  picPayloadType,
  projectPayloadType,
  visitationPayload,
} from '@/interfaces';
import { CreateVisitationState } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { postUploadFiles } from '@/redux/async-thunks/commonThunks';
import { postVisitation } from '@/redux/async-thunks/productivityFlowThunks';
import { RootState } from '@/redux/store';
import { StackActions, useNavigation } from '@react-navigation/native';
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { setIsPopUpVisible as setGlobalPopUp } from '@/redux/reducers/modalReducer';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';

type selectedDateType = {
  date: string;
  prettyDate: string;
  day: string;
};

function payloadMapper(
  values: CreateVisitationState,
  type: 'VISIT' | 'SPH' | 'REJECTED' | ''
) {
  const { stepOne, stepTwo, stepThree, stepFour } = values;
  const today = moment();
  const payload = {
    visitation: {
      location: {} as locationPayloadType,
    } as visitationPayload,
    project: {
      location: {} as locationPayloadType,
    } as projectPayloadType,
    pic: [] as picPayloadType[],
    files: [],
  } as payloadPostType;
  if (stepTwo.pics.length > 0) {
    // payload.pic.push(stepTwo.selectedPic);
    payload.pic = stepTwo.pics;
  }
  payload.visitation.order = 1;
  payload.visitation.status = type;
  // console.log(stepTwo, 'stepone');

  if (stepOne.locationAddress.formattedAddress) {
    payload.project.location.formattedAddress =
      stepOne.locationAddress.formattedAddress;
  }
  if (stepOne.locationAddress.longitude) {
    payload.project.location.lon = stepOne.locationAddress.longitude;
  }
  if (stepOne.locationAddress.latitude) {
    payload.project.location.lat = stepOne.locationAddress.latitude;
  }
  if (stepOne.createdLocation.formattedAddress) {
    payload.visitation.location.formattedAddress =
      stepOne.createdLocation.formattedAddress;
  }
  if (stepOne.createdLocation.lon) {
    payload.visitation.location.lon = stepOne.createdLocation.lon;
  }
  if (stepOne.createdLocation.lat) {
    payload.visitation.location.lat = stepOne.createdLocation.lat;
  }

  if (stepTwo.customerType) {
    payload.visitation.customerType = stepTwo.customerType;
  }
  if (stepThree.paymentType) {
    payload.visitation.paymentType = stepThree.paymentType;
  }
  if (stepThree.estimationDate.estimationWeek) {
    payload.visitation.estimationWeek = stepThree.estimationDate.estimationWeek;
  }
  if (stepThree.estimationDate.estimationMonth) {
    payload.visitation.estimationMonth =
      stepThree.estimationDate.estimationMonth;
  }
  if (stepThree.notes) {
    payload.visitation.visitationNotes = stepThree.notes;
  }
  if (stepFour.selectedDate && type === 'VISIT') {
    payload.visitation.bookingDate = today.valueOf();
  }
  if (stepFour.selectedDate) {
    const selectedDate = moment(stepFour.selectedDate.date);
    payload.visitation.dateVisit = selectedDate.valueOf();
    payload.visitation.finishDate = selectedDate.valueOf();
  }

  if (stepFour.kategoriAlasan && type === 'REJECTED') {
    payload.visitation.rejectCategory = stepFour.kategoriAlasan;
  }
  if (stepFour.alasanPenolakan && type === 'REJECTED') {
    payload.visitation.rejectNotes = stepFour.alasanPenolakan;
  }
  if (stepThree.products.length > 0) {
    payload.visitation.products = stepThree.products.map((product) => {
      return {
        id: product.id,
      };
    });
  }
  if (stepTwo.projectName) {
    payload.project.name = stepTwo.projectName;
  }
  if (stepTwo.companyName) {
    payload.project.companyDisplayName = stepTwo.companyName.title;
  }
  if (stepThree.stageProject) {
    payload.project.stage = stepThree.stageProject;
  }
  payload.visitation.isBooking = type === 'VISIT' ? true : false;

  // console.log(JSON.stringify(payload), 'payloadds');
  return payload;
}

const Fourth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isUploadLoading = useSelector(
    (state: RootState) => state.common.isUploadLoading
  );
  const isPostVisitationLoading = useSelector(
    (state: RootState) => state.common.isPostVisitationLoading
  );
  const photos = useSelector((state: RootState) => state.camera.photoURLs);
  const uploadedFilesResponse = useSelector(
    (state: RootState) => state.camera.uploadedFilesResponse
  );
  const photoUrls = useSelector((state: RootState) => state.camera.photoURLs);
  const { values, action } = React.useContext(createVisitationContext);
  const { stepFour: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationFourthStep) => (e: any) => {
    updateValueOnstep('stepFour', key, e);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isLastStepVisible, setIsLastStepVisible] = useState(false);

  // const addImage = (image: any) => {
  //   const imagesArray = [...state.images, image];

  //   onChange('images')(imagesArray);
  // };
  const addImage = useCallback(
    (image: any) => {
      const imagesArray = [...state.images, image];
      onChange('images')(imagesArray);
    },
    [state.images]
  );

  const removeImage = useCallback(
    (pos: number) => () => {
      dispatch(deleteImage({ pos }));
    },
    []
  );

  // const removeImage = (pos: number) => () => {
  //   const currentImages = state.images;
  //   currentImages.splice(pos, 1);
  //   onChange('images')([...currentImages]);
  // };

  useEffect(() => {
    // photos;
    onChange('images')(photos);
    console.log(photos, 'ini photos');
  }, [photos]);

  useEffect(() => {
    DeviceEventEmitter.addListener('CreateVisitation.continueButton', () => {
      setIsLastStepVisible((curr) => !curr);
    });
    DeviceEventEmitter.addListener('Camera.preview', () => {
      // setIsLastStepVisible((curr) => !curr);
      setIsPopUpVisible((curr) => !curr);
    });
    DeviceEventEmitter.addListener(
      'CalendarScreen.selectedDate',
      (date: selectedDateType) => {
        onChange('selectedDate')(date);
        setIsLastStepVisible((curr) => !curr);
      }
    );

    return () => {
      DeviceEventEmitter.removeAllListeners('CreateVisitation.continueButton');
      DeviceEventEmitter.removeAllListeners('CalendarScreen.selectedDate');
      DeviceEventEmitter.removeAllListeners('Camera.preview');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressSubmit = useCallback(
    (type: 'VISIT' | 'SPH' | 'REJECTED' | '') => {
      let payload = payloadMapper(values, type);
      // console.log(uploadedFilesResponse, 'uploadedFilesResponse');
      console.log(payload, 'payload233');
      if (uploadedFilesResponse.length === 0) {
        const photoFiles = photos.map((photo) => {
          return {
            ...photo.photo,
            uri: photo.photo.uri.replace('file:', 'file://'),
          };
        });

        dispatch(postUploadFiles({ files: photoFiles, from: 'visitation' }))
          .unwrap()
          .then((data) => {
            const files = data.map((photo) => {
              const photoName = `${photo.name}.${photo.type}`;
              const foundObject = photoUrls.find(
                (obj) => obj.photo.name === photoName
              );
              if (foundObject) {
                return {
                  id: photo.id,
                  type: foundObject.type,
                };
              }
            });
            payload.files = files;
            dispatch(postVisitation({ payload }))
              .unwrap()
              .then(() => {
                setIsLastStepVisible(false);
                navigation.goBack();
                dispatch(setGlobalPopUp());
              });
            console.log('ini setelah uploadfiles');
            console.log('langsung post visitation payload');
          });
      } else {
        payload.files = uploadedFilesResponse;
        dispatch(postVisitation({ payload }))
          .unwrap()
          .then(() => {
            setIsLastStepVisible(false);
            navigation.goBack();
            dispatch(setGlobalPopUp());
          });
        console.log('ini apabila files telah di upload');
        console.log('langsung post visitation payload');
      }
    },
    []
  );

  return (
    <>
      {/* <AddPictureModal
        isVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        initiatePopup={() => {
          setIsModalVisible((curr) => !curr);
          setTimeout(() => {
            setIsPopUpVisible((curr) => !curr);
          }, 200);
        }}
        addImage={addImage}
      /> */}
      <PopUpQuestion
        isVisible={isPopUpVisible}
        setIsPopupVisible={setIsPopUpVisible}
        initiateCameraModule={() => {
          setIsPopUpVisible((curr) => !curr);
          navigation.dispatch(
            StackActions.push('Camera', {
              photoTitle: 'Kunjungan',
            })
          );
        }}
      />
      <LastStepPopUp
        isVisible={isLastStepVisible}
        setIsPopUpVisible={setIsLastStepVisible}
        selectedDate={
          state.selectedDate
            ? `${state.selectedDate?.day}, ${state.selectedDate?.prettyDate}`
            : ''
        }
        closedLostValueOnChange={{
          dropdownOnchange: onChange('kategoriAlasan'),
          dropdownValue: state.kategoriAlasan,
          areaOnChange: onChange('alasanPenolakan'),
          areaValue: state.alasanPenolakan,
        }}
        onPressSubmit={onPressSubmit}
        isLoading={isPostVisitationLoading || isUploadLoading}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContentStyle}
        showsVerticalScrollIndicator={false}
      >
        {/* <BText>4</BText> */}
        <TouchableOpacity
          onPress={() => {
            // selectFile();
            // setIsModalVisible((curr) => !curr);
            navigation.dispatch(
              StackActions.push('Camera', {
                photoTitle: 'Kunjungan',
              })
            );
          }}
        >
          <View style={[styles.addImage, styles.container]}>
            <Feather name="plus" size={resScale(25)} color="#000000" />
          </View>
        </TouchableOpacity>
        {/* <BButtonPrimary
          title="upload files"
          onPress={() => {
            dispatch(postUploadFiles({ files: values.stepFour.images }));
          }}
          disable={isUploadLoading}
        /> */}
        {state.images.map((image, index) => {
          return (
            <View
              key={index.toString()}
              style={[styles.imageContainer, styles.container]}
            >
              <Image source={image.photo} style={styles.imageStyle} />
              {image.type === 'GALLERY' && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={removeImage(index)}
                >
                  <AntDesign
                    name="closecircle"
                    size={resScale(15)}
                    color="#000000"
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default Fourth;

const styles = StyleSheet.create({
  container: {
    width: resScale(102),
    height: resScale(120),
    margin: resScale(5),
    borderRadius: layout.radius.md,
  },
  imageContainer: {
    // backgroundColor: colors.tertiary,
    position: 'relative',
  },
  addImage: {
    backgroundColor: colors.tertiary,
    margin: resScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'blue',
  },
  closeIcon: {
    position: 'absolute',
    right: resScale(-5),
    top: resScale(-5),
  },
  imageStyle: {
    flex: 1,
  },
});
