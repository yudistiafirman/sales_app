import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
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
  postVisitation,
  putVisitationFlow,
} from '@/redux/async-thunks/productivityFlowThunks';
import { RootState } from '@/redux/store';
import { StackActions, useNavigation } from '@react-navigation/native';
import {
  deleteImage,
  setuploadedFilesResponse,
} from '@/redux/reducers/cameraReducer';
import { openPopUp } from '@/redux/reducers/modalReducer';
import moment from 'moment';
import {
  CAMERA,
  CREATE_VISITATION,
  GALLERY_VISITATION,
  SPH,
} from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { customLog } from '@/utils/generalFunc';
import { BGallery, PopUpQuestion } from '@/components';

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
  if (type === 'REJECTED') {
    payload.visitation.status = type;
  } else {
    payload.visitation.status = 'VISIT';
  }

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
    payload.visitation.visitNotes = stepThree.notes;
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

  const { visitationPhotoURLs } = useSelector(
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
      dispatch(deleteImage({ pos, source: CREATE_VISITATION }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION + '-Step4');
    // photoUrls;
    onChange('images')(visitationPhotoURLs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitationPhotoURLs]);

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
        customLog(JSON.stringify(payload), 'payload216', uploadedFilesResponse);
        const visitationMethod = {
          POST: postVisitation,
          PUT: putVisitationFlow,
        };
        const isDataUpdate = !!payload?.visitation?.id;
        const methodStr = isDataUpdate ? 'PUT' : 'POST';

        if (uploadedFilesResponse.length === 0) {
          const photoFiles = visitationPhotoURLs.map((photo) => {
            return {
              ...photo.file,
              uri: photo?.file?.uri?.replace('file:', 'file://'),
            };
          });

          const data = await dispatch(
            postUploadFiles({ files: photoFiles, from: 'visitation' })
          ).unwrap();
          const files: { id: string; type: 'GALLERY' | 'COVER' }[] = [];
          data.forEach((photo) => {
            const photoName = `${photo.name}.${photo.type}`;
            const photoNamee = `${photo.name}.jpg`;
            const foundObject = visitationPhotoURLs.find(
              (obj) =>
                obj?.file?.name === photoName || obj?.file?.name === photoNamee
            );
            if (foundObject) {
              // return {
              //   id: photo.id,
              //   type: foundObject.type,
              // };
              files.push({
                id: photo.id,
                type: foundObject.type,
              });
            }
          });
          dispatch(setuploadedFilesResponse(files));
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

          customLog(response, 'response242', type);

          setIsLastStepVisible(false);
          if (type === 'SPH') {
            navigation.dispatch(
              StackActions.replace(SPH, {
                projectId: response.projectId,
              })
            );
          } else {
            navigation.goBack();
          }
        } else {
          customLog(uploadedFilesResponse, 'iniuploadfileresponse');
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

          customLog(response, 'response258');

          setIsLastStepVisible(false);
          if (type === 'SPH') {
            navigation.dispatch(
              StackActions.replace(SPH, {
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
        customLog(error, 'error271fourth');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values]
  );

  return (
    <>
      <PopUpQuestion
        isVisible={isPopUpVisible}
        setIsPopupVisible={setIsPopUpVisible}
        actionButton={() => {
          setIsPopUpVisible((curr) => !curr);
          navigation.dispatch(
            StackActions.push(CAMERA, {
              photoTitle: 'Kunjungan',
              closeButton: true,
              navigateTo: GALLERY_VISITATION,
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
      <BGallery
        picts={state.images}
        addMorePict={() =>
          navigation.dispatch(
            StackActions.push(CAMERA, {
              photoTitle: 'Kunjungan',
              closeButton: true,
              navigateTo: GALLERY_VISITATION,
            })
          )
        }
        removePict={removeImage}
      />
    </>
  );
};

export default Fourth;
