interface LocalFileType {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  isFromPicker: boolean;
  type?: 'COVER' | 'GALLERY';
}

export type { LocalFileType };
