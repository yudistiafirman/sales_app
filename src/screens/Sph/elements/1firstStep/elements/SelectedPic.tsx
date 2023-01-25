import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BButtonPrimary, BForm, BSpacer, BVisitationCard } from '@/components';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { Input } from '@/interfaces';
import BSheetAddPic from '@/screens/Visitation/elements/second/BottomSheetAddPic';
import { SphContext } from '../../context/SphContext';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

import Entypo from 'react-native-vector-icons/Entypo';

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

const dummyData = [
  {
    id: 'kwos0299',
    name: 'Agus',
    position: 'Finance',
    phone: 81128869884,
    email: 'agus@gmail.com',
  },
  {
    id: '1233okjs',
    name: 'Joko',
    position: 'Finance',
    phone: 81128869884,
    email: 'Joko@gmail.com',
  },
  {
    id: 'jsncijc828',
    name: 'Johny',
    position: 'Finance',
    phone: 81128869884,
    email: 'Johny@gmail.com',
  },
];
function dummyReq() {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 5000);
  });
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
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [flatListData, setFlatListData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sphState, stateUpdate] = useContext(SphContext);

  const inputsData: Input[] = useMemo(() => {
    const values = flatListData.map((item) => {
      if (item.id === sphState?.selectedPic?.id) {
        return {
          ...item,
          isSelected: true,
        };
      }
      return {
        ...item,
        isSelected: false,
      };
    });
    return [
      {
        label: 'PIC',
        isRequire: true,
        isError: false,
        type: 'PIC',
        value: values,
        onChange: () => {
          openBottomSheet();
        },
        onSelect: (index: number) => {
          if (stateUpdate) {
            stateUpdate('selectedPic')(flatListData[index]);
          }
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatListData, sphState]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setFlatListData([]);
      const data = await dummyReq();
      console.log(data, 'data dummy');

      setFlatListData(data);
      setIsLoading(false);
    })();
  }, []);

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
              name: sphState?.selectedCompany?.name,
              location: sphState?.selectedCompany?.location,
            }}
            customIcon={GantiIcon}
            onPress={() => {
              console.log('ganti pressed');
              if (onPress) {
                onPress();
              }
            }}
          />
        </View>
        <ScrollView>
          {!isLoading && <BForm inputs={inputsData} />}
          {isLoading && (
            <View>
              <BSpacer size={'medium'} />
              <ShimmerPlaceHolder style={style.labelShimmer} />
              <BSpacer size={'extraSmall'} />
              <ShimmerPlaceHolder style={style.loadingShimmer} />
              <BSpacer size={'extraSmall'} />
              <ShimmerPlaceHolder style={style.loadingShimmer} />
            </View>
          )}
        </ScrollView>
      </View>
      <BButtonPrimary
        disable={!sphState?.selectedPic ? true : false}
        title="Lanjut"
        onPress={() => {
          if (setCurrentPosition) {
            setCurrentPosition(1);
          }
          // setIsLoading((curr) => !curr);
        }}
        rightIcon={ContinueIcon}
        isLoading={isLoading}
      />
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={-1}
        addPic={(pic: any) => {
          // onChange('selectedPic', pic);
          console.log(pic, 'bsheetaddpic');
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
