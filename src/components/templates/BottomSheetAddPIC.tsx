import React from 'react';
import { BButtonPrimary, BForm, BHeaderIcon, BText } from '@/components';
import { Input, PIC, PicFormInitialState } from '@/interfaces';
import Modal from 'react-native-modal';
import { Dimensions, StyleSheet, View } from 'react-native';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import validatePicForm from '@/utils/validatePicForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { height } = Dimensions.get('window');
interface IProps {
  addPic: any;
  onClose: () => void;
  isVisible: boolean;
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
  const [state, setState] = React.useState<PicFormInitialState>(initialState);

  const inputs: Input[] = [
    {
      label: 'Nama',
      isRequire: true,
      isError: state.errorName.length > 0,
      errorMessage: state.errorName,
      placeholder: 'Masukkan Nama',
      type: 'textInput',
      onChange: (e) =>
        setState((prevState: PicFormInitialState) => ({
          ...prevState,
          name: e.nativeEvent.text,
          errorName: '',
        })),
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
          position: e.nativeEvent.text,
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
          phone: e.nativeEvent.text,
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
          email: e.nativeEvent.text,
          errorEmail: '',
        })),
      value: state.email,
    },
  ];

  const onAdd = () => {
    const { name, position, email, phone } = state;
    console.log('ini phone', phone);
    const errors = validatePicForm({ name, position, email, phone });
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
      onCloseModal();
    }
  };

  const onCloseModal = () => {
    setState(initialState);
    onClose();
  };
  return (
    <Modal
      deviceHeight={height}
      isVisible={isVisible}
      style={styles.modalContainer}
    >
      <View style={styles.contentWrapper}>
        <KeyboardAwareScrollView>
          <View
            style={[styles.contentOuterContainer, { height: height / 1.43 }]}
          >
            <View style={styles.contentInnerContainer}>
              <View style={styles.headerContainer}>
                <BText style={styles.headerTitle}>Tambah PIC</BText>
                <BHeaderIcon
                  onBack={onCloseModal}
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
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: 'flex-end' },
  contentWrapper: { justifyContent: 'flex-end' },
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
