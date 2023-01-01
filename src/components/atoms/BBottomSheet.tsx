import React, { useCallback, useMemo, forwardRef, Ref } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ViewStyle } from 'react-native';

type BBottomSheetType = {
  children?: JSX.Element;
  percentSnapPoints: string[];
  onChange?: (index: number) => void;
  onChangeAnimate?: (fromIndex: number, toIndex: number) => void;
  initialSnapIndex?: number;
  overDragResistanceFactor?: number;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  enableOverDrag?: boolean;
  enablePanDownToClose?: boolean;
  animateOnMount?: boolean;
  detached?: boolean; // set to true to detach bottom sheet like a modal
  bottomInset?: number; // add bottom inset to elevate the sheet
  handleComponent?: () => JSX.Element;
  backdropComponent?: () => JSX.Element;
  backgroundComponent?: () => JSX.Element;
  footerComponent?: () => JSX.Element;
  backgroundStyle?: ViewStyle;
  style?: ViewStyle;
  handleStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  handleHeight?: number;
  containerHeight?: number;
  contentHeight?: number;
  topInset?: number;
};

export const BBottomSheet = forwardRef(
  (
    {
      children,
      percentSnapPoints,
      onChange = () => {},
      initialSnapIndex = 0,
      overDragResistanceFactor = 2.5,
      detached = false,
      enableContentPanningGesture = true,
      enableHandlePanningGesture = true,
      enableOverDrag = true,
      enablePanDownToClose = false,
      animateOnMount = true,
      handleComponent,
      backdropComponent,
      backgroundComponent,
      backgroundStyle,
      footerComponent,
      style,
      handleStyle,
      handleIndicatorStyle,
      handleHeight,
      containerHeight,
      contentHeight,
      topInset,
      onChangeAnimate = () => {},
    }: BBottomSheetType,
    ref: Ref<BottomSheet>
  ) => {
    const snapPoints = useMemo(() => percentSnapPoints, []);

    const handleSheetChanges = useCallback(onChange, []);
    const handleSheetChangesOnAnimate = useCallback(onChangeAnimate, []);

    return (
      <BottomSheet
        ref={ref}
        index={initialSnapIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        overDragResistanceFactor={overDragResistanceFactor}
        detached={detached}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
        enableOverDrag={enableOverDrag}
        enablePanDownToClose={enablePanDownToClose}
        animateOnMount={animateOnMount}
        handleComponent={handleComponent}
        backdropComponent={backdropComponent}
        backgroundComponent={backgroundComponent}
        backgroundStyle={backgroundStyle}
        footerComponent={footerComponent}
        style={style}
        handleStyle={handleStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        handleHeight={handleHeight}
        containerHeight={containerHeight}
        contentHeight={contentHeight}
        topInset={topInset}
        onAnimate={handleSheetChangesOnAnimate}
      >
        {children}
      </BottomSheet>
    );
  }
);
