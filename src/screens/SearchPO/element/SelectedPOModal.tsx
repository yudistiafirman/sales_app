import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as React from 'react';
import Modal from 'react-native-modal';
import { BContainer, BNestedProductCard, BSpacer } from '@/components';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BButtonPrimary } from '@/components';
import POListCard from '@/components/templates/PO/POListCard';

type SelectedPOModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  onPressCompleted: (data: any) => void;
};

export default function SelectedPOModal({
  isModalVisible,
  setIsModalVisible,
  data,
  onPressCompleted,
}: SelectedPOModalType) {
  const [selectedPO, setSelectedPO] = React.useState(undefined);
  const [scrollOffSet, setScrollOffSet] = React.useState<number | undefined>(
    undefined
  );

  const onValueChanged = (item: any, value: boolean) => {
    if (value) setSelectedPO(item);
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={() => {
        setIsModalVisible((curr) => !curr);
      }}
      style={style.modal}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(350) - resScale(190)}
      propagateSwipe={true}
    >
      <View style={style.modalContent}>
        <BContainer>
          <View style={style.container}>
            <View>
              <View style={style.modalHeader}>
                <Text style={style.headerText}>Pilih PO</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible((curr) => !curr)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={25}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ height: resScale(250) }}>
                <ScrollView
                  onScroll={(event) => {
                    setScrollOffSet(event.nativeEvent.contentOffset.y);
                  }}
                >
                  <POListCard
                    companyName={data.companyName}
                    locationName={data.locationName}
                  />
                  <BSpacer size={'extraSmall'} />
                  {data?.sphs && data?.sphs.length > 0 && (
                    <BNestedProductCard
                      withoutHeader={false}
                      data={data?.sphs}
                      onValueChange={onValueChanged}
                    />
                  )}
                </ScrollView>
              </View>

              <BButtonPrimary
                title="Simpan"
                onPress={() => {
                  setIsModalVisible((curr) => !curr);
                  onPressCompleted(selectedPO);
                }}
              />
            </View>
          </View>
        </BContainer>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    justifyContent: 'space-between',
    height: resScale(300),
  },
  modalContent: {
    backgroundColor: 'white',
    height: resScale(350),
    borderTopLeftRadius: layout.radius.lg,
    borderTopRightRadius: layout.radius.lg,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
  tambahPicContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tambahPicText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
  },
  loadingShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
});
