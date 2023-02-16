import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { colors, fonts } from '@/constants';
import { BContainer, BForm, BSpacer } from '@/components';
import {
  fetchSphDocuments,
  postProjectDocByprojectId,
  postUploadFiles,
} from '@/redux/async-thunks/commonThunks';
import { useDispatch } from 'react-redux';
import { Input } from '@/interfaces';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type documentType = {
  id: string;
  name: string;
  payment_type: 'CBD' | 'CREDIT';
  is_required: boolean;
};

type docResponse = {
  cbd: documentType[];
  credit: documentType[];
};
const dummyProjectId = 'cc5b5ed0-ffbf-4ca9-95b9-80e75cd97a22';
const routeDummy = {
  params: {
    docs: [
      {
        docId: 'ddf62784-9fe6-5bff-8764-1e6f707fff3e',
        docName: 'Foto NPWP',
        paymentType: 'CBD',
        isRequired: false,
        type: 'png',
        fileName: '1000000019',
        url: 'https://cdn.oreo.brik.id/new-brik/ebbde260-9149-443d-b4e7-b0a8ec6ce248/customerDetail/1000000019_1676531777499.png',
      },
      {
        docId: 'f407d99d-c0e2-5cdf-b972-da308e2b0049',
        docName: 'Foto KTP',
        paymentType: 'CBD',
        isRequired: false,
        type: 'png',
        fileName: '1000000019',
        url: 'https://cdn.oreo.brik.id/new-brik/ebbde260-9149-443d-b4e7-b0a8ec6ce248/customerDetail/1000000019_1676530185165.png',
      },
    ],
  },
};

export default function RequiredDocuments() {
  const dispatch = useDispatch();

  const { params } = routeDummy;
  const [isLoading, setIsLoading] = useState(false);
  const [reqDocuments, setReqDocuments] = useState<docResponse>({});
  const [docState, setDocState] = useState<{ [key: string]: any }>({});
  const [docLoadingState, setDocLoadingState] = useState<{
    [key: string]: {
      loading: boolean;
      error: boolean;
      errorMessage: string;
    };
  }>({});

  const [filledDocsCount, totalDocsCount] = useMemo((): number[] => {
    let count = 0;
    let totalProperties = 0;

    for (const key in docState) {
      totalProperties++;
      if (Object.prototype.hasOwnProperty.call(docState, key)) {
        if (docState[key]) {
          count++;
        }
      }
    }

    return [count, totalProperties];
  }, [docState]);

  const getDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: docResponse = await dispatch(
        fetchSphDocuments()
      ).unwrap();

      setDocState(() => {
        const newDocState: { [key: string]: any } = {};

        response.credit.forEach((doc) => {
          newDocState[doc.id] = null;
        });
        response.cbd.forEach((doc) => {
          newDocState[doc.id] = null;
        });

        if (params?.docs && Array.isArray(params.docs)) {
          params?.docs.forEach((doc) => {
            if (doc.docId in newDocState) {
              newDocState[doc.docId] = doc;
            }
          });
        }

        return newDocState;
      });
      setDocLoadingState(() => {
        const newdocLoadingState: {
          [key: string]: {
            loading: boolean;
            error: boolean;
            errorMessage: string;
          };
        } = {};

        response.credit.forEach((doc) => {
          newdocLoadingState[doc.id] = {
            loading: false,
            error: false,
            errorMessage: '',
          };
        });
        response.cbd.forEach((doc) => {
          newdocLoadingState[doc.id] = {
            loading: false,
            error: false,
            errorMessage: '',
          };
        });

        return newdocLoadingState;
      });

      setReqDocuments(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error getDocument128', error);
    }
  }, []);

  useEffect(() => {
    getDocument();
  }, []);

  const uploadFile = useCallback(async (documentId: string, file: any) => {
    try {
      setDocLoadingState((curr) => {
        return {
          ...curr,
          [documentId]: {
            ...curr[documentId],
            loading: true,
            error: false,
            errorMessage: '',
          },
        };
      });
      const response = await dispatch(
        postUploadFiles({ files: [file], from: 'customerDetail' })
      ).unwrap();
      console.log(response, 'responseuploadfiles');

      if (!response[0]) {
        throw response;
      }

      const photoResponse = response[0];
      const payloadProjectDoc = {
        documentId,
        fileId: photoResponse.id,
        projectId: dummyProjectId, //hardcode di atas,
      };

      const projectDocResponse = await dispatch(
        postProjectDocByprojectId({ payload: payloadProjectDoc })
      ).unwrap();

      console.log(projectDocResponse, 'projectDocResponse138');

      setDocLoadingState((curr) => {
        return {
          ...curr,
          [documentId]: {
            ...curr[documentId],
            loading: false,
            error: false,
            errorMessage: '',
          },
        };
      });
    } catch (error) {
      console.log(error, 'erroruploadfiles requiredocuments161');
      let messsage = 'Upload error';
      if (error.message) {
        messsage = error.message;
      }
      setDocLoadingState((curr) => {
        return {
          ...curr,
          [documentId]: {
            ...curr[documentId],
            loading: false,
            error: true,
            errorMessage: messsage,
          },
        };
      });
    }
  }, []);

  const files = useMemo(() => {
    type fileInputType = {
      label: string;
      type: string;
      isRequire: boolean;
      key: string;
    };
    const fileInput: fileInputType[] = [];
    reqDocuments?.credit?.forEach((doc) => {
      const input = {
        label: doc.name,
        type: 'fileInput',
        isRequire: doc.is_required,
        key: doc.id,
      };
      fileInput.push(input);
    });
    reqDocuments?.cbd?.forEach((doc) => {
      const input = {
        label: doc.name,
        type: 'fileInput',
        isRequire: doc.is_required,
        key: doc.id,
      };
      fileInput.push(input);
    });
    return fileInput;
  }, [reqDocuments]);

  const inputsData: Input[] = useMemo(() => {
    const fileInputs: Input[] = [];
    files.forEach((each) => {
      const inputFile: Input = {
        ...each,
        value: docState[each.key],
        onChange: (data: any) => {
          if (!data) return;
          setDocState((curr) => {
            return {
              ...curr,
              [each.key]: {
                ...data,
                name: each.key.trim() + data.name,
              },
            };
          });
          uploadFile(each.key, data);
        },
        loading: docLoadingState[each.key].loading,
        isError: docLoadingState[each.key].error,
        customerErrorMsg: docLoadingState[each.key].errorMessage,
      };
      fileInputs.push(inputFile);
    });
    return fileInputs;
  }, [files, docState, docLoadingState, uploadFile]);

  return (
    <BContainer>
      <View style={styles.documentProggress}>
        <View style={styles.between}>
          <Text style={styles.fontW500}>Kelengkapan Dokumen</Text>
          <Text style={styles.fontW500}>
            {filledDocsCount}/{totalDocsCount}
          </Text>
        </View>
        <ProgressBar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={
            filledDocsCount / totalDocsCount
              ? filledDocsCount / totalDocsCount
              : 0
          }
          color={colors.primary}
        />
      </View>
      <BSpacer size={'small'} />
      <BForm inputs={inputsData} />
      {isLoading && (
        <View>
          <ShimmerPlaceHolder style={styles.fileInputShimmer} />
          <BSpacer size={'extraSmall'} />
          <ShimmerPlaceHolder style={styles.fileInputShimmer} />
        </View>
      )}
    </BContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  fontW500: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
  },
  documentProggress: {},
  fileInputShimmer: {
    width: resScale(330),
    height: resScale(30),
    borderRadius: resScale(8),
  },
});
