import React, { useEffect, useState } from 'react';
import { BButtonPrimary, BForm, BHeaderIcon, BText } from '@/components';
import { Input, PIC } from '@/interfaces';
import Modal from 'react-native-modal';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';

import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
const { height } = Dimensions.get('window');
interface IProps {
  addPic: any;
  onClose: () => void;
  isVisible: boolean;
}

interface InitialState {
  name: string;
  errorName: string;
  position: string;
  errorPosition: string;
  phone: string;
  errorPhone: string;
  email: string;
  errorEmail: string;
}

const initialState = {
  name: '',
  errorName: '',
  position: '',
  errorPosition: '',
  phone: '',
  errorPhone: '',
  email: '',
  errorEmail: '',
};

const BSheetAddPic = ({ addPic, isVisible, onClose }: IProps) => {
  const [state, setState] = React.useState<InitialState>(initialState);
  const [containerHeight, setContainerHeight] = useState<number>(height / 1.6);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setContainerHeight(height / 1.82);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setContainerHeight(height / 1.6);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const inputs: Input[] = [
    {
      label: 'Nama',
      isRequire: true,
      isError: state.errorName.length > 0,
      errorMessage: state.errorName,
      placeholder: 'Masukkan Nama',
      type: 'textInput',
      onChange: (e) =>
        setState((prevState) => ({ ...prevState, name: e, errorName: '' })),
      value: state.name,
    },
    {
      label: 'Jabatan',
      isRequire: true,
      isError: state.errorPosition.length > 0,
      errorMessage: state.errorPosition,
      placeholder: 'Masukkan jabatan',
      type: 'textInput',
      onChange: (e) =>
        setState((prevState) => ({
          ...prevState,
          position: e,
          errorPosition: '',
        })),
      value: state.position,
    },
    {
      label: 'No. Telepon',
      isRequire: true,
      isError: state.errorPhone.length > 0,
      errorMessage: state.errorPhone,
      placeholder: 'Masukkan nomor telepon',
      type: 'textInput',
      keyboardType: 'phone-pad',
      onChange: (e) =>
        setState((prevState) => ({
          ...prevState,
          phone: e,
          errorPhone: '',
        })),
      value: state.phone,
    },
    {
      label: 'Email',
      isRequire: true,
      isError: state.errorEmail.length > 0,
      errorMessage: state.errorEmail,
      keyboardType: 'email-address',
      placeholder: 'Masukkan email',
      type: 'textInput',
      onChange: (e) =>
        setState((prevState) => ({
          ...prevState,
          email: e,
          errorEmail: '',
        })),
      value: state.email,
    },
  ];

  const validate = () => {
    const errors: Partial<InitialState> = {};
    if (state.name.length === 0) {
      errors.errorName = 'Nama harus diisi';
    } else if (state.name.length < 6) {
      errors.errorName = 'Nama tidak boleh kurang dari 6 karakter';
    }
    if (!state.position) {
      errors.errorPosition = 'Jabatan harus diisi';
    } else if (state.position.length < 6) {
      errors.errorPosition = 'Jabatan tidak boleh kurang dari 6 karakter';
    }
    if (!state.email) {
      errors.errorEmail = 'Email harus diisi';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email)) {
      errors.errorEmail = 'Format email salah';
    }
    if (!state.phone) {
      errors.errorPhone = 'Nomor telepon harus diisi';
    } else if (!/^(^\+62)(\d{3,4}-?){2}\d{3,4}$/g.test(state.phone)) {
      errors.errorPhone = 'Format nomor telepon salah';
    }
    return errors;
  };

  const onAdd = () => {
    const errors = validate();
    if (JSON.stringify(errors) !== '{}') {
      Object.keys(errors).forEach((val) => {
        setState((prevState) => ({
          ...prevState,
          [val]: errors[val as keyof typeof initialState],
        }));
      });
    } else {
      const dataPIC: PIC = {
        name: state.name,
        position: state.position,
        phone: state.phone,
        email: state.email,
      };
      addPic(dataPIC);
      setState(initialState);
      onClose();
    }
  };
  return (
    <Modal
      deviceHeight={height}
      isVisible={isVisible}
      style={styles.modalContainer}
    >
      <View style={[styles.contentOuterContainer, { height: containerHeight }]}>
        <View style={styles.contentInnerContainer}>
          <View style={styles.headerContainer}>
            <BText style={styles.headerTitle}>Tambah PIC</BText>
            <BHeaderIcon
              onBack={onClose}
              size={layout.pad.lg}
              marginRight={0}
              iconName="x"
            />
          </View>
          <View>
            <BForm inputs={inputs} />
            <BButtonPrimary onPress={onAdd} title="Tambah PIC" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: 'flex-end' },
  contentOuterContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: layout.radius.lg,
    borderTopEndRadius: layout.radius.lg,
  },
  contentInnerContainer: { flex: 1, marginHorizontal: layout.pad.lg },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: layout.pad.xl + layout.pad.lg,
  },
  headerTitle: {
    fontFamily: font.family.montserrat['700'],
    fontSize: font.size.lg,
  },
});

export default BSheetAddPic;
