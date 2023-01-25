import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

//AntDesign
type BFileInputType = {
  onChange?: (e: any) => void;
  label: string;
  value: any;
};

export default function BFileInput({ onChange, label, value }: BFileInputType) {
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
      // Setting the state to show single file attributes
      //   setSingleFile(res);
      if (onChange) {
        onChange(res);
      }
    } catch (err) {
      //   setSingleFile(null);
      if (onChange) {
        onChange(null);
      }
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
    <TouchableOpacity onPress={selectFile}>
      <View style={[style.container, !value ? style.dashedBorder : null]}>
        <Text style={style.textStyle}>{label}</Text>
        {value ? (
          <View style={style.greenDot}>
            <Entypo size={13} name="check" color={'#FFFFFF'} />
          </View>
        ) : (
          <AntDesign name="upload" size={resScale(15)} />
        )}
      </View>
    </TouchableOpacity>
  );
}
const style = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    height: resScale(40),
    borderRadius: layout.radius.sm,
    padding: layout.pad.md,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textStyle: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
  dashedBorder: {
    borderWidth: resScale(2),
    borderStyle: 'dashed',
    borderColor: colors.border.altGrey,
  },
  greenDot: {
    backgroundColor: 'green',
    width: resScale(16),
    height: resScale(16),
    borderRadius: resScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
