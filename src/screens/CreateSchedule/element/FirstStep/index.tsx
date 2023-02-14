import * as React from 'react';
import {
  BButtonPrimary,
  BNestedProductCard,
  BSearchBar,
  BSpacer,
} from '@/components';
import { TextInput } from 'react-native-paper';
import {
  DeviceEventEmitter,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { resScale } from '@/utils';
import { CREATE_SCHEDULE, SEARCH_PO } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';
import POListCard from '@/components/templates/PO/POListCard';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepOne: state } = values;
  const { updateValueOnstep } = action;

  const listenerCallback = React.useCallback(
    ({ parent, data }: { parent: any; data: any }) => {
      updateValueOnstep('stepOne', 'title', data.name);
      updateValueOnstep('stepOne', 'companyName', parent.companyName);
      updateValueOnstep('stepOne', 'locationName', parent.locationName);
      updateValueOnstep('stepOne', 'products', data.products);
      updateValueOnstep('stepTwo', 'products', data.products);
      console.log('pertama, ', parent);
      console.log('kedua, ', data);
    },
    [updateValueOnstep]
  );

  React.useEffect(() => {
    DeviceEventEmitter.addListener('SearchPO.data', listenerCallback);
    return () => {
      DeviceEventEmitter.removeAllListeners('SearchPO.data');
    };
  }, [listenerCallback]);

  const { products, companyName, locationName, title, lastDeposit } = state;

  const sphData = [
    {
      name: title,
      products: products,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {state?.title && state?.products ? (
        <>
          <View style={{ height: resScale(80) }}>
            <POListCard
              companyName={companyName}
              locationName={locationName}
              useChevron={false}
            />
          </View>
          {sphData && sphData.length > 0 && (
            <BNestedProductCard
              withoutHeader={false}
              data={sphData}
              withoutBottomSpace={true}
            />
          )}
          <View style={style.summaryContainer}>
            <Text style={style.summary}>Sisa Deposit</Text>
            <Text style={[style.summary, style.fontw400]}>
              {lastDeposit ? formatCurrency(lastDeposit) : '-'}
            </Text>
          </View>
          <BSpacer size={'medium'} />
          <View style={style.summaryContainer}>
            <Text style={style.summary}>Ada Deposit Baru?</Text>
            <BButtonPrimary
              titleStyle={[style.fontw400, { fontSize: fonts.size.md }]}
              title="Buat Deposit"
              isOutline
              onPress={() => {}}
            />
          </View>
        </>
      ) : (
        <>
          <View>
            <TouchableOpacity
              style={style.touchable}
              onPress={() => {
                navigation.navigate(SEARCH_PO, { from: CREATE_SCHEDULE });
              }}
            />
            <BSearchBar
              placeholder="Cari PO"
              activeOutlineColor="gray"
              left={<TextInput.Icon icon="magnify" />}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.sm,
  },
  fontw400: {
    fontFamily: fonts.family.montserrat[400],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
