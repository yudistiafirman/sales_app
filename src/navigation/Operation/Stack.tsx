import * as React from "react";
import CameraScreen from "@/screens/Camera";
import Preview from "@/screens/Camera/Preview";
import Location from "@/screens/Location";
import CreateDO from "@/screens/Operation/CreateDO";
import SubmitForm from "@/screens/Operation/SubmitForm";
import { BSelectedBPBadges } from "@/components";
import {
    CAMERA,
    CAMERA_TITLE,
    IMAGE_PREVIEW,
    IMAGE_PREVIEW_TITLE,
    CREATE_DO,
    SCHEDULE_TITLE,
    SUBMIT_FORM,
    SUBMIT_FORM_TITLE,
    LOCATION,
    LOCATION_TITLE
} from "../ScreenNames";

function OperationStack(Stack: any) {
    const selectedBPBadges = (bpName: string, title: string) => (
        <BSelectedBPBadges bpName={bpName} title={title} />
    );

    return (
        <>
            <Stack.Screen
                name={CAMERA}
                key={CAMERA}
                component={CameraScreen}
                options={{
                    headerTitle: () =>
                        selectedBPBadges("BP-LEGOK", CAMERA_TITLE)
                }}
            />
            <Stack.Screen
                name={IMAGE_PREVIEW}
                key={IMAGE_PREVIEW}
                component={Preview}
                options={{
                    headerTitle: () =>
                        selectedBPBadges("BP-LEGOK", IMAGE_PREVIEW_TITLE)
                }}
            />
            <Stack.Screen
                name={CREATE_DO}
                key={CREATE_DO}
                component={CreateDO}
                options={{
                    headerTitle: () =>
                        selectedBPBadges("BP-LEGOK", SCHEDULE_TITLE)
                }}
            />
            <Stack.Screen
                name={SUBMIT_FORM}
                key={SUBMIT_FORM}
                component={SubmitForm}
                options={{
                    headerTitle: () =>
                        selectedBPBadges("BP-LEGOK", SUBMIT_FORM_TITLE)
                }}
            />
            <Stack.Screen
                name={LOCATION}
                key={LOCATION}
                component={Location}
                options={{
                    headerTitle: () =>
                        selectedBPBadges("BP-LEGOK", LOCATION_TITLE)
                }}
            />
        </>
    );
}

export default OperationStack;
