import * as React from 'react';
import {
  BDivider,
  BGalleryDeposit,
  BNestedProductCard,
  BSearchBar,
  BSpacer,
  BTouchableText,
  BVisitationCard,
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
import { CREATE_DEPOSIT, SEARCH_PO } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { CreateDepositContext } from '@/context/CreateDepositContext';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import formatCurrency from '@/utils/formatCurrency';

export default function SecondStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateDepositContext);
  const { stepTwo: stateTwo, stepOne: stateOne } = values;
  const { updateValueOnstep } = action;
  const [selectedPO, setSelectedPO] = React.useState<any[]>([]);

  const listenerCallback = React.useCallback(
    ({ parent, data }: { parent: any; data: any }) => {
      updateValueOnstep('stepTwo', 'companyName', parent.companyName);
      updateValueOnstep('stepTwo', 'locationName', parent.locationName);
      updateValueOnstep('stepTwo', 'sphs', data);
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

  const customAction = () => {
    return (
      <BTouchableText
        textStyle={{
          fontFamily: font.family.montserrat[500],
          color: colors.select.selected,
        }}
        onPress={changePO}
        title={'Ganti'}
      />
    );
  };

  const changePO = () => {
    navigation.navigate(SEARCH_PO, { from: CREATE_DEPOSIT });
  };

  const calculatedTotal = (): number => {
    let deposit = 0;
    if (stateOne.deposit?.nominal) deposit = stateOne.deposit?.nominal;
    let allProducts: any[] = [];
    sphs?.forEach((sp) => {
      if (sp?.products) allProducts.push(...sp.products);
    });

    const totalAmountProducts = allProducts
      ?.map((prod) => prod?.total_price)
      .reduce((prev: any, next: any) => prev + next);

    return deposit - totalAmountProducts;
  };

  const { companyName, locationName, sphs } = stateTwo;
  const { deposit } = stateOne;
  return (
    <SafeAreaView style={style.flexFull}>
      {deposit && (
        <BGalleryDeposit
          nominal={deposit?.nominal}
          createdAt={deposit?.createdAt}
          picts={deposit?.picts}
        />
      )}
      <>
        <View>
          <BSpacer size={'extraSmall'} />
          <BSpacer size={'verySmall'} />
          <BDivider />
        </View>
        <View style={style.flexFull}>
          {sphs && sphs.length > 0 ? (
            <>
              <ScrollView
                style={[style.flexFull, { marginBottom: layout.pad.xxl }]}
              >
                <View style={style.flexFull}>
                  <BSpacer size={'extraSmall'} />
                  <BVisitationCard
                    item={{ name: companyName, location: locationName }}
                    customIcon={customAction}
                  />
                  <BSpacer size={'extraSmall'} />
                </View>
                <View style={style.flexFull}>
                  {sphs && sphs.length > 0 && (
                    <BNestedProductCard
                      withoutHeader={false}
                      data={sphs}
                      selectedPO={selectedPO}
                      onValueChange={onValueChanged}
                      deposit={deposit?.nominal}
                      withoutSeparator
                    />
                  )}
                </View>
              </ScrollView>

              <View style={style.summContainer}>
                <Text style={style.summary}>{'Est Deposit Akhir'}</Text>
                <Text style={[style.summary, style.fontw600]}>
                  IDR {formatCurrency(calculatedTotal())}
                </Text>
              </View>
            </>
          ) : (
            <>
              <BSpacer size={'extraSmall'} />
              <TouchableOpacity style={style.touchable} onPress={changePO} />
              <BSearchBar
                placeholder="Cari PO"
                activeOutlineColor="gray"
                left={<TextInput.Icon icon="magnify" />}
              />
            </>
          )}
        </View>
      </>
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
  fontw600: {
    fontFamily: fonts.family.montserrat[600],
  },
  summContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    start: 0,
    backgroundColor: 'white',
    paddingTop: layout.pad.lg,
    paddingBottom: layout.pad.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
