import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
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
import { beautifyPhoneNumber } from '@/utils/generalFunc';
import moment from 'moment';
import { LOCATION, TRANSACTION_DETAIL } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { getVisitationOrderByID } from '@/actions/OrderActions';
import { QuotationRequests } from '@/interfaces/CreatePurchaseOrder';
import { PO_METHOD_LIST } from '@/constants/dropdown';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNPrint from 'react-native-print';
import { resScale } from '@/utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

function ListProduct(
  item: any,
  index: number,
  selectedType: string,
  quantity: number | undefined,
  isPoData: boolean
) {
  let displayName = '';
  if (item.ReqProduct) {
    displayName = `${
      item?.ReqProduct?.product?.category?.parent
        ? item?.ReqProduct?.product?.category?.parent?.name + ' '
        : ''
    }${item?.ReqProduct?.product?.displayName} ${
      item?.ReqProduct?.product?.category
        ? item?.ReqProduct?.product?.category?.name
        : ''
    }`;
  } else if (item.Product) {
    displayName = `${
      item?.Product?.category?.parent?.name
        ? item?.Product?.category?.parent?.name + ' '
        : item?.Product?.category?.parent?.na
        ? item?.Product?.category?.parent?.na + ' '
        : ''
    }${item?.Product?.displayName} ${
      item?.Product?.category ? item?.Product?.category?.name : ''
    }`;
  } else {
    displayName = `${
      item?.category?.parent ? item?.category?.parent?.name + ' ' : ''
    }${item?.displayName} ${item?.category ? item?.category?.name : ''}`;
  }

  return (
    <View key={index}>
      <BProductCard
        name={displayName}
        pricePerVol={
          item.ReqProduct
            ? item.ReqProduct?.offeringPrice
            : item.offering_price
            ? item.offering_price
            : item.offeringPrice
        }
        volume={
          quantity
            ? quantity
            : item.requestedQuantity
            ? item.requestedQuantity
            : item.quantity
            ? item.quantity
            : 0
        }
        totalPrice={
          isPoData
            ? item.requestedQuantity * item.ReqProduct.offeringPrice
            : item.ReqProduct
            ? item.ReqProduct?.totalPrice
            : item.total_price
            ? item.total_price
            : item.totalPrice
        }
        unit={
          item.ReqProduct?.product ? item.ReqProduct?.product.unit : item.unit
        }
        hideTotal={
          selectedType !== 'Jadwal' && selectedType !== 'DO' ? false : true
        }
        hidePricePerVolume={
          selectedType !== 'Jadwal' && selectedType !== 'DO' ? false : true
        }
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
  const dispatch = useDispatch<AppDispatch>();
  const [expandData, setExpandData] = React.useState<any[]>([]);
  const [sphFiles, setSphFiles] = React.useState<any>(null);

  useHeaderTitleChanged({
    title: route?.params?.title ? route?.params?.title : '-',
  });

  React.useEffect(() => {
    crashlytics().log(TRANSACTION_DETAIL);
  }, []);

  React.useEffect(() => {
    if (data?.QuotationLetterFiles) {
      setSphFiles({
        pos: data?.QuotationLetterFiles?.find((v: any) => v?.type == 'POS'),
        letter: data?.QuotationLetterFiles?.find(
          (v: any) => v?.type == 'LETTER'
        ),
      });
    }
  }, [data]);

  const onPressLocation = (lat: number, lon: number) => {
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
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText:
            error.message ||
            'Terjadi error saat perpindahan screen menuju ke halaman sph',
          outsideClickClosePopUp: true,
        })
      );
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

  type downloadType = {
    url?: string;
    title?: string;
    downloadPopup: () => void;
    downloadError: (errorMessage: string | unknown) => void;
  };

  function downloadPdf({
    url,
    title,
    downloadPopup,
    downloadError,
  }: downloadType) {
    if (!url) return null;
    let dirs = ReactNativeBlobUtil.fs.dirs;
    const downloadTitle = title
      ? `${title} berhasil di download`
      : 'PDF sph berhasil di download';
    ReactNativeBlobUtil.config(
      Platform.OS === 'android'
        ? {
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache: true,
            path: dirs.DocumentDir,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              title: downloadTitle,
              description: 'SPH PDF',
              mediaScannable: true,
            },
          }
        : { fileCache: true }
    )
      .fetch('GET', url, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        downloadPopup();
      })
      .catch((err) => {
        downloadError(err.message);
      });
  }
  async function printRemotePDF(
    url?: string,
    printError: (errorMessage: string | unknown) => void
  ) {
    try {
      if (!url) {
        throw 'error url missing';
      }
      await RNPrint.print({
        filePath: url,
      });
    } catch (error) {
      printError(error.message);
    }
  }
  const shareFunc = async (url?: string) => {
    try {
      if (!url) throw 'no url';
      await Share.share({
        url: url.replace(/\s/g, '%20'),
        message: `Link PDF SPH ${
          data?.Company?.name ? data?.Company.name : data?.Pic?.name
        }, ${url.replace(/\s/g, '%20')}`,
      });
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message || 'Terjadi error saat share Link PDF SPH',
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  const renderRequestedProducts = () => {
    const productData = data?.QuotationRequest?.RequestedProducts
      ? data?.QuotationRequest?.RequestedProducts
      : data?.PoProducts
      ? data?.PoProducts
      : data?.SaleOrder?.PoProduct?.RequestedProduct
      ? data?.SaleOrder?.PoProduct?.RequestedProduct
      : data?.Schedule?.SaleOrder?.PoProduct?.RequestedProduct;

    if (productData?.length > 0) {
      return productData.map((item, index) =>
        ListProduct(
          item,
          index,
          selectedType,
          (selectedType === 'PO' || selectedType === 'SO')
            ? data?.requestedQuantity
            : data?.quantity
            ? data?.quantity
            : data?.Schedule?.quantity,
          data?.PoProducts?.length > 0
        )
      );
    } else {
      return ListProduct(
        productData,
        0,
        selectedType,
        productData.quantity,
        false
      );
    }
  };

  const renderProductList = () => {
    if (
      data?.QuotationRequest?.RequestedProducts ||
      data?.PoProducts ||
      data?.SaleOrder?.PoProduct?.RequestedProduct ||
      data?.Schedule?.SaleOrder?.PoProduct?.RequestedProduct
    ) {
      return (
        <>
          <Text style={styles.partText}>Produk</Text>
          <BSpacer size={'extraSmall'} />
          {renderRequestedProducts()}
          <BSpacer size={'small'} />
        </>
      );
    }
  };
  const renderPic = () => {
    if (data?.project?.Pic || data?.QuotationRequest?.project?.Pic) {
      return (
        <>
          <Text style={styles.partText}>PIC</Text>
          <BSpacer size={'extraSmall'} />
          <BPic
            name={
              data?.project?.Pic?.name ||
              data?.QuotationRequest?.project?.Pic?.name
            }
            position={
              data?.project?.Pic?.position ||
              data?.QuotationRequest?.project?.Pic?.position
            }
            phone={beautifyPhoneNumber(
              data?.project?.Pic?.phone ||
                data?.QuotationRequest?.project?.Pic?.phone
            )}
            email={
              data?.project?.Pic?.email ||
              data?.QuotationRequest?.project?.Pic?.email
            }
          />
          <BSpacer size={'small'} />
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {(data?.project?.LocationAddress ||
          data?.project?.ShippingAddress ||
          data?.QuotationRequest?.project?.LocationAddress ||
          data?.QuotationRequest?.project?.ShippingAddress) && (
          <BCompanyMapCard
            onPressLocation={() =>
              onPressLocation(
                data?.QuotationRequest?.project?.ShippingAddress
                  ? data?.QuotationRequest?.project?.ShippingAddress.lat
                  : data?.project?.ShippingAddress
                  ? data?.project?.ShippingAddress.lat
                  : null,
                data?.QuotationRequest?.project?.ShippingAddress.lon
                  ? data?.QuotationRequest?.project?.ShippingAddress.lon
                  : data?.project?.ShippingAddress
                  ? data?.project?.ShippingAddress.lon
                  : null
              )
            }
            disabled={
              data?.project?.ShippingAddress?.lat === null ||
              data?.project?.ShippingAddress?.lon === null ||
              data?.QuotationRequest?.project?.ShippingAddress.lat === null ||
              data?.QuotationRequest?.project?.ShippingAddress.lon === null
            }
            companyName={
              data?.project?.displayName ||
              data?.QuotationRequest?.project?.displayName
            }
            location={
              data?.QuotationRequest?.project?.ShippingAddress.line1
                ? data?.QuotationRequest?.project?.ShippingAddress.line1
                : data?.project?.ShippingAddress.line1
                ? data?.project?.ShippingAddress.line1
                : '-'
            }
          />
        )}
        <View style={styles.contentDetail}>
          {renderPic()}
          <Text style={styles.partText}>Rincian</Text>
          <BSpacer size={'extraSmall'} />
          <BProjectDetailCard
            status={data?.status || data?.QuotationRequest?.status}
            paymentMethod={
              selectedType === 'SPH' || selectedType === 'PO' || selectedType === 'SO'
                ? !data?.paymentType && !data?.QuotationRequest?.paymentType
                  ? 'N/A'
                  : data?.paymentType === 'CBD' ||
                    data?.QuotationRequest?.paymentType === 'CBD'
                  ? 'Cash'
                  : 'Debit'
                : undefined
            }
            expiredDate={
              data?.expiredDate || data?.expiryDate
                ? moment(data?.expiredDate || data?.expiryDate).format(
                    'DD MMMM yyyy'
                  )
                : '-'
            }
            projectName={
              selectedType === 'SPH' || selectedType === 'PO' || selectedType === 'SO'
                ? data?.project?.projectName ||
                  data?.QuotationRequest?.project?.projectName
                : undefined
            }
            productionTime={
              selectedType === 'DO'
                ? data?.date
                  ? moment(data?.date).format('DD MMM yyyy HH:mm')
                  : '-'
                : data?.createdAt
                ? moment(data?.createdAt).format('DD MMM yyyy HH:mm')
                : '-'
            }
            quotation={
              (selectedType === 'PO' || selectedType === 'SO') ? data?.QuotationLetter : undefined
            }
            nominal={data?.value}
            paymentDate={
              data?.datePayment
                ? moment(data?.datePayment).format('DD MMM yyyy')
                : undefined
            }
            deliveryDate={
              selectedType === 'Jadwal' && data?.date
                ? moment(data?.date).format('DD MMM yyyy')
                : undefined
            }
            deliveryTime={
              selectedType === 'Jadwal' && data?.date
                ? moment(data?.date).format('HH:mm')
                : undefined
            }
            scheduleMethod={
              data?.withPump !== undefined
                ? data?.withPump === true
                  ? PO_METHOD_LIST[0].label
                  : PO_METHOD_LIST[1].label
                : undefined
            }
            gotoSPHPage={() => gotoSPHPage()}
            tmNumber={
              selectedType === 'DO'
                ? data?.tmNumber
                  ? data?.tmNumber
                  : '-'
                : undefined
            }
            driverName={
              selectedType === 'DO'
                ? data?.driverName
                  ? data?.driverName
                  : '-'
                : undefined
            }
            useBEStatus={selectedType === 'SPH' ? false : true}
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
            <>{renderProductList()}</>
          )}
          {(selectedType === 'Deposit' || selectedType === 'Jadwal') && (
            <>
              <BDivider />
              <BSpacer size={'small'} />
              <BDepositCard
                firstSectionText={
                  selectedType === 'Jadwal' ? 'Deposit' : 'Deposit Awal'
                }
                firstSectionValue={
                  selectedType === 'Jadwal'
                    ? data.SaleOrder?.availableDeposit
                      ? data.SaleOrder?.availableDeposit
                      : 0
                    : data?.PurchaseOrder?.totalDeposit
                    ? data?.PurchaseOrder?.totalDeposit
                    : 0
                }
                secondSectionText={
                  selectedType === 'Jadwal'
                    ? data?.products && data?.products.length > 0
                      ? data?.products[0].displayName
                      : '-'
                    : 'Tambahan Deposit'
                }
                secondSectionValue={
                  selectedType === 'Jadwal'
                    ? data?.products && data?.products.length > 0
                      ? data?.products[0].totalPrice
                      : 0
                    : data?.value
                    ? data?.value
                    : 0
                }
                thirdSectionText={
                  selectedType === 'Jadwal'
                    ? 'Est. Sisa Deposit'
                    : 'Deposit Akhir'
                }
                isSum={selectedType === 'Jadwal' ? false : true}
              />
            </>
          )}
        </View>
        {sphFiles && (
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() =>
                printRemotePDF(
                  sphFiles?.pos?.File?.url,
                  (errorMessage: string | unknown) => {
                    dispatch(
                      openPopUp({
                        popUpText: errorMessage || 'Gagal print SPH',
                        popUpType: 'error',
                        outsideClickClosePopUp: true,
                      })
                    );
                  }
                )
              }
            >
              <MaterialCommunityIcons
                name="printer"
                size={resScale(25)}
                color={colors.primary}
              />
              <Text style={styles.footerButtonText}>Print</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => shareFunc(sphFiles?.letter?.File?.url)}
            >
              <MaterialCommunityIcons
                name="share-variant-outline"
                size={resScale(25)}
                color={colors.primary}
              />
              <Text style={styles.footerButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() =>
                downloadPdf({
                  url: sphFiles?.letter?.File?.url,
                  title: data?.number,
                  downloadPopup: () => {
                    dispatch(
                      openPopUp({
                        popUpText: 'Berhasil mendownload SPH',
                        popUpType: 'success',
                        outsideClickClosePopUp: true,
                      })
                    );
                  },
                  downloadError: (err) => {
                    dispatch(
                      openPopUp({
                        popUpText: err || 'Gagal mendownload SPH',
                        popUpType: 'error',
                        outsideClickClosePopUp: true,
                      })
                    );
                  },
                })
              }
            >
              <Feather
                name="download"
                size={resScale(25)}
                color={colors.primary}
              />
              <Text style={styles.footerButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: layout.mainPad,
    borderTopColor: colors.border,
    borderTopWidth: resScale(0.5),
    // flex: 1,
    // backgroundColor: "blue"
  },
  footerButton: {
    flex: 0.3,
    alignItems: 'center',
  },
  footerButtonText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
  },
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
