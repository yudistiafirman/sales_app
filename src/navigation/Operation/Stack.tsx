import * as React from "react";
import CameraScreen from "@/screens/Camera";
import Preview from "@/screens/Camera/Preview";
import Location from "@/screens/Location";
import SubmitForm from "@/screens/Operation/SubmitForm";
import { BSelectedBPBadges } from "@/components";
import {
    CAMERA,
    CAMERA_TITLE,
    IMAGE_PREVIEW,
    IMAGE_PREVIEW_TITLE,
    SUBMIT_FORM,
    SUBMIT_FORM_TITLE,
    LOCATION,
    LOCATION_TITLE
} from "../ScreenNames";

const selectedBPBadges = (bpName: string, title: string) => (
    <BSelectedBPBadges bpName={bpName} title={title} />
);

function OperationStack(selectedBP: string, Stack: any) {
    return (
        <>
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
                name={SUBMIT_FORM}
                key={SUBMIT_FORM}
                component={SubmitForm}
                options={{
                    headerTitle: () =>
                        selectedBPBadges(selectedBP, SUBMIT_FORM_TITLE)
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
        </>
    );
}

export default OperationStack;
