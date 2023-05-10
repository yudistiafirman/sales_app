import React, { useCallback } from 'react';
import { View, ViewStyle } from 'react-native';
import { BottomSheetFooter, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors, layout } from '@/constants';
import { Input, Styles } from '@/interfaces';
import { resScale } from '@/utils';
import BBottomSheet from '../atoms/BBottomSheet';
import BButtonPrimary from '../atoms/BButtonPrimary';
import BForm from './BForm';
import BContainer from '../atoms/BContainer';
import BSpacer from '../atoms/BSpacer';
import { useKeyboardActive } from '@/hooks';

type CustomFooterButtonType = {
  disable?: boolean;
  onPress?: () => void;
  title: string;
};
interface IProps {
  initialIndex: number;
  onAdd: () => void;
  inputs: Input[];
  buttonTitle: string;
  snapPoint: string[];
  children?: JSX.Element;
  enableClose?: boolean;
  isButtonDisable?: boolean;
  CustomFooterButton?: ({
    disable,
    onPress,
    title,
  }: CustomFooterButtonType) => JSX.Element;
}

const BBottomSheetForm = React.forwardRef((props: IProps, ref: any) => {
  const { keyboardVisible } = useKeyboardActive();
  const {
    initialIndex,
    inputs,
    onAdd,
    buttonTitle,
    snapPoint,
    children,
    enableClose = true,
    isButtonDisable,
    CustomFooterButton,
  } = props;

  function renderChild() {
    if (!children) {
      return (
        <BottomSheetScrollView
          style={{ marginBottom: layout.pad.ml + layout.pad.xs }}
        >
          <BForm spacer="extraSmall" titleBold="500" inputs={inputs} />
        </BottomSheetScrollView>
      );
    }
    return (
      <>
        {children}
        <BottomSheetScrollView
          nestedScrollEnabled
          style={{ marginBottom: layout.pad.ml + layout.pad.xs }}
        >
          <BForm spacer="extraSmall" titleBold="500" inputs={inputs} />
        </BottomSheetScrollView>
      </>
    );
  }

  const FooterButton = useCallback(
    (propsFooter: any) => {
      if (keyboardVisible) {
        return null;
      }
      return (
        <BottomSheetFooter {...propsFooter}>
          {CustomFooterButton ? (
            <BContainer>
              <View style={styles.footerContainer}>
                <CustomFooterButton
                  disable={isButtonDisable}
                  onPress={onAdd}
                  title={buttonTitle}
                />
              </View>
            </BContainer>
          ) : (
            <BContainer>
              <View style={styles.footerContainer}>
                <BButtonPrimary
                  disable={isButtonDisable}
                  onPress={onAdd}
                  title={buttonTitle}
                />
              </View>
            </BContainer>
          )}
        </BottomSheetFooter>
      );
    },
    [buttonTitle, onAdd, isButtonDisable, CustomFooterButton, keyboardVisible],
  );

  return (
    <BBottomSheet
      // onChange={bottomSheetOnchange}
      percentSnapPoints={snapPoint}
      ref={ref}
      initialSnapIndex={initialIndex}
      enableContentPanningGesture
      style={styles.sheetStyle as ViewStyle}
      // containerHeight={resScale(150)}
      enablePanDownToClose={enableClose}
      footerComponent={FooterButton}
    >
      <BContainer paddingHorizontal={layout.pad.ml}>
        {renderChild()}
        {!keyboardVisible && <BSpacer size="medium" />}
      </BContainer>
    </BBottomSheet>
  );
});

const styles: Styles = {
  sheetStyle: {
    // padding: layout.pad.lg,
    // backgroundColor: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    backgroundColor: colors.white,
  },
  button: { flexDirection: 'row-reverse' },
};

export default BBottomSheetForm;
