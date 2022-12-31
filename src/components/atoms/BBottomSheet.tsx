import React, { useCallback, useMemo, forwardRef, Ref } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

type BBottomSheetType = {
  children?: JSX.Element;
  percentSnapPoints: string[];
  onChange: (index: number) => void;
  initialSnapIndex?: number;
  overDragResistanceFactor?: number;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  enableOverDrag?: boolean;
  enablePanDownToClose?: boolean;
  animateOnMount?: boolean;
  detached?: boolean; // set to true to detach bottom sheet like a modal
  bottomInset?: number; // add bottom inset to elevate the sheet
};

export const BBottomSheet = forwardRef(
  (
    {
      children,
      percentSnapPoints,
      onChange,
      initialSnapIndex = 0,
      overDragResistanceFactor = 2.5,
      detached = false,
      enableContentPanningGesture = true,
      enableHandlePanningGesture = true,
      enableOverDrag = true,
      enablePanDownToClose = false,
      animateOnMount = true,
    }: BBottomSheetType,
    ref: Ref<BottomSheet>
  ) => {
    const snapPoints = useMemo(() => percentSnapPoints, []);

    const handleSheetChanges = useCallback(onChange, []);

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
      >
        {children}
      </BottomSheet>
    );
  }
);
