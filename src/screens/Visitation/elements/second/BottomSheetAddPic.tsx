import React from 'react';
import { BBottomSheetForm } from '@/components';
import { Input, PIC } from '@/interfaces';
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

    const inputs: Input[] = [
      {
        label: 'Nama',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (event) => {
          onChange('name')(event.nativeEvent.text);
        },
        value: state.name,
      },
      {
        label: 'Jabatan',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (event) => {
          onChange('position')(event.nativeEvent.text);
        },
        value: state.position,
      },
      {
        label: 'No. Telepon',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (event) => {
          onChange('phone')(event.nativeEvent.text);
        },
        value: state.phone,
      },
      {
        label: 'Email',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (event) => {
          onChange('email')(event.nativeEvent.text);
        },
        value: state.email,
      },
    ];

    const onAdd = () => {
      if (ref) {
        ref.current?.close();
      }
      if (!!state.email && !!state.name && !!state.phone && !!state.position) {
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
          !(!!state.email && !!state.name && !!state.phone && !!state.position)
        }
      />
    );
  }
);

export default BSheetAddPic;
