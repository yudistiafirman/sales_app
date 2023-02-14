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
import {
  getOneVisitation,
  postVisitation,
  putVisitationFlow,
} from '@/redux/async-thunks/productivityFlowThunks';
import { RootState } from '@/redux/store';
import { StackActions, useNavigation } from '@react-navigation/native';
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { openPopUp } from '@/redux/reducers/modalReducer';
import moment from 'moment';
import { CAMERA, SPH_TITLE } from '@/navigation/ScreenNames';

export type selectedDateType = {
  date: string;
  prettyDate: string;
  day: string;
};

function payloadMapper(
  values: CreateVisitationState,
  type: 'VISIT' | 'SPH' | 'REJECTED' | ''
): payloadPostType {
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
    payload.pic = stepTwo.pics;
  }
  payload.visitation.order = 1;
  payload.visitation.status = type;

  const { locationAddress, createdLocation } = stepOne;
  const { estimationDate } = stepThree;

  if (locationAddress.line2) {
    payload.project.location.line2 = locationAddress.line2;
  }
  if (locationAddress.postalId) {
    payload.project.location.postalId = locationAddress.postalId;
  }
  if (createdLocation.postalId) {
    payload.project.location.postalId = createdLocation.postalId;
  }
  if (stepOne.existingLocationId) {
    payload.project.locationAddressId = stepOne.existingLocationId;
  }
  if (locationAddress.formattedAddress) {
    payload.project.location.formattedAddress =
      locationAddress.formattedAddress;
  }
  if (locationAddress.longitude) {
    payload.project.location.lon = locationAddress.longitude;
  }
  if (locationAddress.latitude) {
    payload.project.location.lat = locationAddress.latitude;
  }
  if (createdLocation.formattedAddress) {
    payload.visitation.location.formattedAddress =
      createdLocation.formattedAddress;
  }
  if (createdLocation.lon) {
    payload.visitation.location.lon = createdLocation.lon;
  }
  if (createdLocation.lat) {
    payload.visitation.location.lat = createdLocation.lat;
  }

  if (stepTwo.customerType) {
    payload.visitation.customerType = stepTwo.customerType;
  }
  if (stepThree.paymentType) {
    payload.visitation.paymentType = stepThree.paymentType;
  }
  if (estimationDate.estimationWeek) {
    payload.visitation.estimationWeek = estimationDate.estimationWeek;
  }
  if (estimationDate.estimationMonth) {
    payload.visitation.estimationMonth = estimationDate.estimationMonth;
  }
  if (stepThree.notes) {
    payload.visitation.visitationNotes = stepThree.notes;
  }
  if (stepFour.selectedDate && type === 'VISIT') {
    const selectedDate = moment(stepFour.selectedDate.date);
    payload.visitation.bookingDate = selectedDate.valueOf();
  }

  // if (stepFour.selectedDate) {
  payload.visitation.dateVisit = today.valueOf();
  payload.visitation.finishDate = today.valueOf();
  // }

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
    if (stepTwo.customerType === 'COMPANY') {
      payload.project.companyDisplayName = stepTwo.companyName;
    }
  }
  if (stepThree.stageProject) {
    payload.project.stage = stepThree.stageProject;
  }
  payload.visitation.isBooking = type === 'VISIT' ? true : false;

  if (stepTwo.visitationId) {
    payload.visitation.visitationId = stepTwo.visitationId;
  }
  if (typeof stepTwo.existingOrderNum === 'number') {
    payload.visitation.order = stepTwo.existingOrderNum;
  }

  if (values.existingVisitationId) {
    payload.visitation.id = values.existingVisitationId;
  }
  if (stepTwo.projectId) {
    payload.project.id = stepTwo.projectId;
    payload.visitation.order += 1;
  }

  // console.log(JSON.stringify(payload), 'payloadds');
  return payload;
}

const Fourth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { isUploadLoading, isPostVisitationLoading } = useSelector(
    (state: RootState) => state.common
  );
  const { uploadedFilesResponse } = useSelector(
    (state: RootState) => state.camera
  );

  const { photoURLs: photoUrls } = useSelector(
    (state: RootState) => state.camera
  );
  const { values, action } = React.useContext(createVisitationContext);
  const { stepFour: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationFourthStep) => (e: any) => {
    updateValueOnstep('stepFour', key, e);
  };

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isLastStepVisible, setIsLastStepVisible] = useState(false);

  const removeImage = useCallback(
    (pos: number) => () => {
      dispatch(deleteImage({ pos }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    // photoUrls;
    onChange('images')(photoUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoUrls]);

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
    async (type: 'VISIT' | 'SPH' | 'REJECTED' | '') => {
      try {
        let payload: payloadPostType = payloadMapper(values, type);
        // console.log(uploadedFilesResponse, 'uploadedFilesResponse');
        console.log(
          JSON.stringify(payload),
          'payload216',
          uploadedFilesResponse
        );
        const visitationMethod = {
          POST: postVisitation,
          PUT: putVisitationFlow,
        };
        const isDataUpdate = !!payload?.visitation?.id;
        const methodStr = isDataUpdate ? 'PUT' : 'POST';

        if (uploadedFilesResponse.length === 0) {
          const photoFiles = photoUrls.map((photo) => {
            return {
              ...photo.photo,
              uri: photo?.photo?.uri?.replace('file:', 'file://'),
            };
          });

          const data = await dispatch(
            postUploadFiles({ files: photoFiles, from: 'visitation' })
          ).unwrap();

          const files = data.map((photo) => {
            const photoName = `${photo.name}.${photo.type}`;
            const photoNamee = `${photo.name}.jpg`;
            const foundObject = photoUrls.find(
              (obj) =>
                obj?.photo?.name === photoName ||
                obj?.photo?.name === photoNamee
            );
            if (foundObject) {
              return {
                id: photo.id,
                type: foundObject.type,
              };
            }
          });
          payload.files = files;
          const payloadData: {
            payload: payloadPostType;
            visitationId?: string;
          } = {
            payload,
          };
          if (payload?.visitation?.id) {
            payloadData.visitationId = payload?.visitation?.id;
          }

          const response = await dispatch(
            visitationMethod[methodStr](payloadData)
          ).unwrap();

          console.log(response, 'response242', type);

          setIsLastStepVisible(false);
          if (type === 'SPH') {
            navigation.dispatch(
              StackActions.replace(SPH_TITLE, {
                projectId: response.projectId,
              })
            );
          } else {
            navigation.goBack();
          }
        } else {
          payload.files = uploadedFilesResponse;
          const payloadData: {
            payload: payloadPostType;
            visitationId?: string;
          } = {
            payload,
          };
          if (payload?.visitation?.id) {
            payloadData.visitationId = payload?.visitation?.id;
          }
          const response = await dispatch(
            visitationMethod[methodStr](payloadData)
          ).unwrap();

          console.log(response, 'response258');

          setIsLastStepVisible(false);
          if (type === 'SPH') {
            navigation.dispatch(
              StackActions.replace(SPH_TITLE, {
                projectId: response.projectId,
              })
            );
          } else {
            navigation.goBack();
          }
        }
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Successfully create visitation',
            highlightedText: 'visitation',
            outsideClickClosePopUp: true,
          })
        );
      } catch (error) {
        console.log(error, 'error271fourth');
        const message = error.message || 'Error creating visitation';
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText: message,
            highlightedText: 'error',
            outsideClickClosePopUp: true,
          })
        );
      }
    },
    [values]
  );

  return (
    <>
      <PopUpQuestion
        isVisible={isPopUpVisible}
        setIsPopupVisible={setIsPopUpVisible}
        initiateCameraModule={() => {
          setIsPopUpVisible((curr) => !curr);
          navigation.dispatch(
            StackActions.push(CAMERA, {
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
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(
              StackActions.push(CAMERA, {
                photoTitle: 'Kunjungan',
              })
            );
          }}
        >
          <View style={[styles.addImage, styles.container]}>
            <Feather name="plus" size={resScale(25)} color="#000000" />
          </View>
        </TouchableOpacity>
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
