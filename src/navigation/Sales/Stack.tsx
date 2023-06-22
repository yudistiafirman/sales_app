import Preview from "@/screens/Camera/Preview";
import CameraScreen from "@/screens/Camera";
import CalendarScreen from "@/screens/Calendar";
import * as React from "react";
import SearchAreaProject from "@/screens/SearchAreaProject";
import Location from "@/screens/Location";
import SearchProduct from "@/screens/SearchProduct";
import Sph from "@/screens/Sph";
import CreateVisitation from "@/screens/Visitation/CreateVisitation";
import TransactionDetail from "@/screens/Transaction/Detail";
import ProjectDetailPage from "@/screens/ProjectDetail";
import PurchaseOrderWithProvider from "@/screens/PurchaseOrder";
import CreateScheduleScreen from "@/screens/CreateSchedule";
import PriceList from "@/screens/Price";
import RequiredDocuments from "@/screens/RequiredDocuments";
import VisitHistory from "@/screens/VisitHistory";
import Deposit from "@/screens/Deposit";
import SearchSO from "@/screens/SearchSO";
import FormSO from "@/screens/SearchSO/Form/FormSO";
import Document from "@/screens/Customer/Document";
import InvoiceFilter from "@/screens/Invoice/Filter";
import InvoiceList from "@/screens/Invoice/InvoiceList";
import InvoiceDetail from "@/screens/Invoice/InvoiceDetail";
import CustomerDetail from "@/screens/Customer/Detail";
import Appointment from "@/screens/Appointment";
import { BSelectedBPBadges } from "@/components";
import { BatchingPlant } from "@/models/BatchingPlant";
import {
    ALL_PRODUCT,
    ALL_PRODUCT_TITLE,
    APPOINTMENT,
    APPOINTMENT_TITLE,
    CALENDAR,
    CALENDAR_TITLE,
    CAMERA,
    CAMERA_TITLE,
    CREATE_DEPOSIT,
    CREATE_DEPOSIT_TITLE,
    CREATE_SCHEDULE,
    CREATE_SCHEDULE_TITLE,
    CREATE_VISITATION,
    CREATE_VISITATION_TITLE,
    CUSTOMER_DETAIL,
    PROJECT_DETAIL,
    CUSTOMER_DETAIL_TITLE,
    CUSTOMER_DOCUMENT,
    DOCUMENTS,
    DOCUMENTS_TITLE,
    FORM_SO,
    FORM_SO_TITLE,
    IMAGE_PREVIEW,
    IMAGE_PREVIEW_TITLE,
    LOCATION,
    LOCATION_TITLE,
    PO,
    SEARCH_AREA,
    SEARCH_AREA_TITLE,
    SEARCH_PRODUCT,
    SEARCH_PRODUCT_TITLE,
    SEARCH_SO,
    SEARCH_SO_TITLE,
    SPH,
    TRANSACTION_DETAIL,
    TRANSACTION_DETAIL_TITLE,
    VISIT_HISTORY,
    INVOICE_FILTER,
    INVOICE_LIST,
    INVOICE_LIST_TITLE,
    INVOICE_DETAIL,
    PROJECT_DETAIL_TITLE,
    SPH_TITLE
} from "../ScreenNames";

const selectedBPBadges = (
    selectedBP: BatchingPlant,
    title: string,
    alignLeft?: boolean
) => (
    <BSelectedBPBadges
        selectedBP={selectedBP}
        title={title}
        alignLeft={alignLeft !== undefined ? alignLeft : true}
    />
);

function SalesStack(selectedBP: BatchingPlant, Stack: any) {
    return (
        <>
            <Stack.Screen
                name={CREATE_VISITATION}
                key={CREATE_VISITATION}
                component={CreateVisitation}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, CREATE_VISITATION_TITLE)
                }}
            />
            <Stack.Screen
                name={SPH}
                key={SPH}
                component={Sph}
                options={{
                    headerTitle: () => selectedBPBadges(selectedBP, SPH_TITLE)
                }}
            />
            <Stack.Screen
                name={PO}
                key={PO}
                component={PurchaseOrderWithProvider}
                options={{
                    headerTitle: false
                }}
            />
            <Stack.Screen
                name={APPOINTMENT}
                key={APPOINTMENT}
                component={Appointment}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, APPOINTMENT_TITLE)
                }}
            />
            <Stack.Screen
                name={SEARCH_PRODUCT}
                key={SEARCH_PRODUCT}
                component={SearchProduct}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, SEARCH_PRODUCT_TITLE)
                }}
            />
            <Stack.Screen
                name={LOCATION}
                key={LOCATION}
                component={Location}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, LOCATION_TITLE)
                }}
            />
            <Stack.Screen
                name={SEARCH_AREA}
                key={SEARCH_AREA}
                component={SearchAreaProject}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, SEARCH_AREA_TITLE)
                }}
            />
            <Stack.Screen
                name={CALENDAR}
                key={CALENDAR}
                component={CalendarScreen}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, CALENDAR_TITLE)
                }}
            />
            <Stack.Screen
                name={CAMERA}
                key={CAMERA}
                component={CameraScreen}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, CAMERA_TITLE)
                }}
            />
            <Stack.Screen
                name={IMAGE_PREVIEW}
                key={IMAGE_PREVIEW}
                component={Preview}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, IMAGE_PREVIEW_TITLE)
                }}
            />
            <Stack.Screen
                name={TRANSACTION_DETAIL}
                key={TRANSACTION_DETAIL}
                component={TransactionDetail}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, TRANSACTION_DETAIL_TITLE)
                }}
            />
            <Stack.Screen
                name={PROJECT_DETAIL}
                key={PROJECT_DETAIL}
                component={ProjectDetailPage}
                options={{
                    headerTitleAlign: "center",
                    headerTitle: () =>
                        selectedBPBadges(
                            selectedBP,
                            PROJECT_DETAIL_TITLE,
                            false
                        )
                }}
            />
            <Stack.Screen
                name={CUSTOMER_DETAIL}
                key={CUSTOMER_DETAIL}
                component={CustomerDetail}
                options={{
                    headerTitle: CUSTOMER_DETAIL_TITLE,
                    headerTitleAlign: "center"
                }}
            />
            <Stack.Screen
                name={CUSTOMER_DOCUMENT}
                key={CUSTOMER_DOCUMENT}
                component={Document}
                options={{
                    headerTitle: DOCUMENTS_TITLE,
                    headerTitleAlign: "center"
                }}
            />
            <Stack.Screen
                name={ALL_PRODUCT}
                key={ALL_PRODUCT}
                component={PriceList}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, ALL_PRODUCT_TITLE)
                }}
            />
            <Stack.Screen
                name={CREATE_SCHEDULE}
                key={CREATE_SCHEDULE}
                component={CreateScheduleScreen}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, CREATE_SCHEDULE_TITLE)
                }}
            />
            <Stack.Screen
                name={DOCUMENTS}
                key={DOCUMENTS}
                component={RequiredDocuments}
                options={{
                    headerTitleAlign: "center",
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, DOCUMENTS_TITLE, false)
                }}
            />
            <Stack.Screen
                name={VISIT_HISTORY}
                key={VISIT_HISTORY}
                component={VisitHistory}
                options={{
                    headerTitle: false,
                    headerTitleAlign: "center"
                }}
            />
            <Stack.Screen
                name={CREATE_DEPOSIT}
                key={CREATE_DEPOSIT}
                component={Deposit}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, CREATE_DEPOSIT_TITLE)
                }}
            />
            <Stack.Screen
                name={SEARCH_SO}
                key={SEARCH_SO}
                component={SearchSO}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, SEARCH_SO_TITLE)
                }}
            />
            <Stack.Screen
                name={FORM_SO}
                key={FORM_SO}
                component={FormSO}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, FORM_SO_TITLE)
                }}
            />
            <Stack.Screen
                name={INVOICE_LIST}
                key={INVOICE_LIST}
                component={InvoiceList}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, INVOICE_LIST_TITLE)
                }}
            />
            <Stack.Screen
                name={INVOICE_DETAIL}
                key={INVOICE_DETAIL}
                component={InvoiceDetail}
                options={{
                    headerTitle: ""
                }}
            />
            <Stack.Screen
                name={INVOICE_FILTER}
                key={INVOICE_FILTER}
                component={InvoiceFilter}
                options={{
                    headerTitle: ""
                }}
            />
        </>
    );
}

export default SalesStack;
