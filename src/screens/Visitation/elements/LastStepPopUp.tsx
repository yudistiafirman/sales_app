import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { colors, fonts, layout } from '@/constants';
import {
  BButtonPrimary,
  BForm,
  BLabel,
  BSpacer,
  BTextInput,
} from '@/components';
import { resScale } from '@/utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-paper';
import { Input } from '@/interfaces';
import { useNavigation } from '@react-navigation/native';

type LastStepPopUpType = {
  isVisible: boolean;
  setIsPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate?: string;
  closedLostValueOnChange: {
    dropdownOnchange: (e: any) => void;
    dropdownValue?: 'FINISHED' | 'MOU_COMPETITOR';
    areaOnChange: (e: any) => void;
    areaValue: string | null;
  };
  onPressSubmit?: (type: lastStepPickedType) => void;
  isLoading?: boolean;
};
type lastStepPickedType = 'VISIT' | 'SPH' | 'REJECTED' | '';

function chevronRight() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#000000" />;
}

export default function LastStepPopUp({
  setIsPopUpVisible,
  isVisible,
  selectedDate,
  closedLostValueOnChange,
  onPressSubmit = () => {},
  isLoading,
}: LastStepPopUpType) {
  const navigation = useNavigation();

  const [lastStepPicked, setLastStepPicked] = useState<lastStepPickedType>('');

  const inputs: Input[] = [
    {
      label: 'Kategori Alasan Penolakan',
      isRequire: true,
      isError: false,
      value: closedLostValueOnChange.dropdownValue,
      // onChange: closedLostValueOnChange.dropdownOnchange,
      type: 'dropdown',
      dropdown: {
        items: [
          { label: 'Sudah MOU dengan Kompetitor', value: 'MOU_COMPETITOR' },
          { label: 'Proyek sudah selesai dibangun', value: 'FINISHED' },
        ],
        placeholder: 'Pilih Alasan',
        onChange: (value: any) => {
          console.log(value, 'onchange dropdown');
          closedLostValueOnChange.dropdownOnchange(value);
        },
      },
    },
    {
      label: 'Alasan Penolakan',
      isRequire: true,
      isError: false,
      type: 'area',
      onChange: closedLostValueOnChange.areaOnChange,
      value: closedLostValueOnChange.areaValue,
    },
  ];

  return (
    <Modal
      isVisible={isVisible}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      backdropColor="#000000"
      style={styles.modalStyle}
      onSwipeComplete={() => {
        setIsPopUpVisible((curr) => !curr);
      }}
      onBackdropPress={() => {
        setIsPopUpVisible((curr) => !curr);
      }}
      swipeDirection={['down']}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.headerText}>
            {lastStepPicked === '' ? 'Tahap Terakhir' : 'Tahap Selanjutnya'}
          </Text>
        </View>
        <BSpacer size={'small'} />
        <View
          pointerEvents={isLoading ? 'none' : 'auto'}
          style={styles.buttonLastStepContainer}
        >
          <TouchableOpacity
            onPress={() => {
              setLastStepPicked('VISIT');
            }}
          >
            <View style={styles.buttonLastStep}>
              <MaterialIcons
                style={[
                  styles.iconStyle,
                  lastStepPicked === 'VISIT' ? styles.iconSelected : null,
                ]}
                name="add-location-alt"
                size={resScale(25)}
              />
              <BSpacer size={'extraSmall'} />
              <Text
                style={[
                  styles.lastStepText,
                  lastStepPicked === 'VISIT' ? styles.iconSelected : null,
                ]}
              >
                Kunjungi Lagi
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity
            onPress={() => {
              setLastStepPicked('SPH');
            }}
          >
            <View style={styles.buttonLastStep}>
              <MaterialCommunityIcons
                style={[
                  styles.iconStyle,
                  lastStepPicked === 'SPH' ? styles.iconSelected : null,
                ]}
                name="file-edit-outline"
                size={resScale(25)}
              />
              <BSpacer size={'extraSmall'} />
              <Text
                style={[
                  styles.lastStepText,
                  lastStepPicked === 'SPH' ? styles.iconSelected : null,
                ]}
              >
                Buat SPH
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity
            onPress={() => {
              setLastStepPicked('REJECTED');
            }}
          >
            <View style={styles.buttonLastStep}>
              <MaterialCommunityIcons
                style={[
                  styles.iconStyle,
                  lastStepPicked === 'REJECTED' ? styles.iconSelected : null,
                ]}
                name="close-octagon-outline"
                size={resScale(25)}
              />
              <BSpacer size={'extraSmall'} />
              <Text
                style={[
                  styles.lastStepText,
                  lastStepPicked === 'REJECTED' ? styles.iconSelected : null,
                ]}
              >
                Closed Lost
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {lastStepPicked && <BSpacer size={'extraSmall'} />}
        {lastStepPicked === 'VISIT' && (
          <View>
            <BLabel label="Tanggal" isRequired />
            <View style={styles.relativPos}>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => {
                  navigation.navigate('CalendarScreen');
                  setIsPopUpVisible((curr) => !curr);
                }}
              />
              <BTextInput
                value={selectedDate}
                placeholder="Pilih Tanggal"
                right={<TextInput.Icon icon={chevronRight} />}
              />
            </View>
            <BSpacer size={'extraSmall'} />
            <BButtonPrimary
              title="Submit"
              isLoading={isLoading}
              disable={!selectedDate}
              onPress={() => {
                onPressSubmit(lastStepPicked);
              }}
            />
          </View>
        )}
        {lastStepPicked === 'SPH' && (
          <BButtonPrimary
            title="Buat SPH Sekarang"
            isLoading={isLoading}
            onPress={() => {
              onPressSubmit(lastStepPicked);
            }}
          />
        )}
        {lastStepPicked === 'REJECTED' && (
          <>
            <BForm inputs={inputs} />
            <BButtonPrimary
              title="Submit"
              isLoading={isLoading}
              disable={
                !(
                  !!closedLostValueOnChange.areaValue &&
                  !!closedLostValueOnChange.dropdownValue
                )
              }
              onPress={() => {
                onPressSubmit(lastStepPicked);
              }}
            />
          </>
        )}

        {/* <Button
          title="tutup"
          onPress={() => {
            setIsPopUpVisible((curr) => !curr);
          }}
        /> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: { flex: 1, justifyContent: 'center' },
  modalContent: {
    // flex: 1,
    backgroundColor: colors.white,
    // height: resScale(200),
    borderRadius: layout.radius.md,
    padding: layout.mainPad,
  },
  modalHeader: { justifyContent: 'center' },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
    textAlign: 'center',
  },
  buttonLastStep: {
    height: resScale(84),
    width: resScale(93),
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    padding: layout.pad.md,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  lastStepText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    textAlign: 'center',
  },
  buttonLastStepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  spacer: {
    margin: layout.pad.sm,
  },
  iconStyle: {
    color: colors.black,
  },
  iconSelected: {
    color: colors.primary,
  },
  relativPos: {
    position: 'relative',
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
});
