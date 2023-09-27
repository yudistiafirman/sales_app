import React, { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import {
    CustomerVisitationPayloadType,
    locationPayloadType,
    payloadPostType,
    picPayloadType,
    projectPayloadType,
    visitationPayload
} from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StackActions, useNavigation } from "@react-navigation/native";
import {
    deleteImage,
    resetImageURLS,
    setuploadedFilesResponse
} from "@/redux/reducers/cameraReducer";
import { openPopUp } from "@/redux/reducers/modalReducer";
import moment from "moment";
import {
    CAMERA,
    CREATE_VISITATION,
    GALLERY_VISITATION,
    SPH
} from "@/navigation/ScreenNames";
import crashlytics from "@react-native-firebase/crashlytics";
import { BGallery, PopUpQuestion } from "@/components";
import {
    deleteImagesVisitation,
    resetVisitationState,
    updateDataVisitation,
    VisitationGlobalState
} from "@/redux/reducers/VisitationReducer";
import { postVisitations, putVisitation } from "@/actions/ProductivityActions";
import { uploadFiles } from "@/actions/CommonActions";
import { resetSPHState } from "@/redux/reducers/SphReducer";
import { COMPANY } from "@/constants/general";
import { safetyCheck } from "@/utils/generalFunc";
import LastStepPopUp from "../LastStepPopUp";

export type SelectedDateType = {
    date: string;
    prettyDate: string;
    day: string;
};

function payloadMapper(
    values: VisitationGlobalState,
    type: "VISIT" | "SPH" | "REJECTED" | ""
): payloadPostType {
    const today = moment();
    const payload = {
        visitation: {
            location: {} as locationPayloadType
        } as visitationPayload,
        project: {
            location: {} as locationPayloadType
        } as projectPayloadType,
        pic: [] as picPayloadType[],
        files: [],
        customer: {} as CustomerVisitationPayloadType
    } as payloadPostType;
    const selectedCustomerType =
        values?.customerType === COMPANY ? "company" : "individu";
    if (
        values[selectedCustomerType]?.pics &&
        values[selectedCustomerType]?.pics?.length > 0
    ) {
        payload.pic = values[selectedCustomerType]?.pics;
    }
    payload.visitation.order = 1;
    if (type === "REJECTED") {
        payload.visitation.status = type;
    } else {
        payload.visitation.status = "VISIT";
    }

    if (values?.locationAddress?.line2) {
        payload.project.location.line2 = values?.locationAddress?.line2;
    }
    if (values?.locationAddress?.PostalId) {
        payload.project.location.postalId = values?.locationAddress?.PostalId;
    }
    if (values?.createdLocation?.PostalId) {
        payload.project.location.postalId = values?.createdLocation?.PostalId;
    }
    if (values?.existingLocationId) {
        payload.project.locationAddressId = values?.existingLocationId;
    }
    if (values?.locationAddress?.formattedAddress) {
        payload.project.location.formattedAddress =
            values?.locationAddress?.formattedAddress;
    }
    if (safetyCheck(values?.locationAddress?.longitude)) {
        payload.project.location.lon = values?.locationAddress?.longitude;
    }
    if (safetyCheck(values?.locationAddress?.latitude)) {
        payload.project.location.lat = values?.locationAddress?.latitude;
    }
    if (values?.createdLocation?.formattedAddress) {
        payload.visitation.location.formattedAddress =
            values?.createdLocation?.formattedAddress;
    }

    if (safetyCheck(values?.createdLocation?.longitude)) {
        payload.visitation.location.lon = values?.createdLocation?.longitude;
    }
    if (safetyCheck(values?.createdLocation?.latitude)) {
        payload.visitation.location.lat = values?.createdLocation?.latitude;
    }
    if (values?.createdLocation?.PostalId) {
        payload.visitation.location.postalId =
            values?.createdLocation?.PostalId;
    }

    if (values?.paymentType) {
        payload.visitation.paymentType = values?.paymentType;
    }
    if (values?.estimationDate?.estimationWeek) {
        payload.visitation.estimationWeek =
            values?.estimationDate?.estimationWeek;
    }
    if (values?.estimationDate?.estimationMonth) {
        payload.visitation.estimationMonth =
            values?.estimationDate?.estimationMonth;
    }
    if (values?.notes) {
        payload.visitation.visitNotes = values?.notes;
    }
    if (values?.selectedDate && type === "VISIT") {
        const selectedDate = moment(values?.selectedDate?.date);
        payload.visitation.bookingDate = selectedDate?.valueOf();
    }

    // if (stepFour.selectedDate) {
    payload.visitation.dateVisit = today?.valueOf();
    payload.visitation.finishDate = today?.valueOf();
    // }

    if (values?.kategoriAlasan && type === "REJECTED") {
        payload.visitation.rejectCategory = values?.kategoriAlasan;
    }
    if (values?.alasanPenolakan && type === "REJECTED") {
        payload.visitation.rejectNotes = values?.alasanPenolakan;
    }
    if (values?.products && values?.products?.length > 0) {
        payload.visitation.products = values?.products?.map((product) => ({
            id: product?.id,
            quantity: product?.quantity,
            pouringMethod: product?.pouringMethod
        }));
    }
    if (values[selectedCustomerType]?.projectName) {
        payload.project.name = values[selectedCustomerType]?.projectName;
    }
    // if (values?.companyName) {
    //     if (values?.customerType === "COMPANY") {
    //         payload.project.companyDisplayName = values?.companyName;
    //     }
    // }
    if (values?.stageProject) {
        payload.project.stage = values?.stageProject;
    }
    if (values?.typeProject) {
        payload.project.type = values?.typeProject;
    }
    if (values?.competitors && values?.competitors?.length > 0) {
        payload.visitation.competitors = values?.competitors;
    }
    // if (values.currentCompetitor) {
    //   payload.visitation.competitors = [values.currentCompetitor];
    // }
    payload.visitation.isBooking = type === "VISIT";

    if (values?.visitationId) {
        payload.visitation.visitationId = values?.visitationId;
    }
    if (typeof values?.existingOrderNum === "number") {
        payload.visitation.order = values?.existingOrderNum;
    }

    if (values?.existingVisitationId) {
        payload.visitation.id = values?.existingVisitationId;
    }
    if (values?.projectId) {
        payload.project.id = values?.projectId;
        payload.visitation.order += 1;
    }
    if (values?.customerType) {
        payload.visitation.customerType = values?.customerType;
    }

    if (values[selectedCustomerType]?.selectedCustomer?.id) {
        payload.customer.id = values[selectedCustomerType].selectedCustomer.id;
    }
    if (values[selectedCustomerType]?.selectedCustomer?.title) {
        payload.customer.displayName =
            values[selectedCustomerType].selectedCustomer.title;
    } else {
        payload.customer.displayName =
            values[selectedCustomerType].customerData.searchQuery;
    }

    if (values?.customerType) {
        payload.customer.type = values?.customerType;
    }
    if (values[selectedCustomerType]?.selectedCustomer?.paymentType) {
        payload.customer.paymentType =
            values[selectedCustomerType].selectedCustomer.paymentType;
    } else {
        payload.customer.paymentType = "CBD";
    }

    return payload;
}

function Fifth() {
    let clicked = "0";
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isUploadLoading, isPostVisitationLoading } = useSelector(
        (state: RootState) => state.common
    );
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );
    const { uploadedFilesResponse } = useSelector(
        (state: RootState) => state.camera
    );
    const visitationData = useSelector((state: RootState) => state.visitation);

    const onChange = (key: any) => (e: any) => {
        dispatch(
            updateDataVisitation({
                type: key,
                value: e
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
        crashlytics().log(`${CREATE_VISITATION}-Step5`);
    }, [visitationData?.images]);

    useEffect(() => {
        DeviceEventEmitter.addListener(
            "CreateVisitation.continueButton",
            () => {
                setIsLastStepVisible((curr) => !curr);
            }
        );
        DeviceEventEmitter.addListener("Camera.preview", () => {
            // setIsLastStepVisible((curr) => !curr);
            setIsPopUpVisible((curr) => !curr);
        });
        DeviceEventEmitter.addListener(
            "CalendarScreen.selectedDate",
            (date: SelectedDateType) => {
                onChange("selectedDate")(date);
                setIsLastStepVisible((curr) => !curr);
            }
        );

        return () => {
            DeviceEventEmitter.removeAllListeners(
                "CreateVisitation.continueButton"
            );
            DeviceEventEmitter.removeAllListeners(
                "CalendarScreen.selectedDate"
            );
            DeviceEventEmitter.removeAllListeners("Camera.preview");
        };
    }, []);

    const onPressSubmit = async (type: "VISIT" | "SPH" | "REJECTED" | "") => {
        setIsLastStepVisible(false);
        dispatch(
            openPopUp({
                popUpType: "loading",
                popUpText: "Menambahkan Jadwal Kunjungan",
                highlightedText: "Jadwal Kunjungan",
                outsideClickClosePopUp: false
            })
        );
        const payload: payloadPostType = payloadMapper(visitationData, type);
        payload.batchingPlantId = selectedBatchingPlant?.id;
        const isDataUpdate = !!payload?.visitation?.id;
        const methodStr = isDataUpdate ? "PUT" : "POST";
        payload.files = [];
        try {
            setTimeout(async () => {
                if (clicked === "0") {
                    clicked = "1";
                    let response;
                    if (
                        !uploadedFilesResponse ||
                        uploadedFilesResponse?.length === 0
                    ) {
                        const photoFiles = visitationData?.images
                            ?.filter((v, i) => v?.file !== null)
                            ?.map((photo) => ({
                                ...photo?.file,
                                uri: photo?.file?.uri?.replace(
                                    "file:",
                                    "file://"
                                )
                            }));

                        let photoResponse;
                        if (photoFiles && photoFiles?.length > 0) {
                            photoResponse = await uploadFiles(
                                photoFiles,
                                "visitation"
                            ).catch((err) => Error(err));
                        }
                        const files: {
                            id: string;
                            type: "GALLERY" | "COVER";
                        }[] = [];
                        if (
                            photoResponse?.data?.success &&
                            photoResponse?.data?.success !== false
                        ) {
                            photoResponse?.data?.data?.forEach((photo: any) => {
                                const photoName = photo?.name;
                                const foundObject =
                                    visitationData?.images?.find((obj) =>
                                        obj?.file?.name?.includes(photoName)
                                    );
                                if (foundObject) {
                                    files?.push({
                                        id: photo?.id,
                                        type: foundObject?.type
                                    });
                                }
                            });
                        }
                        dispatch(setuploadedFilesResponse(files));
                        if (files && files?.length > 0) payload.files = files;
                        const payloadData: {
                            payload: payloadPostType;
                            visitationId?: string;
                        } = {
                            payload
                        };
                        if (payload?.visitation?.id) {
                            payloadData.visitationId = payload?.visitation?.id;
                        }

                        if (methodStr === "POST") {
                            response = await postVisitations(payloadData).catch(
                                (err) => Error(err)
                            );
                        } else {
                            response = await putVisitation(
                                payloadData,
                                payloadData?.visitationId
                            ).catch((err) => Error(err));
                        }
                        if (
                            response?.data?.success &&
                            response?.data?.success !== false
                        ) {
                            if (type === "SPH") {
                                dispatch(resetSPHState());
                                navigation.dispatch(
                                    StackActions.replace(SPH, {
                                        projectId:
                                            response?.data?.data?.projectId
                                    })
                                );
                            } else if (navigation.canGoBack()) {
                                navigation.dispatch(StackActions.popToTop());
                            }
                            dispatch(
                                resetImageURLS({ source: CREATE_VISITATION })
                            );
                            dispatch(resetVisitationState());
                            dispatch(
                                openPopUp({
                                    popUpType: "success",
                                    popUpText:
                                        "Penambahan Jadwal Kunjungan\nBerhasil",
                                    highlightedText: "Jadwal Kunjungan",
                                    outsideClickClosePopUp: true
                                })
                            );
                            return;
                        }
                    } else {
                        if (
                            uploadedFilesResponse &&
                            uploadedFilesResponse?.length > 0
                        )
                            payload.files = uploadedFilesResponse;
                        const payloadData: {
                            payload: payloadPostType;
                            visitationId?: string;
                        } = {
                            payload
                        };

                        if (payload?.visitation?.id) {
                            payloadData.visitationId = payload?.visitation?.id;
                        }

                        if (methodStr === "POST") {
                            response = await postVisitations(payloadData).catch(
                                (err) => Error(err)
                            );
                        } else {
                            response = await putVisitation(
                                payloadData,
                                payloadData?.visitationId
                            ).catch((err) => Error(err));
                        }

                        if (
                            response?.data?.success &&
                            response?.data?.success !== false
                        ) {
                            if (type === "SPH") {
                                dispatch(resetSPHState());
                                navigation.dispatch(
                                    StackActions.replace(SPH, {
                                        projectId:
                                            response?.data?.data?.projectId
                                    })
                                );
                            } else if (navigation.canGoBack()) {
                                navigation.dispatch(StackActions.popToTop());
                            }
                            dispatch(
                                resetImageURLS({ source: CREATE_VISITATION })
                            );
                            dispatch(resetVisitationState());
                            dispatch(
                                openPopUp({
                                    popUpType: "success",
                                    popUpText:
                                        "Penambahan Jadwal Kunjungan\nBerhasil",
                                    highlightedText: "Jadwal Kunjungan",
                                    outsideClickClosePopUp: true
                                })
                            );
                            return;
                        }
                    }
                    dispatch(
                        openPopUp({
                            popUpType: "error",
                            popUpText:
                                response?.data?.message ||
                                "Error membuat jadwal kunjungan",
                            highlightedText: "error",
                            outsideClickClosePopUp: true
                        })
                    );
                    clicked = "0";
                }
            }, 500);
        } catch (error) {
            const message = error?.message || "Error membuat jadwal kunjungan";
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: message,
                    highlightedText: "error",
                    outsideClickClosePopUp: true
                })
            );
            clicked = "0";
        }
    };

    return (
        <>
            <PopUpQuestion
                isVisible={isPopUpVisible}
                setIsPopupVisible={setIsPopUpVisible}
                actionButton={() => {
                    setIsPopUpVisible((curr) => !curr);
                    navigation.dispatch(
                        StackActions.push(CAMERA, {
                            photoTitle: "Kunjungan",
                            closeButton: true,
                            navigateTo: GALLERY_VISITATION
                        })
                    );
                }}
            />
            <LastStepPopUp
                isVisible={isLastStepVisible}
                setIsPopUpVisible={setIsLastStepVisible}
                selectedDate={
                    visitationData?.selectedDate
                        ? `${visitationData?.selectedDate?.day}, ${visitationData?.selectedDate?.prettyDate}`
                        : ""
                }
                closedLostValueOnChange={{
                    dropdownOnchange: onChange("kategoriAlasan"),
                    dropdownValue: visitationData?.kategoriAlasan,
                    areaOnChange: onChange("alasanPenolakan"),
                    areaValue: visitationData?.alasanPenolakan
                }}
                onPressSubmit={clicked === "0" ? onPressSubmit : undefined}
                isLoading={isPostVisitationLoading || isUploadLoading}
            />
            <BGallery
                picts={visitationData?.images}
                addMorePict={() =>
                    navigation.dispatch(
                        StackActions.push(CAMERA, {
                            photoTitle: "Kunjungan",
                            closeButton: true,
                            navigateTo: GALLERY_VISITATION
                        })
                    )
                }
                removePict={removeImage}
            />
        </>
    );
}

export default Fifth;
