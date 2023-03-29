import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import LastStepPopUp from '../LastStepPopUp';
import {
  locationPayloadType,
  payloadPostType,
  picPayloadType,
  projectPayloadType,
  visitationPayload,
} from '@/interfaces';
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
  resetImageURLS,
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
import { BGallery, PopUpQuestion } from '@/components';
import {
  deleteImagesVisitation,
  resetVisitationState,
  updateDataVisitation,
  VisitationGlobalState,
} from '@/redux/reducers/VisitationReducer';

export type selectedDateType = {
  date: string;
  prettyDate: string;
  day: string;
};

function payloadMapper(
  values: VisitationGlobalState,
  type: 'VISIT' | 'SPH' | 'REJECTED' | ''
): payloadPostType {
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
  if (values.pics && values.pics.length > 0) {
    payload.pic = values.pics;
  }
  payload.visitation.order = 1;
  if (type === 'REJECTED') {
    payload.visitation.status = type;
  } else {
    payload.visitation.status = 'VISIT';
  }

  if (values.locationAddress?.line2) {
    payload.project.location.line2 = values.locationAddress?.line2;
  }
  if (values.locationAddress?.postalId) {
    payload.project.location.postalId = values.locationAddress?.postalId;
  }
  if (values.createdLocation?.postalId) {
    payload.project.location.postalId = values.createdLocation?.postalId;
  }
  if (values.existingLocationId) {
    payload.project.locationAddressId = values.existingLocationId;
  }
  if (values.locationAddress?.formattedAddress) {
    payload.project.location.formattedAddress =
      values.locationAddress?.formattedAddress;
  }
  if (values.locationAddress?.longitude) {
    payload.project.location.lon = values.locationAddress?.longitude;
  }
  if (values.locationAddress?.latitude) {
    payload.project.location.lat = values.locationAddress?.latitude;
  }
  if (values.createdLocation?.formattedAddress) {
    payload.visitation.location.formattedAddress =
      values.createdLocation?.formattedAddress;
  }
  if (values.createdLocation?.lon) {
    payload.visitation.location.lon = values.createdLocation?.lon;
  }
  if (values.createdLocation?.lat) {
    payload.visitation.location.lat = values.createdLocation?.lat;
  }

  if (values.customerType) {
    payload.visitation.customerType = values.customerType;
  }
  if (values.paymentType) {
    payload.visitation.paymentType = values.paymentType;
  }
  if (values.estimationDate?.estimationWeek) {
    payload.visitation.estimationWeek = values.estimationDate?.estimationWeek;
  }
  if (values.estimationDate?.estimationMonth) {
    payload.visitation.estimationMonth = values.estimationDate?.estimationMonth;
  }
  if (values.notes) {
    payload.visitation.visitNotes = values.notes;
  }
  if (values.selectedDate && type === 'VISIT') {
    const selectedDate = moment(values.selectedDate.date);
    payload.visitation.bookingDate = selectedDate.valueOf();
  }

  // if (stepFour.selectedDate) {
  payload.visitation.dateVisit = today.valueOf();
  payload.visitation.finishDate = today.valueOf();
  // }

  if (values.kategoriAlasan && type === 'REJECTED') {
    payload.visitation.rejectCategory = values.kategoriAlasan;
  }
  if (values.alasanPenolakan && type === 'REJECTED') {
    payload.visitation.rejectNotes = values.alasanPenolakan;
  }
  if (values.products && values.products.length > 0) {
    payload.visitation.products = values.products?.map((product) => {
      return {
        id: product.id,
      };
    });
  }
  if (values.projectName) {
    payload.project.name = values.projectName;
  }
  if (values.companyName) {
    if (values.customerType === 'COMPANY') {
      payload.project.companyDisplayName = values.companyName;
    }
  }
  if (values.stageProject) {
    payload.project.stage = values.stageProject;
  }
  payload.visitation.isBooking = type === 'VISIT' ? true : false;

  if (values.visitationId) {
    payload.visitation.visitationId = values.visitationId;
  }
  if (typeof values.existingOrderNum === 'number') {
    payload.visitation.order = values.existingOrderNum;
  }

  if (values.existingVisitationId) {
    payload.visitation.id = values.existingVisitationId;
  }
  if (values.projectId) {
    payload.project.id = values.projectId;
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
  const visitationData = useSelector((state: RootState) => state.visitation);

  const onChange = (key: any) => (e: any) => {
    dispatch(
      updateDataVisitation({
        type: key,
        value: e,
      })
    );
  };

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isLastStepVisible, setIsLastStepVisible] = useState(false);

  const removeImage = (pos: number) => {
    dispatch(deleteImage({ pos, source: CREATE_VISITATION }));
    dispatch(deleteImagesVisitation({ value: pos + 1 }));
  };

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION + '-Step4');
  }, [visitationData.images]);

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
        let payload: payloadPostType = payloadMapper(visitationData, type);
        const visitationMethod = {
          POST: postVisitation,
          PUT: putVisitationFlow,
        };
        const isDataUpdate = !!payload?.visitation?.id;
        const methodStr = isDataUpdate ? 'PUT' : 'POST';

        if (uploadedFilesResponse.length === 0) {
          const photoFiles = visitationData.images?.map((photo) => {
            return {
              ...photo.file,
              uri: photo?.file?.uri?.replace('file:', 'file://'),
            };
          });

          const data = await dispatch(
            postUploadFiles({ files: photoFiles, from: 'visitation' })
          ).unwrap();
          const files: { id: string; type: 'GALLERY' | 'COVER' }[] = [];
          data.forEach((photo: any) => {
            const photoName = `${photo.name}.${photo.type}`;
            const photoNamee = `${photo.name}.jpg`;
            const foundObject = visitationData.images?.find(
              (obj) =>
                obj?.file?.name === photoName || obj?.file?.name === photoNamee
            );
            if (foundObject) {
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
        dispatch(resetImageURLS({ source: CREATE_VISITATION }));
        dispatch(resetVisitationState());
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Successfully create visitation',
            highlightedText: 'visitation',
            outsideClickClosePopUp: true,
          })
        );
      } catch (error: any) {
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
    [visitationData]
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
          visitationData.selectedDate
            ? `${visitationData.selectedDate?.day}, ${visitationData.selectedDate?.prettyDate}`
            : ''
        }
        closedLostValueOnChange={{
          dropdownOnchange: onChange('kategoriAlasan'),
          dropdownValue: visitationData.kategoriAlasan,
          areaOnChange: onChange('alasanPenolakan'),
          areaValue: visitationData.alasanPenolakan,
        }}
        onPressSubmit={onPressSubmit}
        isLoading={isPostVisitationLoading || isUploadLoading}
      />
      <BGallery
        picts={visitationData.images}
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
