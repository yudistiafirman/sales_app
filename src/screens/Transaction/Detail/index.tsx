import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BDivider,
  BPic,
  BProductCard,
  BSpacer,
  BCompanyMapCard,
  BProjectDetailCard,
  BNestedProductCard,
  BDepositCard,
} from '@/components';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { colors, fonts, layout } from '@/constants';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { ScrollView } from 'react-native-gesture-handler';
import {
  beautifyPhoneNumber,
  customLog,
  getStatusTrx,
} from '@/utils/generalFunc';
import moment from 'moment';
import { LOCATION, TRANSACTION_DETAIL } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { getVisitationOrderByID } from '@/actions/OrderActions';
import { QuotationRequests } from '@/interfaces/CreatePurchaseOrder';

function ListProduct(item: any, index: number) {
  let displayName = '';
  if (item.display_name) {
    displayName = `${
      item?.category?.Parent ? item?.category?.Parent?.name + ' ' : ''
    }${item?.display_name} ${item?.category ? item?.category?.name : ''}`;
  } else {
    displayName = `${
      item?.category?.Parent ? item?.category?.Parent?.name + ' ' : ''
    }${item?.displayName} ${item?.category ? item?.category?.name : ''}`;
  }
  return (
    <View key={index}>
      <BProductCard
        name={displayName}
        pricePerVol={
          item.offering_price ? item.offering_price : item.offeringPrice
        }
        volume={item.quantity ? item.quantity : 0}
        totalPrice={item.total_price ? item.total_price : item.totalPrice}
        unit={item.unit}
      />
      <BSpacer size={'extraSmall'} />
    </View>
  );
}

const TransactionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const data = route?.params?.data;
  const selectedType = route?.params?.type;
  const [expandData, setExpandData] = React.useState<any[]>([]);

  useHeaderTitleChanged({
    title: route?.params?.title,
  });

  React.useEffect(() => {
    crashlytics().log(TRANSACTION_DETAIL);
  }, []);

  const onPressLocation = (lat: number, lon: number) => {
    customLog('kann', lat, lon);
    navigation.navigate(LOCATION, {
      coordinate: {
        latitude: Number(lat), // -6.1993922
        longitude: Number(lon), // 106.7626047
      },
      isReadOnly: true,
      from: TRANSACTION_DETAIL,
    });
  };

  const gotoSPHPage = async () => {
    try {
      let getData;
      getData = await getVisitationOrderByID(data.QuotationLetter.id);
      getData = getData.data.data;
      navigation.dispatch(
        StackActions.replace(TRANSACTION_DETAIL, {
          title: getData ? getData.number : 'N/A',
          data: getData,
          type: selectedType,
        })
      );
    } catch (error) {
      customLog(error);
    }
  };

  const arrayQuotationLetter = () => {
    let arrayQuote: QuotationRequests[] = [];
    arrayQuote.push(data?.QuotationLetter?.QuotationRequest);
    return arrayQuote;
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

  return (
    <SafeAreaView style={styles.parent}>
      <ScrollView>
        {(data?.address || data?.project?.LocationAddress) && (
          <BCompanyMapCard
            onPressLocation={() =>
              onPressLocation(
                data?.address
                  ? data?.address.lat
                  : data?.project?.LocationAddress
                  ? data?.project?.LocationAddress.lat
                  : null,
                data?.address
                  ? data?.address.lon
                  : data?.project?.LocationAddress
                  ? data?.project?.LocationAddress.lon
                  : null
              )
            }
            disabled={
              data?.address?.lat === null ||
              data?.address?.lon === null ||
              data?.project?.LocationAddress?.lat === null ||
              data?.project?.LocationAddress?.lon === null
            }
            companyName={
              data?.companyName
                ? data?.companyName
                : data?.project?.companyName
                ? data?.project?.companyName
                : '-'
            }
            location={
              data?.address
                ? data?.address.line1
                : data?.project?.LocationAddress
                ? data?.project?.LocationAddress.line1
                : '-'
            }
          />
        )}
        <View style={styles.contentDetail}>
          {data?.mainPic && (
            <>
              <Text style={styles.partText}>PIC</Text>
              <BSpacer size={'extraSmall'} />
              <BPic
                name={data?.mainPic.name}
                position={data?.mainPic.position}
                phone={beautifyPhoneNumber(data?.mainPic.phone)}
                email={data?.mainPic.email}
              />
              <BSpacer size={'small'} />
            </>
          )}
          <Text style={styles.partText}>Rincian</Text>
          <BSpacer size={'extraSmall'} />
          <BProjectDetailCard
            status={getStatusTrx(data?.status)}
            paymentMethod={
              selectedType === 'SPH' || selectedType === 'PO'
                ? !data?.paymentType
                  ? 'N/A'
                  : data?.paymentType === 'CBD'
                  ? 'Cash'
                  : 'Debit'
                : undefined
            }
            expiredDate={
              data?.expiredDate
                ? moment(data?.expiredDate).format('DD MMMM yyyy')
                : '-'
            }
            projectName={
              selectedType === 'SPH' || selectedType === 'PO'
                ? data?.project.name
                : undefined
            }
            productionTime={
              data?.createdAt
                ? moment(data?.createdAt).format('DD MMM yyyy HH:mm')
                : '-'
            }
            quotation={
              selectedType === 'PO' ? data?.QuotationLetter : undefined
            }
            nominal={data?.value}
            paymentDate={
              data?.datePayment
                ? moment(data?.datePayment).format('DD MMM yyyy')
                : undefined
            }
            gotoSPHPage={() => gotoSPHPage()}
          />
          <BSpacer size={'small'} />
          {selectedType === 'Deposit' ? (
            <BNestedProductCard
              withoutHeader={false}
              data={arrayQuotationLetter()}
              expandData={expandData}
              onExpand={onExpand}
              withoutSeparator
              poNumber={data?.PurchaseOrder?.number}
            />
          ) : (
            <>
              {data?.products && (
                <>
                  <Text style={styles.partText}>Produk</Text>
                  <BSpacer size={'extraSmall'} />
                  {data?.products.map((item, index) =>
                    ListProduct(item, index)
                  )}
                  <BSpacer size={'small'} />
                </>
              )}
            </>
          )}
          {selectedType === 'Deposit' && (
            <>
              <BDivider />
              <BSpacer size={'small'} />
              <BDepositCard
                firstSectionText={'Deposit Awal'}
                firstSectionValue={
                  data?.PurchaseOrder?.totalDeposit
                    ? data?.PurchaseOrder?.totalDeposit
                    : 0
                }
                secondSectionText={'Tambahan Deposit'}
                secondSectionValue={data?.value ? data?.value : 0}
                thirdSectionText={'Deposit Akhir'}
                isSum
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  leftSide: {
    flex: 1,
  },
  icon: {
    alignSelf: 'center',
  },
  containerLastOrder: {
    padding: layout.pad.lg,
    borderRadius: layout.radius.md,
    backgroundColor: colors.tertiary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  titleLastOrder: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  valueLastOrder: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.sm,
    marginLeft: layout.pad.xl,
  },
  contentDetail: {
    padding: layout.mainPad,
    flex: 1,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
});

export default TransactionDetail;
