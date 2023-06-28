import {
    StyleProp,
    ViewStyle,
    TextStyle,
    KeyboardType,
    KeyboardTypeOptions,
    NativeSyntheticEvent
} from "react-native";

import * as React from "react";
import { Details } from "react-native-maps";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

interface Input {
    label?: string;
    isRequire: boolean;
    type:
        | "quantity"
        | "price"
        | "textInput"
        | "cardOption"
        | "comboDropdown"
        | "area"
        | "dropdown"
        | "PIC"
        | "autocomplete"
        | "checkbox"
        | "switch"
        | "fileInput"
        | "map"
        | "autocomplete"
        | "calendar"
        | "calendar-time"
        | "calendar-range"
        | "comboRadioButton"
        | "tableInput"
        | "durationButton";
    hidePicLabel?: boolean;
    onChange?: (e: any) => void;
    onFocus?: (e: any) => void;
    value?: string | any;
    placeholder?: string;
    loading?: boolean;
    isError?: boolean;
    customerErrorMsg?: string;
    disabledFileInput?: boolean;
    LeftIcon?: () => JSX.Element;
    keyboardType?: KeyboardType | KeyboardTypeOptions;
    itemSet?: ItemSet[];
    showChevronAutoCompleted?: boolean;
    showClearAutoCompleted?: boolean;
    textSize?: number;
    quantityType?: string;
    options?: Array<{
        title: string;
        value: string | any;
        onChange: () => void;
        icon?: string;
    }>;
    calendar?: {
        markedDates?: MarkedDates;
        onDayPress: (day: any) => void;
        isCalendarVisible: boolean;
        setCalendarVisible: (flag: boolean) => void;
    };
    calendarTime?: {
        onDayPress: (day: DateData) => void;
        onTimeChange: (time: any) => void;
        isCalendarVisible: boolean;
        isTimeVisible: boolean;
        setCalendarVisible: (flag: boolean) => void;
        setTimeVisible: (flag: boolean) => void;
        labelOne: string;
        labelTwo: string;
        errMsgOne?: string;
        errMsgTwo?: string;
        placeholderOne?: string;
        placeholderTwo?: string;
        valueOne: string;
        valueTwo: string;
        valueTwoMock: Date;
        isErrorOne?: boolean;
        isErrorTwo?: boolean;
    };
    durationButton?: {
        data: IDurationButton[];
        onClick: (value: string | number) => void;
        value: string | number;
    };
    dropdown?: {
        items: {
            label: string;
            value: string | number | any;
        }[];
        onChange:
            | ((value: any) => void)
            | ((value: any[] | null) => void)
            | undefined;
        placeholder: string;
    };
    comboDropdown?: {
        itemsOne: {
            label: string;
            value: string | number | any;
        }[];
        itemsTwo: {
            label: string;
            value: string | number | any;
        }[];
        onChangeOne:
            | ((value: any) => void)
            | ((value: any[] | null) => void)
            | undefined;
        onChangeTwo:
            | ((value: any) => void)
            | ((value: any[] | null) => void)
            | undefined;
        placeholderOne: string;
        placeholderTwo: string;
        isErrorOne?: boolean;
        isErrorTwo?: boolean;
        errorMessageOne?: string;
        errorMessageTwo?: string;
        valueOne?: any;
        valueTwo?: any;
    };
    checkbox?: {
        disabled?: boolean;
        value: any;
        onValueChange: (value: any) => void;
    };
    onSelect?: (index: TAutocompleteDropdownItem) => void; // eg for pic radio
    selectedItems?: { id: null | string; title: string };
    onPressSelected?: () => void;
    isInputDisable?: boolean;
    disableColor?: string;
    onClear?: () => void;
    labelStyle?: ViewStyle;
    textInputAsButton?: boolean;
    textInputAsButtonOnPress?: () => void;
    outlineColor?: string;
    comboRadioBtn?: IComboRadioBtn;
    tableInput?: ITableInput;
    textInputStyle?: TextStyle;
}

interface ItemSet {
    id: string;
    title: string;
    subtitle?: string;
    chipTitle?: string;
    chipBgColor?: string;
}

interface IDurationButton {
    id: string;
    name: string;
    value: string | number;
}

interface IComboRadioBtn {
    firstValue?: string;
    firstText?: string;
    firstStatus?: "checked" | "unchecked";
    secondValue?: string;
    secondText?: string;
    secondStatus?: "checked" | "unchecked";
    firstChildren?: React.ReactNode;
    secondChildren?: React.ReactNode;
    isHorizontal?: boolean;
    onSetComboRadioButtonValue?: (value: string) => void;
}

interface ITableInputListItem {
    firstColumnRangeTitle?: string;
    firstColumnUnit?: string;
    secondColumnNominalInput?: string;
    secondColumnUnitInput?: string;
    tableInputValue?: string;
    tableInputPlaceholder?: string;
    tableInputKeyboardType?: KeyboardTypeOptions;
}

interface ITableInputItem {
    item?: ITableInputListItem;
    index?: number;
}

interface ITableInput {
    textSize?: number;
    firstColumnLabel?: string;
    secondColumnLabel?: string;
    onChangeValue?: (value: string, index: number) => void;
    tableInputListItem?: ITableInputListItem[];
}

interface TitleBold {
    titleBold?:
        | "bold"
        | "400"
        | "normal"
        | "100"
        | "200"
        | "300"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
}

interface Styles {
    [key: string]: StyleProp<ViewStyle | TextStyle>;
}

interface Address {
    lat?: any;
    id?: string;
    formattedAddress?: string;
    lan?: number;
    lon?: number;
    line1?: string;
    name?: string;
    longitude?: number;
    latitude?: number;
    postalId?: number;
    line2?: string;
    latitudeDelta?: number;
    longitudeDelta?: number;
    city?: string;
    district?: string;
    rural?: string;
}

// create visitation
interface CreateVisitationFirstStep {
    createdLocation: Address;
    locationAddress: Address;
    existingLocationId?: string;
}
interface CreateVisitationSecondStep {
    companyName: string;
    customerType?: "INDIVIDU" | "COMPANY";
    projectName: string;
    projectId?: string;
    location: { [key: string]: any };
    pics: PIC[];
    options: {
        loading: boolean;
        items: { title: string; id: string }[] | null;
    };
    visitationId?: string;
    existingOrderNum?: number;
}
interface CreateVisitationThirdStep {
    stageProject?: "LAND_PREP" | "FOUNDATION" | "FORMWORK" | "FINISHING";
    products: any[];
    estimationDate: {
        estimationWeek: number | null;
        estimationMonth: number | null;
    };
    paymentType?: "CBD" | "CREDIT";
    notes: string;
}

interface CreateVisitationFifthStep {
    selectedDate: any;
    images: any[];
    kategoriAlasan?: "FINISHED" | "MOU_COMPETITOR";
    alasanPenolakan: string;
}

interface Competitor {
    name: string;
    mou: string;
    exclusive: string;
    problem: string;
    hope: string;
}

interface PIC {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    position?: string;
    isSelected?: boolean;
    type?: string;
}

interface NavigationProps {
    navigate: (screen?: string) => void;
}

interface LatLang {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
    formattedAddress?: string;
    name?: string;
    PostalId?: any;
    line1?: string;
    distance?: {
        text?: string;
        value?: number;
    };
}

interface Region {
    longitude(
        arg0: string,
        longitude: any,
        latitude: any,
        arg3: string
    ): { result: any } | PromiseLike<{ result: any }>;
    latitude(
        arg0: string,
        longitude: any,
        latitude: any,
        arg3: string
    ): { result: any } | PromiseLike<{ result: any }>;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface BLocationProps {
    mapStyle?: ViewStyle | undefined;
    region?: Region & LatLang;
    onRegionChangeComplete?:
        | ((region: Region & LatLang, details: Details) => void)
        | undefined;
    onRegionChange?:
        | ((region: Region & LatLang, details: Details) => void)
        | undefined;
    onMapReady?:
        | ((
              event?: NativeSyntheticEvent<Record<string, never>> | undefined
          ) => void)
        | undefined;
    CustomMarker?: React.ReactNode | undefined;
    isUninteractable?: boolean;
    formattedAddress?: string;
}

interface SelectedCompanyInterface {
    id: string;
    name: string;
    Company:
        | {
              id: string | null;
              name: string | null;
              title?: string;
          }
        | {
              id: string | null;
              title?: string;
          };
    Pics: PIC[];
    Visitation: {
        finishDate: string | null;
        id: string;
        order: number;
        visitation_id: string | null;
    };
    locationAddress: {
        city?: string;
        district?: string;
        line1?: string;
        line2?: string;
        postalCode?: number;
        rural?: string;
        lat?: number;
        lon?: number;
        id?: string;
        formattedAddress?: string;
    };
    Pic: PIC;
}

interface ChosenProductType {
    product: ProductDataInterface;
    productId: string;
    categoryId: string;
    sellPrice: string;
    volume: string;
    totalPrice: number;
    pouringMethod: string;
    additionalData: {
        distance: {
            id: string;
            price: number;
        };
        delivery: {
            id: string;
            price: number;
        };
    };
}

type SelectedPicType = {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    position?: string;
    isSelected?: boolean;
} | null;

type BillingAddressType = {
    name: string;
    phone: string | number;
    addressAutoComplete: { [key: string]: any };
    fullAddress: string;
};

interface SphStateInterface {
    selectedCompany: SelectedCompanyInterface | null;
    projectAddress: Address | null;
    selectedPic: SelectedPicType;
    isBillingAddressSame: boolean;
    billingAddress: BillingAddressType;
    distanceFromLegok: number | null;
    paymentType: "CBD" | "CREDIT" | "";
    paymentRequiredDocuments: { [key: string]: any };
    paymentDocumentsFullfilled: boolean;
    paymentBankGuarantee: boolean;
    chosenProducts: ChosenProductType[];
    useHighway: boolean;
    uploadedAndMappedRequiredDocs: RequiredDocType[];
    stepSPHOneFinished: boolean;
    stepSPHTwoFinished: boolean;
    stepSPHThreeFinished: boolean;
    stepSPHFourFinished: boolean;
    stepperSPHShouldNotFocused: boolean;
    useSearchAddress: boolean;
    searchedAddress: string;
    searchedBillingAddress: string;
    useSearchedBillingAddress: boolean;
    alreadyCalledProjectOnce: boolean;
}

type SphContextInterface = [
    SphStateInterface,
    (key: keyof SphStateInterface) => (data: any) => void,
    (index: number) => void,
    number
];

interface AdditionalPricesInterface {
    id: string;
    categoryId: string;
    createdById?: string;
    unit: string;
    price: number;
    type: string;
    min: number;
    max: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductParentInterface {
    id: string;
    name: string;
    AdditionalPrices: AdditionalPricesInterface[];
}

interface ProductDataInterface {
    id: string;
    name: string;
    displayName: string;
    Price: {
        id: string;
        price: number;
    };
    properties: {
        fc: string;
        fs: string;
        sc: string;
        slump: number;
    };
    Category: {
        id: string;
        name: string;
        parent_id: string;
        Parent: ProductParentInterface;
    };
    calcPrice: number;
}

interface VisitationListResponse {
    id: string;
    visitationId: string | null;
    order: number;
    dateVisit: string;
    finishDate: string | null;
    isBooking: boolean;
    paymentType: string;
    status: "VISIT" | "SPH" | "PO" | "SCHEDULING" | "DO" | "REJECTED";
    address: {
        id: string;
    };
    project: {
        id: string;
        name: string;
        stage: "LAND_PREP" | "FOUNDATION" | "FORMWORK" | "FINISHING";
        type:
            | "INFRASTRUKTUR"
            | "HIGH-RISE"
            | "RUMAH"
            | "KOMERSIAL"
            | "INDUSTRIAL";
        Pics: PIC[];
        Pic: RequiredPic;
        mainPic: PIC & { type?: string };
        company: {
            id: string;
            name: string;
            displayName: string;
        };
        locationAddress: {
            id: string;
            line1?: string;
            line2?: string;
            rural?: string;
            district?: string;
            postalCode?: number;
            city?: string;
            lat?: string;
            lon?: string;
        };
        quotationLetterId?: null | string;
        Competitors: Competitor[];
    };
    visitNotes: string | null;
    estimationWeek: number;
    estimationMonth: number;
    products: any[];
}

interface CustomerDataInterface {
    display_name: string;
    type: string;
    name: string;
    email: string | null;
    phone: string;
    position: string;
    picName?: string;
    location?: string;
}

interface LocationPayloadType {
    formattedAddress?: string;
    postalId?: number;
    lon?: number;
    lat?: number;
    line1?: string;
    line2?: string;
}

interface VisitationPayload {
    id?: string;
    visitationId?: string;
    order: number;
    location: LocationPayloadType;
    customerType?: "INDIVIDU" | "COMPANY";
    paymentType?: "CBD" | "CREDIT";
    estimationWeek?: number;
    estimationMonth?: number;
    visitNotes?: string;
    dateVisit?: number;
    finishDate?: number; // ??
    bookingDate?: number;
    rejectNotes?: string;
    rejectCategory?: "FINISHED" | "MOU_COMPETITOR";
    isBooking?: boolean; // ??
    status?: "VISIT" | "SPH" | "REJECTED" | "";
    files: FilesType[];
    products?: {
        id?: string;
    }[];
    competitors?: Competitor[];
}

interface FilesType {
    id: string;
    type: "GALLERY" | "COVER";
}

interface PicFormInitialState {
    name: string;
    errorName: string;
    position: string;
    errorPosition: string;
    phone: string;
    errorPhone: string;
    email: string;
    errorEmail: string;
}

interface ProjectPayloadType {
    id?: string;
    locationAddressId?: string;
    name?: string;
    companyDisplayName?: string;
    location: LocationPayloadType;
    stage?: "LAND_PREP" | "FOUNDATION" | "FORMWORK" | "FINISHING";
    type?: "INFRASTRUKTUR" | "HIGH-RISE" | "RUMAH" | "KOMERSIAL" | "INDUSTRIAL";
}

interface PicPayloadType {
    name?: string;
    position?: string;
    phone?: string;
    email?: string;
    type?: "PROJECT" | "RECIPIENT" | "SUPPLIER";
    isSelected?: boolean;
}
interface RequiredPic {
    id: string;
    name: string;
    position: string;
    phone: string;
    email: string;
    type: "PROJECT" | "RECIPIENT" | "SUPPLIER";
    isSelected: boolean;
}

interface PayloadPostType {
    visitation: VisitationPayload;
    project: ProjectPayloadType;
    pic: PicPayloadType[];
    files: FilesType[];
    batchingPlantId?: string;
}

type VisitationDataType = {
    id?: number;
    name: string;
    location?: string;
    locationID?: string;
    time?: string;
    status?: string;
    rightStatus?: string;
    unit?: string;
    pilNames?: string[];
    pilStatus?: string;
    picOrCompanyName?: string;
    lonlat?: { longitude: string | null; latitude: string | null };
};

interface ProjectResponseType {
    id: string;
    name: string;
    display_name: string;
    line1: string;
    rural: string;
    district: string;
    postal_code: number;
    city: string;
    projects: {
        id: string;
        name: string;
    }[];
    project_count: string;
}

interface ShippingAddressType {
    id: string;
    lat: string;
    lon: string;
    line1: string;
    line2: string;
    rural: string | null;
    district: string | null;
    postalCode: string | number | null;
    city: string | null;
}

interface RequestedProductsType {
    productId: string;
    categoryId: string;
    offeringPrice: number;
    pouringMethod: string;
    quantity: number;
    productName: string;
    productUnit: string;
}
interface DeliveryAndDistance {
    id: string;
    categoryId?: string;
    createdById?: string | null;
    unit?: string;
    price: number;
    type?: string;
    min?: number;
    max?: number;
    createdAt?: string;
    updatedAt?: string;
    category_id?: string;
    userDistance?: string | number;
}
interface SphOrderPayloadType {
    projectId: string;
    // picId: string;
    picArr: PIC[];
    isUseSameAddress: boolean;
    billingRecipientName: string;
    billingRecipientPhone: string;
    paymentType: "CBD" | "CREDIT";
    viaTol: boolean;
    projectDocs: any[];
    batchingPlantId?: string;
    isProvideBankGuarantee: boolean;
    shippingAddress: ShippingAddressType;
    requestedProducts: RequestedProductsType[];
    delivery: DeliveryAndDistance;
    distance: DeliveryAndDistance;
    billingAddress: {
        postalId: string;
        line1: string;
        line2: string;
    };
}

type RequiredDocType = {
    documentId: string;
    fileId: string;
};

type Docs = {
    docId?: string;
    docName?: string;
    paymentType?: string;
    isRequired?: boolean;
    type?: string;
    fileName?: string;
    url?: string;
};

interface PdfDataType {
    type: string;
    name: string;
    url: string;
    pdfType: string;
}

interface PostSphResponseType {
    number: string;
    createdTime: string;
    expiryTime: string;
    thermalLink: string;
    letterLink: string;
    letter: PdfDataType[];
    pos: PdfDataType[];
}

interface ProjectDetail {
    id: string;
    projectId?: string;
    projectName?: string;
    availableDeposit?: string;
    locationAddress?: Address;
    BillingAddress?: Address;
    ShippingAddress?: Address;
    name?: string;
    companyName?: string;
    displayName?: string;
    Pic: PIC;
    pics: PIC[];
    ProjectDocs: Docs[];
    Customer: any;
    Account: any;
}

export type {
    Input,
    Styles,
    CreateVisitationFirstStep,
    CreateVisitationSecondStep,
    CreateVisitationThirdStep,
    PIC,
    Competitor,
    NavigationProps,
    BLocationProps,
    Region,
    SphStateInterface,
    SphContextInterface,
    AdditionalPricesInterface,
    ProductParentInterface as productParentInterface,
    ProductDataInterface,
    CreateVisitationFifthStep,
    VisitationListResponse as visitationListResponse,
    CustomerDataInterface as customerDataInterface,
    LocationPayloadType as locationPayloadType,
    VisitationPayload as visitationPayload,
    ProjectPayloadType as projectPayloadType,
    PicPayloadType as picPayloadType,
    PayloadPostType as payloadPostType,
    VisitationDataType as visitationDataType,
    ProjectResponseType as projectResponseType,
    SelectedCompanyInterface as selectedCompanyInterface,
    SphOrderPayloadType as sphOrderPayloadType,
    PicFormInitialState,
    ShippingAddressType as shippingAddressType,
    RequestedProductsType as requestedProductsType,
    DeliveryAndDistance as deliveryAndDistance,
    Address,
    RequiredDocType as requiredDocType,
    PostSphResponseType as postSphResponseType,
    Docs,
    ProjectDetail,
    RequiredPic as requiredPic,
    SelectedPicType as selectedPicType,
    BillingAddressType as billingAddressType,
    ChosenProductType as chosenProductType,
    TitleBold,
    IComboRadioBtn,
    ITableInput,
    ITableInputItem,
    ITableInputListItem,
    IDurationButton,
    ItemSet
};
