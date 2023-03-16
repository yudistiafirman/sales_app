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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { resScale } from '@/utils';
import { CreateDepositContext } from '@/context/CreateDepositContext';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import formatCurrency from '@/utils/formatCurrency';
import SelectPurchaseOrderData from '@/components/templates/SelectPurchaseOrder';
import { PoProductData } from '@/interfaces/SelectConfirmedPO';

export default function SecondStep() {
  const { values, action } = React.useContext(CreateDepositContext);
  const { stepTwo: stateTwo, stepOne: stateOne } = values;
  const { updateValueOnstep, updateValue } = action;
  const [expandData, setExpandData] = React.useState<any[]>([]);

  const listenerCallback = React.useCallback(
    ({ parent, data }: { parent: any; data: any }) => {
      updateValueOnstep('stepTwo', 'companyName', parent.companyName);
      updateValueOnstep('stepTwo', 'locationName', parent.locationName);
      updateValue('existingProjectID', parent.projectID);
      updateValueOnstep('stepTwo', 'purchaseOrders', data);
      updateValue('isSearchingPurchaseOrder', false);
    },
    [updateValueOnstep]
  );

  const customAction = () => {
    return (
      <BTouchableText
        textStyle={{
          fontFamily: font.family.montserrat[500],
          color: colors.select.selected,
        }}
        onPress={() => updateValue('isSearchingPurchaseOrder', true)}
        title={'Ganti'}
      />
    );
  };

  const calculatedTotal = (): number => {
    let deposit: number = 0;
    if (stateOne?.deposit?.nominal) deposit += parseInt(stateOne?.deposit?.nominal, 10);
    deposit += getTotalLastDeposit();
    return deposit;
  };

  const onExpand = (index: number, data: any) => {
    let newExpandedData;
    const isExisted = expandData?.findIndex((val) => val?.id === data?.id);
    if (isExisted === -1) {
      newExpandedData = [...expandData, data];
    } else {
      newExpandedData = expandData.filter((val) => val?.id !== data?.id);
    }
    setExpandData(newExpandedData);
  };

  const getTotalLastDeposit = () => {
    let total: number = 0;
    if (stateTwo?.purchaseOrders && stateTwo?.purchaseOrders.length > 0) {
      stateTwo?.purchaseOrders?.forEach((it) => {
        total = it.totalDeposit;
      });
    }
    return total;
  };

  return (
    <SafeAreaView style={style.flexFull}>
      {values.isSearchingPurchaseOrder === true ? (
        <SelectPurchaseOrderData
          dataToGet="DEPOSITDATA"
          onSubmitData={({ parentData, data }) =>
            listenerCallback({ parent: parentData, data })
          }
          onDismiss={() => updateValue('isSearchingPurchaseOrder', false)}
        />
      ) : (
        <>
          {stateOne?.deposit && (
            <BGalleryDeposit
              nominal={stateOne?.deposit?.nominal}
              createdAt={stateOne?.deposit?.createdAt}
              picts={stateOne?.deposit?.picts}
            />
          )}
          <>
            <View>
              <BSpacer size={'small'} />
              <BDivider />
              <BSpacer size={'extraSmall'} />
            </View>
            <View style={style.flexFull}>
              {stateTwo?.purchaseOrders &&
              stateTwo?.purchaseOrders.length > 0 ? (
                <>
                  <ScrollView
                    style={[style.flexFull, { marginBottom: layout.pad.xxl }]}
                  >
                    <View style={style.flexFull}>
                      <BSpacer size={'extraSmall'} />
                      <BVisitationCard
                        item={{
                          name: stateTwo?.companyName,
                          location: stateTwo?.locationName,
                        }}
                        customIcon={customAction}
                      />
                      <BSpacer size={'extraSmall'} />
                    </View>
                    <View style={style.flexFull}>
                      {stateTwo?.purchaseOrders &&
                        stateTwo?.purchaseOrders.length > 0 && (
                          <BNestedProductCard
                            withoutHeader={false}
                            data={stateTwo?.purchaseOrders}
                            expandData={expandData}
                            onExpand={onExpand}
                            isDeposit
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
                  <TouchableOpacity
                    style={style.touchable}
                    onPress={() =>
                      updateValue('isSearchingPurchaseOrder', true)
                    }
                  >
                    <BSearchBar
                      placeholder="Cari PO"
                      activeOutlineColor="gray"
                      disabled
                      left={<TextInput.Icon icon="magnify" />}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
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
