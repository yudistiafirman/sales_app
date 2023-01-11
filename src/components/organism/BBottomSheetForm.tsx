import React from 'react';
import { ViewStyle } from 'react-native';
import { layout } from '@/constants';
import { Input, Styles } from '@/interfaces';
import { resScale } from '@/utils';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BBottomSheet from '../atoms/BBottomSheet';
import BButtonPrimary from '../atoms/BButtonPrimary';
import BContainer from '../atoms/BContainer';
import BForm from './BForm';

interface IProps {
  initialIndex: number;
  onAdd: () => void;
  inputs: Input[];
  buttonTitle: string;
  snapPoint: string[];
}

const BBottomSheetForm = React.forwardRef((props: IProps, ref: any) => {
  const { initialIndex, inputs, onAdd, buttonTitle, snapPoint } = props;
  return (
    <BBottomSheet
      // onChange={bottomSheetOnchange}
      percentSnapPoints={snapPoint}
      ref={ref}
      initialSnapIndex={initialIndex}
      enableContentPanningGesture={true}
      style={styles.sheetStyle as ViewStyle}
      containerHeight={resScale(150)}
      enablePanDownToClose
    >
      <BContainer>
        <BottomSheetScrollView>
          <BForm inputs={inputs} />
          <BButtonPrimary onPress={onAdd} title={buttonTitle} />
        </BottomSheetScrollView>
      </BContainer>
    </BBottomSheet>
  );
});

const styles: Styles = {
  sheetStyle: {
    padding: layout.pad.lg,
    // backgroundColor: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flexDirection: 'row-reverse' },
};

export default BBottomSheetForm;
