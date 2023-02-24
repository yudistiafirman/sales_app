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
  ScrollView,
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
import { colors, fonts } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepOne: state } = values;
  const { updateValueOnstep } = action;
  const [selectedPO, setSelectedPO] = React.useState<any[]>([]);

  const listenerCallback = React.useCallback(
    ({ parent, data }: { parent: any; data: any }) => {
      updateValueOnstep('stepOne', 'sphs', data);
      updateValueOnstep('stepOne', 'companyName', parent.companyName);
      updateValueOnstep('stepOne', 'locationName', parent.locationName);
      let allProducts: any[] = [];
      data?.forEach((sp) => {
        if (sp?.products) allProducts.push(...sp.products);
      });
      updateValueOnstep('stepTwo', 'products', allProducts);
    },
    [updateValueOnstep]
  );

  React.useEffect(() => {
    DeviceEventEmitter.addListener('SearchPO.data', listenerCallback);
    return () => {
      DeviceEventEmitter.removeAllListeners('SearchPO.data');
    };
  }, [listenerCallback]);

  const onValueChanged = (item: any, value: boolean) => {
    let listSelectedPO: any[] = [];
    if (selectedPO) listSelectedPO.push(...selectedPO);
    if (value) {
      listSelectedPO.push(item);
    } else {
      listSelectedPO = listSelectedPO.filter((it) => {
        return it !== item;
      });
    }
    setSelectedPO(listSelectedPO);
  };

  const { sphs, companyName, locationName, lastDeposit } = state;

  return (
    <SafeAreaView style={style.flexFull}>
      {sphs && sphs.length > 0 ? (
        <>
          <ScrollView style={style.flexFull}>
            <View style={style.flexFull}>
              <POListCard
                companyName={companyName}
                locationName={locationName}
                useChevron={false}
              />
            </View>
            <View style={style.flexFull}>
              {sphs && sphs.length > 0 && (
                <BNestedProductCard
                  withoutHeader={false}
                  data={sphs}
                  selectedPO={selectedPO}
                  onValueChange={onValueChanged}
                  withoutSeparator
                />
              )}
            </View>
            <View style={style.summaryContainer}>
              <Text style={style.summary}>Sisa Deposit</Text>
              <Text style={[style.summary, style.fontw400]}>
                {lastDeposit && lastDeposit?.nominal
                  ? formatCurrency(lastDeposit?.nominal)
                  : '-'}
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
          </ScrollView>
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
  flexFull: {
    flex: 1,
  },
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
