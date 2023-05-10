import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import BButtonPrimary from '../atoms/BButtonPrimary';
import BHeaderIcon from '../atoms/BHeaderIcon';
import BText from '../atoms/BText';
import BForm from '../organism/BForm';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import { Input, PIC, PicFormInitialState } from '@/interfaces';
import { resScale } from '@/utils';

const { height, width } = Dimensions.get('window');
interface IProps {
  addPic: any;
  onClose: () => void;
  isVisible: boolean;
}

const initialState = {
  name: '',
  position: '',
  phone: '',
  email: '',
};

function LeftIcon() {
  return <Text style={styles.leftIconStyle}>+62</Text>;
}
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

function BSheetAddPic({ addPic, isVisible, onClose }: IProps) {
  const [state, setState] = React.useState<PicFormInitialState>(initialState);

  const inputs: Input[] = [
    {
      label: 'Nama',
      isRequire: true,
      isError: !state.name,
      outlineColor: !state.name ? colors.text.errorText : undefined,
      placeholder: 'Masukkan Nama',
      type: 'textInput',
      onChange: e =>
        setState((prevState: PicFormInitialState) => ({
          ...prevState,
          name: e.nativeEvent.text,
        })),
      value: state.name,
    },
    {
      label: 'Jabatan',
      isRequire: true,
      isError: !state.position,
      outlineColor: !state.position ? colors.text.errorText : undefined,
      placeholder: 'Masukkan jabatan',
      type: 'textInput',
      onChange: e =>
        setState(prevState => ({
          ...prevState,
          position: e.nativeEvent.text,
        })),
      value: state.position,
    },
    {
      label: 'No. Telepon',
      isRequire: true,
      isError: !phoneNumberRegex.test(state.phone),
      outlineColor: !phoneNumberRegex.test(state.phone) ? colors.text.errorText : undefined,
      placeholder: 'Masukkan nomor telepon',
      type: 'textInput',
      keyboardType: 'numeric',
      customerErrorMsg: 'No. Telepon harus diisi sesuai format',
      LeftIcon: state.phone ? LeftIcon : undefined,
      onChange: e =>
        setState(prevState => ({
          ...prevState,
          phone: e.nativeEvent.text,
        })),
      value: state.phone,
    },
    {
      label: 'Email',
      isRequire: false,
      isError: state.email ? !emailRegex.test(state.email) : false,
      outlineColor: state.email
        ? emailRegex.test(state.email)
          ? colors.text.errorText
          : undefined
        : undefined,
      keyboardType: 'email-address',
      placeholder: 'Masukkan email',
      type: 'textInput',
      customerErrorMsg: 'Email harus diisi sesuai format',
      onChange: e =>
        setState(prevState => ({
          ...prevState,
          email: e.nativeEvent.text,
        })),
      value: state.email,
    },
  ];

  const onAdd = () => {
    const { name, position, email, phone } = state;
    const emailCondition = state.email ? emailRegex.test(state.email) : true;
    if (emailCondition && !!state.name && phoneNumberRegex.test(state.phone) && !!state.position) {
      const dataPIC: PIC = {
        name: state.name,
        position: state.position,
        phone: state.phone.split('+62').join(''),
        email: state.email,
      };
      addPic(dataPIC);
      setState(initialState);
    }
  };

  const onCloseModal = () => {
    setState(initialState);
    onClose();
  };
  return (
    <Modal deviceHeight={height} isVisible={isVisible} style={styles.modalContainer}>
      <View style={styles.contentWrapper}>
        <KeyboardAwareScrollView>
          <View style={[styles.contentOuterContainer, { height: width + resScale(120) }]}>
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
                <BForm titleBold="500" inputs={inputs} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.buttonWrapper}>
          <BButtonPrimary
            disable={!(!!state.name && phoneNumberRegex.test(state.phone) && !!state.position)}
            onPress={onAdd}
            title="Tambah PIC"
          />
        </View>
      </View>
    </Modal>
  );
}

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
    fontFamily: font.family.montserrat[700],
    fontSize: font.size.lg,
  },
  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: layout.pad.lg,
  },
  leftIconStyle: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
});

export default BSheetAddPic;
