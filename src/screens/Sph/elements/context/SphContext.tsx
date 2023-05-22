import React, { useState } from "react";
import { SphContextInterface, SphStateInterface } from "@/interfaces";

const initialState: SphStateInterface = {
    selectedCompany: null,
    selectedPic: null,
    projectAddress: null,
    isBillingAddressSame: false,
    billingAddress: {
        name: "",
        phone: "",
        addressAutoComplete: {},
        fullAddress: ""
    },
    distanceFromLegok: null,
    paymentType: "",
    paymentRequiredDocuments: {},
    paymentDocumentsFullfilled: false,
    paymentBankGuarantee: false,
    chosenProducts: [],
    useHighway: false,
    uploadedAndMappedRequiredDocs: []
};
function initialFunction(key: keyof SphStateInterface) {
    return (data: any) => {
        console.log(key, data);
    };
}

export const SphContext = React.createContext<SphContextInterface>([
    initialState,
    initialFunction,
    (index) => {
        console.log(index);
    },
    0
]);

export function SphProvider({ children }: { children: React.ReactNode }) {
    const [sphData, setSphData] = useState<SphStateInterface>(initialState);
    const [currentPosition, setCurrentPosition] = useState<number>(0);

    const stateUpdate = (key: keyof SphStateInterface) => (e: any) => {
        setSphData((current) => ({
            ...current,
            [key]: e
        }));
    };

    return (
        <SphContext.Provider
            value={
                [
                    sphData,
                    stateUpdate,
                    setCurrentPosition,
                    currentPosition
                ] as SphContextInterface
            }
        >
            {children}
        </SphContext.Provider>
    );
}
