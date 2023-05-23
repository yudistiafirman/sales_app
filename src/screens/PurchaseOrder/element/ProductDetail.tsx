import bStorage from "@/actions";
import { BForm } from "@/components";
import BChoosenProductList from "@/components/templates/BChoosenProductList";
import { Input } from "@/interfaces";
import { PO } from "@/navigation/ScreenNames";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch, RootState } from "@/redux/store";
import formatCurrency from "@/utils/formatCurrency";
import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type ModalType = "loading" | "success" | "error";
type ModalText = string;

function ProductDetail() {
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();

    const {
        choosenSphDataFromModal,
        selectedProducts,
        isLoadingPostPurchaseOrder,
        checked,
        fiveToSix,
        lessThanFive,
        customerType
    } = poState.currentState.context;
    const isPostingPurchaseOrder =
        poState.currentState.matches("PostPurchaseOrder");
    const successPostPurchaseOrder = poState.currentState.matches(
        "PostPurchaseOrder.successCreatedPo"
    );
    const failPostPurchaseOrder = poState.currentState.matches(
        "PostPurchaseOrder.failCreatedPo"
    );
    const featureName = customerType === "INDIVIDU" ? "SO" : "PO";
    const getGlobalModalType = useCallback((): [ModalType, ModalText] => {
        let modalType = "" as ModalType;
        let modalText = "";
        if (isLoadingPostPurchaseOrder) {
            modalType = "loading";
            modalText = `Menyimpan ${featureName} `;
        } else if (successPostPurchaseOrder) {
            modalType = "success";
            modalText = `${featureName} Berhasil Dibuat`;
        } else {
            modalType = "error";
            modalText = `${featureName} Gagal Dibuat`;
        }
        return [modalType, modalText];
    }, [isLoadingPostPurchaseOrder, successPostPurchaseOrder]);

    const calculatedTotalPrice = (): number => {
        const total = selectedProducts
            .map((v) =>
                v.quantity.toString()[0] === "0" || v.quantity.length === 0
                    ? 0
                    : v.offeringPrice * v.quantity
            )
            .reduce((a, b) => a + b, 0);
        return total;
    };

    const [modalType, modalText] = getGlobalModalType();

    const handleReturnToInitialState = useCallback(() => {
        bStorage.deleteItem(PO);
        dispatch(closePopUp());
        if (navigation.canGoBack()) {
            navigation.dispatch(StackActions.popToTop());
        }

        dispatch({ type: "backToInitialState" });
    }, [dispatch, navigation]);

    const comboRadioBtnInput: Input[] = [
        {
            type: "comboRadioButton",
            isRequire: false,
            label: "Biaya Mobilisasi Spesial",
            comboRadioBtn: {
                firstText: "Ya",
                secondText: "Tidak",
                firstValue: "first",
                secondValue: "second",
                firstStatus: checked === "first" ? "checked" : "unchecked",
                secondStatus: checked === "second" ? "checked" : "unchecked",
                onSetComboRadioButtonValue: (value: string) =>
                    dispatch({
                        type: "switchingMobilizationValue",
                        value
                    }),
                firstChildren: checked === "first" && (
                    <BForm
                        titleBold="500"
                        inputs={[
                            {
                                type: "tableInput",
                                isRequire: false,
                                tableInput: {
                                    firstColumnLabel: "Volume",
                                    secondColumnLabel:
                                        "Harga Mobilisasi Spesial",
                                    onChangeValue: (value, index) =>
                                        dispatch({
                                            type: "onChangeMobilizationPrice",
                                            value,
                                            index
                                        }),
                                    tableInputListItem: [
                                        {
                                            firstColumnRangeTitle: "5-6",
                                            tableInputPlaceholder: "0",
                                            secondColumnUnitInput: "rit",
                                            tableInputKeyboardType: "numeric",
                                            tableInputValue:
                                                fiveToSix[0] !== "0" &&
                                                fiveToSix.length > 0
                                                    ? formatCurrency(fiveToSix)
                                                    : ""
                                        },
                                        {
                                            firstColumnRangeTitle: "<5",
                                            tableInputPlaceholder: "0",
                                            secondColumnUnitInput: "rit",
                                            tableInputKeyboardType: "numeric",
                                            tableInputValue:
                                                lessThanFive[0] !== "0" &&
                                                lessThanFive.length > 0
                                                    ? formatCurrency(
                                                          lessThanFive
                                                      )
                                                    : ""
                                        }
                                    ]
                                }
                            }
                        ]}
                    />
                )
            }
        }
    ];

    useEffect(() => {
        if (isPostingPurchaseOrder) {
            dispatch(
                openPopUp({
                    popUpType: modalType,
                    popUpText: modalText,
                    isRenderActions:
                        failPostPurchaseOrder && !isLoadingPostPurchaseOrder,
                    outsideClickClosePopUp: successPostPurchaseOrder,
                    outlineBtnTitle: "Kembali",
                    primaryBtnTitle: "Coba Lagi",
                    isPrimaryButtonLoading: isLoadingPostPurchaseOrder,
                    primaryBtnAction: () =>
                        dispatch({ type: "retryPostPurchaseOrder" }),
                    outlineBtnAction: handleReturnToInitialState
                })
            );

            if (successPostPurchaseOrder) {
                bStorage.deleteItem(PO);
                if (navigation.canGoBack()) {
                    navigation.dispatch(StackActions.popToTop());
                }
                dispatch({ type: "backToInitialState" });
            }
        } else {
            dispatch(closePopUp());
        }
    }, [
        dispatch,
        failPostPurchaseOrder,
        getGlobalModalType,
        handleReturnToInitialState,
        isLoadingPostPurchaseOrder,
        isPostingPurchaseOrder,
        modalText,
        modalType,
        navigation,
        poState.currentState,
        successPostPurchaseOrder
    ]);

    return (
        <BChoosenProductList
            data={choosenSphDataFromModal?.QuotationRequests[0]?.products}
            onChecked={(data) =>
                dispatch({ type: "selectProduct", value: data })
            }
            selectedProducts={selectedProducts}
            hasMultipleCheck
            comboRadioBtnInput={comboRadioBtnInput}
            calculatedTotalPrice={calculatedTotalPrice()}
            onChangeQuantity={(index: number, value: string) =>
                dispatch({ type: "onChangeQuantity", index, value })
            }
        />
    );
}

export default ProductDetail;
