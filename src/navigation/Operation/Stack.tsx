import * as React from "react";
import CameraScreen from "@/screens/Camera";
import Preview from "@/screens/Camera/Preview";
import Location from "@/screens/Location";
import CreateDO from "@/screens/Operation/CreateDO";
import SubmitForm from "@/screens/Operation/SubmitForm";
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
    return (
        <>
            <Stack.Screen
                name={CAMERA}
                key={CAMERA}
                component={CameraScreen}
                options={{
                    headerTitle: CAMERA_TITLE
                }}
            />
            <Stack.Screen
                name={IMAGE_PREVIEW}
                key={IMAGE_PREVIEW}
                component={Preview}
                options={{
                    headerTitle: IMAGE_PREVIEW_TITLE
                }}
            />
            <Stack.Screen
                name={CREATE_DO}
                key={CREATE_DO}
                component={CreateDO}
                options={{
                    headerTitle: SCHEDULE_TITLE
                }}
            />
            <Stack.Screen
                name={SUBMIT_FORM}
                key={SUBMIT_FORM}
                component={SubmitForm}
                options={{
                    headerTitle: SUBMIT_FORM_TITLE
                }}
            />
            <Stack.Screen
                name={LOCATION}
                key={LOCATION}
                component={Location}
                options={{
                    headerTitle: LOCATION_TITLE
                }}
            />
        </>
    );
}

export default OperationStack;
