import React, { useMemo } from 'react';
import { BBottomSheetForm } from '@/components';
import { Input, PIC } from '@/interfaces';
import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/constants';
interface IProps {
  initialIndex: number;
  addPic: any;
}

const initialState = {
  name: '',
  position: '',
  phone: '',
  email: '',
};
function LeftIcon() {
  return <Text style={style.leftIconStyle}>+62</Text>;
}
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

const BSheetAddPic = React.forwardRef(
  ({ initialIndex, addPic }: IProps, ref: any) => {
    // const { action } = React.useContext(createVisitationContext);
    // const { updateValueOnstep } = action;
    const [state, setState] = React.useState<PIC>(initialState);

    const onChange = (key: keyof PIC) => (text: string) => {
      setState({
        ...state,
        [key]: text,
      });
    };

    const inputs: Input[] = useMemo(() => {
      return [
        {
          label: 'Nama',
          isRequire: true,
          isError: !state.name,
          outlineColor: !state.name ? colors.text.errorText : undefined,
          type: 'textInput',
          onChange: (event) => {
            onChange('name')(event.nativeEvent.text);
          },
          value: state.name,
          placeholder: 'Masukkan nama',
        },
        {
          label: 'Jabatan',
          isRequire: true,
          isError: !state.position,
          outlineColor: !state.position ? colors.text.errorText : undefined,
          type: 'textInput',
          onChange: (event) => {
            onChange('position')(event.nativeEvent.text);
          },
          value: state.position,
          placeholder: 'Masukkan jabatan',
        },
        {
          label: 'No. Telepon',
          isRequire: true,
          isError: !phoneNumberRegex.test(state.phone),
          outlineColor: !phoneNumberRegex.test(state.phone)
            ? colors.text.errorText
            : undefined,
          type: 'textInput',
          onChange: (event) => {
            onChange('phone')(event.nativeEvent.text);
          },
          value: state.phone,
          keyboardType: 'numeric',
          customerErrorMsg: 'No. Telepon Harus diisi sesuai format',
          LeftIcon: state.phone ? LeftIcon : undefined,
          placeholder: 'Masukkan nomor telpon',
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
          type: 'textInput',
          onChange: (event) => {
            onChange('email')(event.nativeEvent.text);
          },
          value: state.email,
          customerErrorMsg: 'Email harus diisi sesuai format',
          placeholder: 'Masukkan email',
        },
      ];
    }, [state.name, state.email, state.position, state.phone]);

    const onAdd = () => {
      if (ref) {
        ref.current?.close();
      }
      const emailCondition = state.email ? emailRegex.test(state.email) : true;
      if (
        emailCondition &&
        !!state.name &&
        phoneNumberRegex.test(state.phone) &&
        !!state.position
      ) {
        addPic(state);
        setState(initialState);
      }
    };

    return (
      <BBottomSheetForm
        ref={ref}
        initialIndex={initialIndex}
        onAdd={onAdd}
        inputs={inputs}
        buttonTitle={'Tambah PIC'}
        snapPoint={['75%']}
        isButtonDisable={
          !(
            emailRegex.test(state.email) &&
            !!state.name &&
            phoneNumberRegex.test(state.phone) &&
            !!state.position
          )
        }
      />
    );
  }
);

const style = StyleSheet.create({
  leftIconStyle: {
    fontFamily: fonts.family.montserrat['400'],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
});

export default BSheetAddPic;
