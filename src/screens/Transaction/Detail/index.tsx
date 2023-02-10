import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
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
import { beautifyPhoneNumber, getStatusTrx } from '@/utils/generalFunc';
import moment from 'moment';

function ListProduct(item: any) {
  return (
    <View key={item.product_id}>
      <BProductCard
        name={item.display_name}
        pricePerVol={+item.offering_price}
        volume={+item.volume}
        totalPrice={+item.total_price}
      />
      <BSpacer size={'extraSmall'} />
    </View>
  );
}

const TransactionDetail = () => {
  const route = useRoute<RootStackScreenProps>();
  useHeaderTitleChanged({
    title: route?.params?.title,
  });

  const onPressLocation = () => {
    console.log('goto map location');
  };

  const data = route?.params?.data;
  console.log('wkwkw', route?.params);
  return (
    <SafeAreaView style={styles.parent}>
      <ScrollView>
        <BCompanyMapCard
          onPressLocation={onPressLocation}
          companyName={data?.companyName ? data?.companyName : '-'}
          location={data?.address ? data?.address.line1 : '-'}
        />
        <View style={styles.contentDetail}>
          {data?.mainPic && (
            <>
              <Text style={styles.partText}>PIC</Text>
              <BSpacer size={'extraSmall'} />
              <BPic
                name={data?.mainPic.name}
                position={data?.mainPic.position}
                phone={beautifyPhoneNumber(data?.mainPic.phone)}
                email={data?.mainPic.email ? data?.mainPic.email : '-'}
              />
              <BSpacer size={'small'} />
            </>
          )}
          <Text style={styles.partText}>Rincian</Text>
          <BSpacer size={'extraSmall'} />
          <BProjectDetailCard
            status={getStatusTrx(data?.status)}
            paymentMethod={
              data?.paymentType && data?.paymentType === 'CBD'
                ? 'Cash'
                : 'Debit'
            }
            expiredDate={
              data?.expiredDate
                ? moment(data?.expiredDate).format('DD MMMM yyyy')
                : '-'
            }
            projectName={data?.project.name}
            productionTime={
              data?.createdAt
                ? moment(data?.createdAt).format('DD MMM yyyy HH:mm')
                : '-'
            }
          />
          <BSpacer size={'small'} />
          {data?.lastOrder && data?.lastOrder.length > 0 ? (
            <BNestedProductCard data={data?.lastOrder} />
          ) : (
            <>
              {data?.products && (
                <>
                  <Text style={styles.partText}>Produk</Text>
                  <BSpacer size={'extraSmall'} />
                  {data?.products.map((item) => ListProduct(item))}
                  <BSpacer size={'small'} />
                </>
              )}
            </>
          )}
          {data?.deposit && (
            <>
              <BDivider />
              <BSpacer size={'small'} />
              <BDepositCard
                firstSectionText={data?.deposit.firstSection}
                firstSectionValue={data?.deposit.firstSectionValue}
                secondSectionText={data?.deposit.secondSection}
                secondSectionValue={data?.deposit.secondSectionValue}
                thirdSectionText={data?.deposit.thirdSection}
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
