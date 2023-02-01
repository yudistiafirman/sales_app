import { BTabSections } from '@/components';
import { colors, layout } from '@/constants';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import { resScale } from '@/utils';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import BottomSheetCompany from './BottomSheetCompany';
import AppointmentCustomerCard, { CustomersData } from './CustomerCard';
const { width } = Dimensions.get('window');

const SearchingCustomer = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { stepOne, searchQuery, selectedCustomerData } = values;
  const { routes } = stepOne;
  const [index, setIndex] = useState(0);

  const onPressCard = useCallback(
    (item) => {
      if (stepOne.selectedCategories === 'Perusahaan') {
        dispatchValue({
          type: AppointmentActionType.ON_PRESS_COMPANY,
          value: item,
        });
      } else {
        dispatchValue({
          type: AppointmentActionType.ON_PRESS_PROJECT,
          key: 'individu',
          value: {
            projectName: selectedCustomerData?.project[0].display_name,
            pics: selectedCustomerData?.pics,
          },
        });
      }
    },
    [
      dispatchValue,
      selectedCustomerData?.pics,
      selectedCustomerData?.project,
      stepOne.selectedCategories,
    ]
  );

  const onTabPress = ({ route }) => {
    const tabIndex = index === 0 ? 1 : 0;
    if (route.key !== routes[index].key) {
      dispatchValue({
        type: AppointmentActionType.SET_CATEGORIES,
        value: tabIndex,
      });
    }
  };

  const renderItem: ListRenderItem<CustomersData> = useCallback(
    ({ item }) => {
      return (
        <AppointmentCustomerCard
          item={item}
          display_name={item.display_name}
          searchQuery={searchQuery}
          location={item.location}
          onPress={onPressCard}
        />
      );
    },
    [onPressCard, searchQuery]
  );

  return (
    <View style={{ height: width + layout.pad.md }}>
      <BTabSections
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={() => (
          <FlatList
            data={values.customerData}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={renderItem}
          />
        )}
        onIndexChange={setIndex}
        onTabPress={onTabPress}
        tabStyle={styles.tabStyle}
        tabBarStyle={styles.tabBarStyle}
        indicatorStyle={styles.tabIndicator}
      />
      <BottomSheetCompany
        isVisible={values.isModalCompanyVisible}
        onCloseModal={() =>
          dispatchValue({ type: AppointmentActionType.TOGGLE_MODAL_COMPANY })
        }
        onChooseProject={() =>
          dispatchValue({
            type: AppointmentActionType.ON_ADD_PROJECT,
            key: 'company',
            value: {
              companyName: {
                id: values.selectedCustomerData?.id,
                title: values.selectedCustomerData?.display_name,
              },
              pics: values.selectedCustomerData?.pics,
              projectName: '',
            },
          })
        }
        onChoose={() => {
          let projectName;
          let shouldDispatch = false;
          if (selectedCustomerData?.project?.length > 1) {
            const filteredProject = selectedCustomerData?.project?.filter(
              (el) => {
                return el.isSelected;
              }
            );
            if (filteredProject?.length === 0) {
              shouldDispatch = false;
            } else {
              shouldDispatch = true;
              projectName = filteredProject[0].display_name;
            }
          } else {
            shouldDispatch = true;
            projectName = selectedCustomerData?.project[0].display_name;
          }

          if (shouldDispatch) {
            dispatchValue({
              type: AppointmentActionType.ON_ADD_PROJECT,
              key: 'company',
              value: {
                companyName: {
                  id: values.selectedCustomerData?.id,
                  title: values.selectedCustomerData?.display_name,
                },
                pics: values.selectedCustomerData?.pics,
                projectName: projectName,
              },
            });
          } else {
            Alert.alert('Ooops', 'Pilih salah satu proyek atau tambah proyek');
          }
        }}
        dataCompany={values.selectedCustomerData}
        onSelect={(_idx: number) => {
          const newSelectedProject = values.selectedCustomerData?.project?.map(
            (el, _index) => {
              return {
                ...el,
                isSelected: _idx === _index,
              };
            }
          );
          dispatchValue({
            type: AppointmentActionType.SELECT_PROJECT,
            value: newSelectedProject,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabIndicator: {
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

export default SearchingCustomer;
