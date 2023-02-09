import { BText, BHeaderIcon, BButtonPrimary, BSpacer } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import BCommonCompanyCard from '../molecules/BCommonCompanyCard';
import BExpandableSphCard from '../molecules/BExpandableSPHCard';
import { CompanyData, SPH } from '../organism/BCommonCompanyList';
const { height } = Dimensions.get('window');

interface ChoosePOModalProps {
  companyData: CompanyData;
  onChoose: (choosenData: CompanyData) => void;
  isVisible: boolean;
  onCloseModal: () => void;
}

const ChoosePOModal = ({
  onChoose,
  isVisible,
  companyData,
  onCloseModal,
}: ChoosePOModalProps) => {
  const [localCompanyData, setLocalCompanyData] = useState<
    CompanyData | undefined
  >();
  useEffect(() => {
    setLocalCompanyData(companyData);
  }, [companyData]);
  const onChecked = useCallback(
    (index: number) => {
      const newSphData =
        localCompanyData?.sph &&
        localCompanyData?.sph.map((val, idx) => {
          return {
            ...val,
            checked: idx === index,
          };
        });
      setLocalCompanyData((prevState: any) => ({
        ...prevState,
        sph: newSphData,
      }));
    },
    [localCompanyData?.sph]
  );

  const onChooseSphData = () => {
    const choosenSphData =
      localCompanyData?.sph && localCompanyData?.sph.filter((v) => v.checked);
    if (
      (choosenSphData && choosenSphData?.length > 0) ||
      localCompanyData?.sph?.length === 1
    ) {
      const newCompanyData = {
        name: localCompanyData?.name,
        location: localCompanyData?.location,
        paymentType: localCompanyData?.paymentType,
        sph:
          localCompanyData?.sph?.length === 1
            ? [{ ...localCompanyData?.sph[0], checked: true }]
            : choosenSphData,
      };
      onChoose(newCompanyData);
    } else {
      Alert.alert('Pilih salah satu SPH');
    }
  };
  const renderItem: ListRenderItem<SPH> = useCallback(
    ({ item, index }) => {
      return (
        <BExpandableSphCard
          sphNo={item.no}
          totalPrice={item.totalPrice}
          productsData={item.productsData}
          index={index}
          checked={
            localCompanyData?.sph && localCompanyData?.sph?.length > 1
              ? item.checked
              : true
          }
          onChecked={onChecked}
        />
      );
    },
    [localCompanyData?.sph, onChecked]
  );
  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };
  return (
    <Modal
      deviceHeight={height}
      isVisible={isVisible}
      style={styles.modalContainer}
    >
      <View style={[styles.contentOuterContainer, { height: height / 1.6 }]}>
        <View style={styles.contentInnerContainer}>
          <View style={styles.headerContainer}>
            <BText style={styles.headerTitle}>Pilih PO</BText>
            <BHeaderIcon
              onBack={onCloseModal}
              size={layout.pad.lg}
              marginRight={0}
              iconName="x"
            />
          </View>
          <BSpacer size="extraSmall" />
          <BCommonCompanyCard
            name={localCompanyData?.name}
            location={localCompanyData?.location}
          />
          <BSpacer size="extraSmall" />
          <FlatList
            data={localCompanyData?.sph}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={renderItemSeparator}
          />
          <BSpacer size="extraSmall" />
          <BButtonPrimary
            buttonStyle={styles.chooseBtn}
            onPress={onChooseSphData}
            title="Pilih"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { margin: 0, justifyContent: 'flex-end' },
  contentOuterContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: layout.radius.lg,
    borderTopEndRadius: layout.radius.lg,
  },
  contentInnerContainer: { flex: 1, padding: layout.pad.lg },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: font.family.montserrat['700'],
    fontSize: font.size.lg,
  },
  chooseBtn: {
    width: '100%',
  },
  customerCard: {
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
  },
  topCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bottomCard: {
    overflow: 'hidden',
  },
});

export default ChoosePOModal;
