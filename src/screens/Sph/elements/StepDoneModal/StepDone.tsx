import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
  Platform,
  Linking,
} from 'react-native';
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { resScale } from '@/utils';
import LabelSuccess from './elements/LabelSuccess';
import {
  BPic,
  BProductCard,
  BSpacer,
  BCompanyMapCard,
  BProjectDetailCard,
} from '@/components';
import { SphContext } from '../context/SphContext';
import { postSphResponseType } from '@/interfaces';
import { useNavigation } from '@react-navigation/native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import RNPrint from 'react-native-print';
import { useDispatch } from 'react-redux';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { customLog } from '@/utils/generalFunc';

type StepDoneType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  //   openAddPic: () => void;
  //   selectPic?: () => void;
  sphResponse: postSphResponseType | null;
};
const paymentMethod: {
  CBD: 'Cash';
  CREDIT: 'Credit';
  '': '-';
} = {
  CBD: 'Cash',
  CREDIT: 'Credit',
  '': '-',
};

type downloadType = {
  url?: string;
  title?: string;
  downloadPopup: () => void;
};

function Separator() {
  return <BSpacer size={'extraSmall'} />;
}

function downloadPdf({ url, title, downloadPopup }: downloadType) {
  if (!url) return null;
  let dirs = ReactNativeBlobUtil.fs.dirs;
  const downloadTitle = title
    ? `${title} berhasil di download`
    : 'PDF sph berhasil di download';
  ReactNativeBlobUtil.config({
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
  })
    .fetch('GET', url, {
      //some headers ..
    })
    .then((res) => {
      // the temp file path
      downloadPopup();
      customLog('The file saved to ', res.path());
    })
    .catch((err) => {
      customLog(err, 'error download', url);
    });
}
async function printRemotePDF(url?: string) {
  try {
    if (!url) {
      throw 'error url missing';
    }
    await RNPrint.print({
      filePath: url,
    });
  } catch (error) {
    customLog(error, 'error print');
  }
}

const openAddressOnMap = (label, lat, lng) => {
  const scheme = Platform.select({
    ios: 'maps:0,0?q=',
    android: 'geo:0,0?q=',
  });
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });
  Linking.openURL(url);
};

export default function StepDone({
  isModalVisible,
  setIsModalVisible,
  sphResponse,
}: StepDoneType) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [sphState] = useContext(SphContext);
  const stateCompanyName = sphState.selectedCompany?.Company?.name
    ? sphState.selectedCompany?.Company.name
    : sphState.selectedPic?.name;

  // const locationState = sphState?.billingAddress.addressAutoComplete
  //   ?.formattedAddress
  //   ? sphState?.billingAddress.addressAutoComplete.formattedAddress
  //   : sphState.selectedCompany?.locationAddress.line1;
  const locationState = sphState.isBillingAddressSame
    ? sphState.selectedCompany?.locationAddress.line1
    : sphState?.billingAddress.addressAutoComplete.formattedAddress;
  const locationObj = sphState.isBillingAddressSame
    ? sphState.selectedCompany
    : sphState?.billingAddress.addressAutoComplete;

  const shareFunc = async (url?: string) => {
    try {
      if (!url) throw 'no url';
      await Share.share({
        url: url.replace(/\s/g, '%20'),
        message: `Link PDF SPH ${stateCompanyName}, ${url.replace(
          /\s/g,
          '%20'
        )}`,
      });
    } catch (error) {
      customLog(error, 'errorsharefunc');
    }
  };

  return (
    <Modal
      backdropOpacity={1}
      backdropColor="white"
      hideModalContentWhileAnimating={true}
      coverScreen={true}
      isVisible={isModalVisible}
      style={styles.modal}
    >
      <View style={styles.modalStyle}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              setIsModalVisible((curr) => !curr);
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={resScale(25)}
              color="#000000"
            />
          </TouchableOpacity>
          <View style={styles.modalTitle}>
            <Text style={styles.headerText} numberOfLines={1}>
              {sphResponse?.number}
            </Text>
          </View>
        </View>
        <View style={styles.modalContent}>
          <LabelSuccess sphId={sphResponse?.number} />
          <BCompanyMapCard
            companyName={stateCompanyName}
            location={locationState}
            onPressLocation={() => {
              if (locationObj && locationObj.lat && locationObj.lon) {
                openAddressOnMap(
                  stateCompanyName,
                  locationObj.lat,
                  locationObj.lon
                );
              }
            }}
          />
          <View style={styles.contentDetail}>
            <Text style={styles.partText}>PIC</Text>
            <BSpacer size={'extraSmall'} />
            <BPic {...sphState.selectedPic} />
            <BSpacer size={'extraSmall'} />
            <Text style={styles.partText}>Rincian</Text>
            <BSpacer size={'extraSmall'} />
            <BProjectDetailCard
              productionTime={sphResponse?.createdTime}
              expiredDate={sphResponse?.expiryTime}
              status={'Diterbitkan'}
              paymentMethod={paymentMethod[sphState.paymentType]}
              projectName={sphState.selectedCompany?.name}
            />
            <BSpacer size={'extraSmall'} />
            <Text style={styles.partText}>Produk</Text>
            <BSpacer size={'extraSmall'} />
            <FlatList
              renderItem={({ item }) => {
                return (
                  <BProductCard
                    name={item.product.name}
                    pricePerVol={+item.sellPrice}
                    volume={+item.volume}
                    totalPrice={+item.totalPrice}
                  />
                );
              }}
              data={sphState?.chosenProducts}
              keyExtractor={(item) => item.productId}
              ItemSeparatorComponent={Separator}
            />
          </View>
        </View>
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => printRemotePDF(sphResponse?.thermalLink)}
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
            onPress={() => shareFunc(sphResponse?.letterLink)}
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
                url: sphResponse?.letterLink,
                title: sphResponse?.number,
                downloadPopup: () => {
                  dispatch(
                    openPopUp({
                      popUpText: 'Berhasil mendownload SPH',
                      popUpType: 'success',
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { margin: 0 },
  modalStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
    paddingHorizontal: layout.pad.md,
  },
  modalTitle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'blue',
    paddingVertical: layout.mainPad,
    borderTopColor: colors.border,
    borderTopWidth: resScale(0.5),
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
  modalContent: {
    flex: 1,
    // backgroundColor: 'red',
  },
  labelSuccess: {
    backgroundColor: colors.chip.green,
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
  },
  labelText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
  },
  company: {
    backgroundColor: colors.tertiary,
    padding: layout.mainPad,
  },
  companyText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
  contentDetail: {
    padding: layout.mainPad,
    flex: 1,
  },
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 0.3,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  footerButtonText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
  },
});
