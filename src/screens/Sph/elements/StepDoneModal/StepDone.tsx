import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
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
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useNavigation } from '@react-navigation/native';

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

function Separator() {
  return <BSpacer size={'extraSmall'} />;
}

function downloadPdf(url?: string, title?: string) {
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
      console.log('The file saved to ', res.path());
    })
    .catch((err) => {
      console.log(err, 'error download', url);
    });
}

export default function StepDone({
  isModalVisible,
  setIsModalVisible,
  sphResponse,
}: StepDoneType) {
  const navigation = useNavigation();
  const [sphState] = useContext(SphContext);
  const stateCompanyName = sphState.selectedCompany?.Company?.name
    ? sphState.selectedCompany?.Company.name
    : sphState.selectedPic?.name;

  const locationState = sphState?.billingAddress.addressAutoComplete
    ?.formattedAddress
    ? sphState?.billingAddress.addressAutoComplete.formattedAddress
    : sphState.selectedCompany?.locationAddress.line1;

  const shareFunc = async (url?: string) => {
    try {
      if (!url) throw 'no url';
      await Share.share({ url: url, message: `Link PDF SPH, ${url}` });
    } catch (error) {
      console.log(error, 'errorsharefunc');
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
              status={'Diajukan'}
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
            onPress={() => setIsModalVisible((curr) => !curr)}
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
              downloadPdf(sphResponse?.letterLink, sphResponse?.number)
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
