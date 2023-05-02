import * as React from 'react';
import {
  BButtonPrimary,
  BNestedProductCard,
  BSearchBar,
  BSpacer,
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
import { CAMERA, CREATE_DEPOSIT } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import { useDispatch } from 'react-redux';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import SelectPurchaseOrderData from '@/components/templates/SelectPurchaseOrder';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepOne: stateOne } = values;
  const { updateValueOnstep, updateValue } = action;
  const [expandData, setExpandData] = React.useState<any[]>([]);
  const dispatch = useDispatch();

  const listenerSearchCallback = React.useCallback(
    ({ parent, data }: { parent: any; data: any }) => {
      updateValueOnstep('stepOne', 'companyName', parent.companyName);
      updateValueOnstep('stepOne', 'locationName', parent.locationName);
      updateValue('existingProjectID', parent.projectId);
      updateValueOnstep('stepOne', 'purchaseOrders', data);
      updateValueOnstep(
        'stepTwo',
        'availableDeposit',
        getTotalLastDeposit(
          data && data.length > 0 && data[0]?.availableDeposit
        )
      );
      updateValueOnstep('stepTwo', 'inputtedVolume', 0);
      updateValueOnstep(
        'stepTwo',
        'salesOrder',
        data &&
          data.length > 0 &&
          data[0]?.SaleOrders &&
          data[0]?.SaleOrders.length > 0 &&
          data[0]?.SaleOrders[0]
      );
      updateValue('isSearchingPurchaseOrder', false);
    },
    [updateValueOnstep]
  );

  const onExpand = (index: number, data: any) => {
    let newExpandsetExpandData;
    const isExisted = expandData?.findIndex((val) => val?.id === data?.id);
    if (isExisted === -1) {
      newExpandsetExpandData = [...expandData, data];
    } else {
      newExpandsetExpandData = expandData.filter((val) => val?.id !== data?.id);
    }
    setExpandData(newExpandsetExpandData);
  };

  const getTotalLastDeposit = (totalAmount: number | undefined) => {
    let total: number = 0;
    if (totalAmount) {
      total = totalAmount;
    } else {
      if (stateOne?.purchaseOrders && stateOne?.purchaseOrders.length > 0) {
        stateOne?.purchaseOrders?.forEach((it) => {
          total = it.availableDeposit;
        });
      }
    }
    return total;
  };

  return (
    <SafeAreaView style={style.flexFull}>
      {stateOne?.purchaseOrders && stateOne?.purchaseOrders.length > 0 ? (
        <>
          <ScrollView style={style.flexFull}>
            <View style={style.flexFull}>
              <BSpacer size={'extraSmall'} />
              <BVisitationCard
                item={{
                  name: stateOne?.companyName,
                  location: stateOne?.locationName,
                }}
                isRenderIcon={false}
              />
            </View>
            <View style={style.flexFull}>
              {stateOne?.purchaseOrders &&
                stateOne?.purchaseOrders.length > 0 && (
                  <BNestedProductCard
                    withoutHeader={false}
                    data={stateOne?.purchaseOrders}
                    onExpand={onExpand}
                    expandData={expandData}
                    withoutSeparator
                  />
                )}
            </View>
            <View style={style.summaryContainer}>
              <Text style={style.summary}>Sisa Deposit</Text>
              <Text
                style={[
                  style.summary,
                  {
                    fontFamily: fonts.family.montserrat[600],
                    fontSize: fonts.size.lg,
                  },
                ]}
              >
                {formatCurrency(getTotalLastDeposit(undefined))}
              </Text>
            </View>
            <BSpacer size={'small'} />
            <View style={style.summaryContainer}>
              <Text style={[style.summary, { color: colors.text.medium }]}>
                Ada Deposit Baru?
              </Text>
              <BButtonPrimary
                titleStyle={[style.fontw400, { fontSize: fonts.size.md }]}
                title="Buat Deposit"
                isOutline
                onPress={() => {
                  dispatch(resetImageURLS({ source: CREATE_DEPOSIT }));
                  navigation.goBack();
                  navigation.navigate(CAMERA, {
                    photoTitle: 'Bukti',
                    navigateTo: CREATE_DEPOSIT,
                    closeButton: true,
                    disabledDocPicker: false,
                    disabledGalleryPicker: false,
                  });
                }}
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <View style={{ flex: 1 }}>
            {values.isSearchingPurchaseOrder ? (
              <SelectPurchaseOrderData
                dataToGet="SCHEDULEDATA"
                onSubmitData={({ parentData, data }) =>
                  listenerSearchCallback({ parent: parentData, data: data })
                }
                onDismiss={() => updateValue('isSearchingPurchaseOrder', false)}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={style.touchable}
                  onPress={() => updateValue('isSearchingPurchaseOrder', true)}
                />
                <BSearchBar
                  placeholder="Cari PT / Proyek"
                  disabled
                  activeOutlineColor="gray"
                  left={
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      icon="magnify"
                    />
                  }
                />
              </>
            )}
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
    borderRadius: layout.radius.sm,
    height: resScale(45),
    zIndex: 2,
  },
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
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
