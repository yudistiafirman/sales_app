interface LocalFileType {
    file: {
        uri: string;
        type: string;
        name: string;
        longlat: string;
        datetime: string;
    };
    isFromPicker: boolean;
    isVideo: boolean;
    type?: "COVER" | "GALLERY";
    attachType?: string;
}

export default LocalFileType;
