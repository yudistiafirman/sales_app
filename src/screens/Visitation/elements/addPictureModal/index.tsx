import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors, fonts, layout } from '@/constants';
import { BBackContinueBtn, BContainer } from '@/components';
import DocumentPicker from 'react-native-document-picker';

type AddPictureModalType = {
  isVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initiatePopup?: () => void;
  addImage: (image: any) => void;
};

export default function AddPictureModal({
  isVisible,
  setIsModalVisible,
  initiatePopup,
  addImage,
}: AddPictureModalType) {
  const [imageData, setImageData] = useState<any>(null);

  const selectFile = useCallback(async () => {
    // Opening Document Picker to select one file
    try {
      console.log('select file');

      const res = await DocumentPicker.pickSingle({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.images],
        allowMultiSelection: false,
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('select file 2');
      setImageData(res);
      //   addImage(res);
      // Setting the state to show single file attributes
      //   setSingleFile(res);
      // if (onChange) {
      //   onChange(res);
      // }
    } catch (err) {
      //   setSingleFile(null);
      // if (onChange) {
      //   onChange(null);
      // }
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        // alert('Canceled');
        console.log('Canceled', JSON.stringify(err));
      } else {
        // For Unknown Error
        console.log(JSON.stringify(err));

        // alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      hideModalContentWhileAnimating={true}
      backdropOpacity={1}
      backdropColor="#FFFFFF"
      coverScreen
      style={styles.modal}
    >
      <BContainer>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible((curr) => !curr);
              }}
            >
              <View style={styles.closeIcon}>
                <MaterialCommunityIcons
                  name="close"
                  size={30}
                  color="#000000"
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerText}>Lengkapi Foto Kunjungan</Text>
          </View>
          <View style={{ flex: 1 }}>
            {imageData ? (
              <Image source={imageData} style={{ flex: 1 }} />
            ) : (
              <Button
                title="input file dummy kamera"
                onPress={async () => {
                  await selectFile();

                  // if (initiatePopup) {
                  //   initiatePopup();
                  // }
                }}
              />
            )}
          </View>
          <BBackContinueBtn
            onPressContinue={() => {
              addImage(imageData);
              setImageData(null);
              if (initiatePopup) {
                initiatePopup();
              }
            }}
            disableContinue={!imageData}
          />
        </View>
      </BContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: layout.pad.md,
  },
  closeIcon: {
    paddingRight: layout.pad.md,
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
});
