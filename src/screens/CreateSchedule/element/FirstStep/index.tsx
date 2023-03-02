import * as React from 'react';
import {
  BButtonPrimary,
  BGalleryDeposit,
  BNestedProductCard,
  BSearchBar,
  BSpacer,
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
import { CAMERA, CREATE_SCHEDULE, SEARCH_PO } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';
import { colors, fonts } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import AddedDepositModal from '../AddedDepositModal';
import { useDispatch } from 'react-redux';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepOne: state } = values;
  const { updateValueOnstep } = action;
  const [selectedPO, setSelectedPO] = React.useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const listenerSearchCallback = React.useCallback(
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

  const listenerCameraCallback = React.useCallback(() => {
    setIsModalVisible(true);
  }, []);

  React.useEffect(() => {
    DeviceEventEmitter.addListener('SearchPO.data', listenerSearchCallback);
    DeviceEventEmitter.addListener(
      'Camera.addedDeposit',
      listenerCameraCallback
    );
    return () => {
      DeviceEventEmitter.removeAllListeners('SearchPO.data');
      DeviceEventEmitter.removeAllListeners('Camera.addedDeposit');
    };
  }, [listenerSearchCallback, listenerCameraCallback]);

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

  const addNewDeposit = (data: any) => {
    let added = [];
    if (state.addedDeposit && state.addedDeposit.length > 0)
      added = state.addedDeposit;
    added.push(data);
    updateValueOnstep('stepOne', 'addedDeposit', added);

    let lastDeposit = 0;
    if (state.lastDeposit?.nominal) lastDeposit = state.lastDeposit?.nominal;
    let addedDeposit = 0;
    if (added && added.length > 0)
      addedDeposit = added
        .map((it) => it.nominal)
        .reduce((prev, next) => prev + next);

    updateValueOnstep('stepTwo', 'totalDeposit', lastDeposit + addedDeposit);
  };

  const { sphs, companyName, locationName, lastDeposit, addedDeposit } = state;

  return (
    <SafeAreaView style={style.flexFull}>
      {sphs && sphs.length > 0 ? (
        <>
          <ScrollView style={style.flexFull}>
            <View style={style.flexFull}>
              <BSpacer size={'extraSmall'} />
              <BVisitationCard
                item={{ name: companyName, location: locationName }}
                isRenderIcon={false}
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
              <Text
                style={[
                  style.summary,
                  {
                    fontFamily: fonts.family.montserrat[600],
                    fontSize: fonts.size.lg,
                  },
                ]}
              >
                {lastDeposit && lastDeposit?.nominal
                  ? formatCurrency(lastDeposit?.nominal)
                  : 'IDR 0'}
              </Text>
            </View>
            <BSpacer size={'medium'} />
            {addedDeposit &&
              addedDeposit.length > 0 &&
              addedDeposit?.map((item, index) => {
                return (
                  <BGalleryDeposit
                    key={index.toString()}
                    nominal={item?.nominal}
                    createdAt={item?.createdAt}
                    picts={item?.picts}
                  />
                );
              })}
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
                  dispatch(resetImageURLS({ source: CREATE_SCHEDULE }));
                  navigation.navigate(CAMERA, {
                    photoTitle: 'Bukti',
                    navigateTo: CREATE_SCHEDULE,
                    closeButton: true,
                  });
                }}
              />
            </View>
            <AddedDepositModal
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              setCompletedData={addNewDeposit}
            />
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
