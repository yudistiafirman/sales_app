import React from 'react';
import { BBottomSheet, BButtonPrimary, BContainer, BForm } from '@/components';
import { Input, PIC, Styles } from '@/interfaces';
import { ViewStyle } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { scaleSize } from '@/utils';
import { layout } from '@/constants';

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
        onChange: onChange('name'),
        value: state.name,
      },
      {
        label: 'Jabatan',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: onChange('position'),
        value: state.position,
      },
      {
        label: 'No. Telepon',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: onChange('phone'),
        value: state.phone,
      },
      {
        label: 'Email',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: onChange('email'),
        value: state.email,
      },
    ];

    return (
      <BBottomSheet
        // onChange={bottomSheetOnchange}
        percentSnapPoints={['75%']}
        ref={ref}
        initialSnapIndex={initialIndex}
        enableContentPanningGesture={true}
        style={styles.sheetStyle as ViewStyle}
        containerHeight={scaleSize.moderateScale(150)}
      >
        <BContainer>
          <BottomSheetScrollView>
            <BForm inputs={inputs} />
            <BButtonPrimary
              onPress={() => {
                if (ref) {
                  ref.current?.close();
                }
                addPic(state);
                setState(initialState);
              }}
              title="Tambah PIC"
            />
          </BottomSheetScrollView>
        </BContainer>
      </BBottomSheet>
    );
  }
);

const styles: Styles = {
  sheetStyle: {
    padding: layout.pad.lg,
    backgroundColor: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flexDirection: 'row-reverse' },
};

export default BSheetAddPic;
