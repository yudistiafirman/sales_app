import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo } from 'react';
import { BButtonPrimary, BForm, BSpacer, BVisitationCard } from '@/components';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { Input, PIC } from '@/interfaces';
import BSheetAddPic from '@/screens/Visitation/elements/second/BottomSheetAddPic';
import { SphContext } from '../../context/SphContext';
import Entypo from 'react-native-vector-icons/Entypo';
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
  const [, stateUpdate] = useContext(SphContext);
  const { selectedCompany, selectedPic } = useSelector(
    (state: RootState) => state.sph
  );

  const inputsData: Input[] = useMemo(() => {
    return [
      {
        label: 'PIC',
        isRequire: true,
        isError: false,
        type: 'PIC',
        value: selectedCompany?.Pics ? selectedCompany.Pics : [],
        onChange: () => {
          openBottomSheet();
        },
        onSelect: (index: number) => {
          const listPic: any[] = [];
          selectedCompany?.Pics?.forEach((pic, picIndex) => {
            let picChanged = { ...pic };
            if (index === picIndex) {
              dispatch(updateSelectedPic(pic));
              picChanged.isSelected = true;
            } else {
              picChanged.isSelected = false;
            }
            listPic.push(picChanged);
          });
          dispatch(updateSelectedCompanyPicList(listPic));
        },
      },
    ];
  }, [selectedCompany?.Pics]);

  function checkSelected() {
    let isSelectedExist = false;
    const list = selectedCompany?.Pics ? selectedCompany?.Pics : [];
    list.forEach((pic) => {
      if (pic.isSelected) {
        isSelectedExist = true;
      }
    });
    return isSelectedExist || JSON.stringify(selectedCompany?.Pic) !== '{}';
  }

  useEffect(() => {
    if (selectedCompany) {
      if (selectedCompany?.Pic?.id && !selectedPic) {
        const foundMainPic = selectedCompany?.Pics?.find(
          (pic) => pic.id === selectedCompany?.Pic?.id
        );
        if (foundMainPic) dispatch(updateSelectedPic(foundMainPic));
      }
      if (selectedCompany?.Pics) {
        const listPic = selectedCompany?.Pics?.map((pic) => {
          if (selectedPic) {
            if (selectedPic.id) {
              if (pic.id === selectedPic.id) {
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
      }
    }
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  let picOrCompanyName = '-';
  if (selectedCompany?.Company?.name) {
    picOrCompanyName = selectedCompany.Company?.name;
  } else if (selectedCompany?.Pic?.name) {
    picOrCompanyName = selectedCompany?.Pic?.name;
  }

  return (
    <View style={style.container}>
      <View style={{ flex: 1 }}>
        <View style={{ minHeight: resScale(75) }}>
          <BVisitationCard
            item={{
              name: selectedCompany?.name || '-',
              location: selectedCompany?.LocationAddress.line1,
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
        <BSpacer size={'extraSmall'} />
        <ScrollView style={style.scrollViewStyle}>
          <BForm titleBold="500" inputs={inputsData} />
        </ScrollView>
      </View>
      <BSpacer size={'extraSmall'} />
      <BButtonPrimary
        disable={!checkSelected()}
        title="Lanjut"
        onPress={() => {
          if (setCurrentPosition) {
            setCurrentPosition(1);
          }
        }}
        rightIcon={ContinueIcon}
      />
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={-1}
        addPic={(pic: PIC) => {
          let newPic = { ...pic };
          const currentList = selectedCompany?.Pics
            ? [...selectedCompany.Pics]
            : [];
          if (currentList && currentList.length > 0) {
            currentList.forEach((it, index) => {
              currentList[index] = {
                ...currentList[index],
                isSelected: false,
              };
            });
          }
          if (newPic) {
            newPic.isSelected = true;
            currentList.push(newPic);
          }
          dispatch(updateSelectedCompanyPicList(currentList));
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
    flex: 1,
  },
});
