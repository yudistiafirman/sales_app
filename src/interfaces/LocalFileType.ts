interface LocalFileType {
  file: {
    uri: string;
    type: string;
    name: string;
    longlat: string;
    datetime: string;
  };
  isFromPicker: boolean;
  type?: 'COVER' | 'GALLERY';
  attachType?: string;
}

export type { LocalFileType };
