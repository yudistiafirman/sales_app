import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo } from 'react';
import { BButtonPrimary, BForm, BVisitationCard } from '@/components';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { Input, PIC } from '@/interfaces';
import BSheetAddPic from '@/screens/Visitation/elements/second/BottomSheetAddPic';
import { SphContext } from '../../context/SphContext';

// import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
// import LinearGradient from 'react-native-linear-gradient';
// const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Entypo from 'react-native-vector-icons/Entypo';

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

function GantiIcon() {
  return (
    <View>
      <Text style={style.gantiText}>Ganti</Text>
    </View>
  );
}

function checkSelected(picList: PIC[]) {
  let isSelectedExist = false;
  picList.forEach((pic) => {
    if (pic.isSelected) {
      isSelectedExist = true;
    }
  });
  return isSelectedExist;
}

type SelectedPicType = {
  onPress?: () => void;
  setCurrentPosition?: (num: number) => void;
};

export default function SelectedPic({
  onPress,
  setCurrentPosition,
}: SelectedPicType) {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [sphState, stateUpdate] = useContext(SphContext);

  const inputsData: Input[] = useMemo(() => {
    return [
      {
        label: 'PIC',
        isRequire: true,
        isError: false,
        type: 'PIC',
        value: sphState.picList,
        onChange: () => {
          openBottomSheet();
        },
        onSelect: (index: number) => {
          if (stateUpdate) {
            // stateUpdate('selectedPic')(flatListData[index]);
            // const selectPic = (sphState.picList[index].isSelected = true);
            const listPic = sphState.picList;
            const selectPic = listPic.map((pic, picIndex) => {
              if (index === picIndex) {
                pic.isSelected = true;
              } else {
                pic.isSelected = false;
              }
              return pic;
            });
            stateUpdate('picList')(selectPic);
          }
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphState]);

  useEffect(() => {
    if (sphState.selectedCompany) {
      if (sphState.selectedCompany.mainPic?.id && !sphState.selectedPic) {
        stateUpdate('selectedPic')(sphState.selectedCompany.mainPic);
      }
      if (sphState.selectedCompany.PIC) {
        const listPic = sphState.selectedCompany.PIC.map((pic) => {
          if (sphState.selectedPic && pic.id === sphState.selectedPic.id) {
            return { ...pic, isSelected: true };
          }
          return { ...pic, isSelected: false };
        });
        stateUpdate('picList')(listPic);
      }
    }
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     setFlatListData([]);
  //     const data = await dummyReq();
  //     console.log(data, 'data dummy');

  //     setFlatListData(data);
  //     setIsLoading(false);
  //   })();
  // }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={style.container}>
      <View>
        <View style={{ minHeight: resScale(75) }}>
          {/* <Text>{JSON.stringify(sphState?.selectedCompany)}</Text> */}
          <BVisitationCard
            item={{
              name: sphState?.selectedCompany?.name || '-',
              location: sphState?.selectedCompany?.locationAddress.line1,
            }}
            customIcon={GantiIcon}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}
          />
        </View>
        <ScrollView>
          <BForm inputs={inputsData} />
          {/* {isLoading && (
            <View>
              <BSpacer size={'medium'} />
              <ShimmerPlaceHolder style={style.labelShimmer} />
              <BSpacer size={'extraSmall'} />
              <ShimmerPlaceHolder style={style.loadingShimmer} />
              <BSpacer size={'extraSmall'} />
              <ShimmerPlaceHolder style={style.loadingShimmer} />
            </View>
          )} */}
        </ScrollView>
      </View>
      <BButtonPrimary
        disable={!checkSelected(sphState.picList)}
        title="Lanjut"
        onPress={() => {
          if (setCurrentPosition) {
            setCurrentPosition(1);
          }
          // setIsLoading((curr) => !curr);
        }}
        rightIcon={ContinueIcon}
      />
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={-1}
        addPic={(pic: PIC) => {
          // onChange('selectedPic', pic);
          console.log(pic, 'bsheetaddpic');
          pic.isSelected = false;
          stateUpdate('picList')([...sphState.picList, pic]);
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  gantiText: {
    marginRight: 10,
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
  },
  loadingShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
  labelShimmer: {
    width: resScale(335),
    height: resScale(50),
    borderRadius: layout.radius.md,
  },
});
