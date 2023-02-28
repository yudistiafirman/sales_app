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
import { customLog } from '@/utils/generalFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  updateSelectedCompanyPicList,
  updateSelectedPic,
} from '@/redux/reducers/SphReducer';

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

function checkSelected(picList?: PIC[]) {
  let isSelectedExist = false;
  const list = picList ? picList : [];
  list.forEach((pic) => {
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
  const dispatch = useDispatch();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [sphState, stateUpdate] = useContext(SphContext);
  const { selectedCompany, selectedPic } = useSelector(
    (state: RootState) => state.sphState
  );

  const inputsData: Input[] = useMemo(() => {
    return [
      {
        label: 'PIC',
        isRequire: true,
        isError: false,
        type: 'PIC',
        value: selectedCompany?.PIC ? selectedCompany.PIC : [],
        onChange: () => {
          openBottomSheet();
        },
        onSelect: (index: number) => {
          // if (stateUpdate) {
          // stateUpdate('selectedPic')(flatListData[index]);
          // const selectPic = (sphState.picList[index].isSelected = true);
          const listPic = selectedCompany?.PIC ? selectedCompany.PIC : [];
          const selectPic = listPic.map((pic, picIndex) => {
            if (index === picIndex) {
              // stateUpdate('selectedPic')(pic);
              dispatch(updateSelectedPic(pic));
              pic.isSelected = true;
            } else {
              pic.isSelected = false;
            }
            return pic;
          });
          dispatch(updateSelectedCompanyPicList(selectPic));
          // stateUpdate('picList')(selectPic);
          // stateUpdate('selectedCompany')({
          //   ...sphState.selectedCompany,
          //   PIC: selectPic,
          // });
          // }
        },
      },
    ];
  }, [selectedCompany?.PIC]);

  useEffect(() => {
    if (selectedCompany) {
      if (selectedCompany?.mainPic?.id && !selectedPic) {
        const foundMainPic = selectedCompany?.PIC?.find(
          (pic) => pic.id === selectedCompany?.mainPic?.id
        );
        if (foundMainPic) dispatch(updateSelectedPic(foundMainPic));
        // if (foundMainPic) stateUpdate('selectedPic')(foundMainPic);
      }
      if (selectedCompany?.PIC) {
        const listPic = selectedCompany?.PIC?.map((pic) => {
          if (selectedPic) {
            if (selectedPic.id) {
              if (pic.id === selectedPic.id) {
                // stateUpdate('selectedPic')(pic);
                dispatch(updateSelectedPic(pic));
                return { ...pic, isSelected: true };
              }
            } else {
              return { ...pic };
            }
          }
          return { ...pic, isSelected: false };
        });
        if (listPic.length === 1) {
          listPic[0].isSelected = true;
        }
        dispatch(updateSelectedCompanyPicList(listPic));
        // stateUpdate('selectedCompany')({
        //   ...sphState.selectedCompany,
        //   PIC: listPic,
        // });
        // stateUpdate('picList')(listPic);
      }
    }
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  let picOrCompanyName = '-';
  if (selectedCompany?.Company?.name) {
    picOrCompanyName = selectedCompany.Company?.name;
  } else if (selectedCompany?.mainPic?.name) {
    picOrCompanyName = selectedCompany?.mainPic?.name;
  }

  return (
    <View style={style.container}>
      <View>
        <View style={{ minHeight: resScale(75) }}>
          {/* <Text>{JSON.stringify(sphState?.selectedCompany)}</Text> */}
          <BVisitationCard
            item={{
              name: selectedCompany?.name || '-',
              location: selectedCompany?.locationAddress.line1,
              picOrCompanyName,
            }}
            customIcon={GantiIcon}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}
          />
        </View>
        <ScrollView style={style.scrollViewStyle}>
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
        disable={!checkSelected(selectedCompany?.PIC)}
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
          customLog(pic, 'bsheetaddpic');
          pic.isSelected = false;
          const currentList = selectedCompany?.PIC ? selectedCompany.PIC : [];
          if (currentList.length === 1) {
            pic.isSelected = true;
          }
          // dispatch(updateSelectedPic([...currentList, pic]));
          dispatch(updateSelectedCompanyPicList([...currentList, pic]));
          // stateUpdate('selectedCompany')({
          //   ...selectedCompany,
          //   PIC: [...currentList, pic],
          // });
          // stateUpdate('picList')([...sphState.picList, pic]);
          // sphState.selectedCompany?.PIC ? sphState.selectedCompany.PIC : [];
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
  scrollViewStyle: {
    maxHeight: resScale(500),
  },
});
