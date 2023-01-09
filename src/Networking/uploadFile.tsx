import BrikApi from '@/brikApi/BrikApi';
import axios from 'axios';

type DataProps = {
  fileUri: string;
  fileType: string;
  fileName: string;
  fileSize?: number;
};

let cancel = false;
const setCancel = (value: boolean) => {
  cancel = value;
};

const isCancel = () => {
  return cancel;
};

const CancelToken = axios.CancelToken;
let source = CancelToken.source();
export const uploadFile = async (
  token: string,
  data: DataProps,
  onUploadProgress: Function,
  onSuccess: Function,
  onError: Function,
  onCancelUpload?: Function
) => {
  const formdata = new FormData();
  source = CancelToken.source();
  setCancel(false);
  // $FlowFixMe
  formdata.append('file', {
    uri: data.fileUri,
    type: data.fileType,
    name: data.fileName,
  });

  return axios({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      token: token,
    },
    url: BrikApi.uploadFile(),
    data: formdata,
    responseType: 'json',
    cancelToken: source.token,
    onUploadProgress: (progressEvent) => {
      onUploadProgress(progressEvent);
    },
  })
    .then((response) => {
      const responseData = response.data;
      if (responseData.success) {
        if (onSuccess) onSuccess(responseData.data);
      } else {
        if (onError) onError(responseData.message);
      }
    })
    .catch((error) => {
      if (isCancel() && onCancelUpload) {
        onCancelUpload();
      } else if (onError) {
        onError(error.message);
      }
    });
};

export const cancelUpload = () => {
  if (source && source.cancel) {
    source.cancel();
    setCancel(true);
  }
};
