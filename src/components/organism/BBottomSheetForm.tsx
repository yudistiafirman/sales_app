import React from 'react';
import { ViewStyle } from 'react-native';
import { layout } from '@/constants';
import { Input, Styles } from '@/interfaces';
import { resScale } from '@/utils';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BBottomSheet from '../atoms/BBottomSheet';
import BButtonPrimary from '../atoms/BButtonPrimary';
import BForm from './BForm';

interface IProps {
  initialIndex: number;
  onAdd: () => void;
  inputs: Input[];
  buttonTitle: string;
  snapPoint: string[];
  children?: JSX.Element;
  enableClose?: boolean;
  isButtonDisable?: boolean;
}

const BBottomSheetForm = React.forwardRef((props: IProps, ref: any) => {
  const {
    initialIndex,
    inputs,
    onAdd,
    buttonTitle,
    snapPoint,
    children,
    enableClose = true,
    isButtonDisable,
  } = props;

  function renderChild() {
    if (!children) {
      return (
        <BottomSheetScrollView style={{ marginBottom: resScale(20) }}>
          <BForm inputs={inputs} />
          <BButtonPrimary onPress={onAdd} title={buttonTitle} />
        </BottomSheetScrollView>
      );
    }
    return (
      <>
        {children}
        <BottomSheetScrollView
          nestedScrollEnabled={true}
          style={{ marginBottom: resScale(20) }}
        >
          <BForm inputs={inputs} />
          <BButtonPrimary
            disable={isButtonDisable}
            onPress={onAdd}
            title={buttonTitle}
          />
        </BottomSheetScrollView>
      </>
    );
  }

  return (
    <BBottomSheet
      // onChange={bottomSheetOnchange}
      percentSnapPoints={snapPoint}
      ref={ref}
      initialSnapIndex={initialIndex}
      enableContentPanningGesture={true}
      style={styles.sheetStyle as ViewStyle}
      containerHeight={resScale(150)}
      enablePanDownToClose={enableClose}
    >
      {renderChild()}
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
