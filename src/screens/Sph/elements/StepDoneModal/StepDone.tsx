import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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

type StepDoneType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  //   openAddPic: () => void;
  //   selectPic?: () => void;
};

function Separator() {
  return <BSpacer size={'extraSmall'} />;
}

export default function StepDone({
  isModalVisible,
  setIsModalVisible,
}: StepDoneType) {
  const [sphState] = useContext(SphContext);

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
          <TouchableOpacity onPress={() => setIsModalVisible((curr) => !curr)}>
            <MaterialCommunityIcons
              name="close"
              size={resScale(25)}
              color="#000000"
            />
          </TouchableOpacity>
          <View style={styles.modalTitle}>
            <Text style={styles.headerText} numberOfLines={1}>
              SPH/BRIK/2022/11/00254
            </Text>
          </View>
        </View>
        <View style={styles.modalContent}>
          <LabelSuccess />
          <BCompanyMapCard location={sphState?.billingAddress.fullAddress} />
          <View style={styles.contentDetail}>
            <Text style={styles.partText}>PIC</Text>
            <BSpacer size={'extraSmall'} />
            <BPic />
            <BSpacer size={'extraSmall'} />
            <Text style={styles.partText}>Rincian</Text>
            <BSpacer size={'extraSmall'} />
            <BProjectDetailCard />
            <BSpacer size={'extraSmall'} />
            <Text style={styles.partText}>Rincian</Text>
            <BSpacer size={'extraSmall'} />
            <FlatList
              renderItem={({ item }) => {
                return (
                  <BProductCard
                    key={item.id}
                    name={item.product.name}
                    pricePerVol={+item.sellPrice}
                    volume={+item.volume}
                    totalPrice={+item.sellPrice * +item.volume}
                  />
                );
              }}
              data={sphState?.chosenProducts}
              keyExtractor={(item) => item.id}
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
            <Text>Print</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setIsModalVisible((curr) => !curr)}
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={resScale(25)}
              color={colors.primary}
            />
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setIsModalVisible((curr) => !curr)}
          >
            <Feather
              name="download"
              size={resScale(25)}
              color={colors.primary}
            />
            <Text>Download</Text>
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
});
