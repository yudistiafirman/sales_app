import { BFlatlistItems, BTabViewScreen, BVisitationCard } from '@/components';
import { colors, layout } from '@/constants';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import React, { useCallback } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
import { selectedCompanyInterface } from '@/interfaces/index';
import { resScale } from '@/utils';

const SearchingCustomer = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery } = values;
  const { projects, isProjectLoading } = useSelector(
    (state: RootState) => state.common
  );

  const onPressCard = useCallback(
    (item: selectedCompanyInterface) => {
      const customerType = item.Company.id ? 'company' : 'individu';
      if (values.stepOne.options.items) {
        dispatchValue({
          type: AppointmentActionType.ADD_COMPANIES,
          value: [
            ...values.stepOne.options.items,
            { id: item.Company.id, title: item.Company.name },
          ],
        });
      } else {
        dispatchValue({
          type: AppointmentActionType.ADD_COMPANIES,
          value: [{ id: item.Company.id, title: item.Company.name }],
        });
      }

      const companyDataToSave = {
        Company: { id: item.Company.id, title: item.Company.name },
        PIC: item.PIC,
        Visitation: item.Visitation,
        locationAddress: item.locationAddress,
        mainPic: item.mainPic,
        id: item.id,
        name: item.name,
      };

      dispatchValue({
        type: AppointmentActionType.ON_ADD_PROJECT,
        key: customerType,
        value: companyDataToSave,
      });
    },
    [dispatchValue, values.stepOne.options.items]
  );

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        {
          tabTitle: 'Proyek',
          totalItems: projects.length,
        },
      ];
    }, [projects]);

  const sceneToRender = React.useCallback(() => {
    if (searchQuery.length <= 3) {
      return null;
    }
    return (
      <BFlatlistItems
        renderItem={(item) => {
          let picOrCompanyName = '-';
          if (item?.Company?.name) {
            picOrCompanyName = item.Company?.name;
          } else if (item?.mainPic?.name) {
            picOrCompanyName = item?.mainPic?.name;
          }

          return (
            <TouchableOpacity
              onPress={() => {
                let handlePicNull = { ...item };
                if (!handlePicNull.PIC) {
                  handlePicNull.PIC = [];
                }
                onPressCard(handlePicNull);
              }}
            >
              <BVisitationCard
                item={{
                  name: item.name,
                  location: item.locationAddress.line1,
                  picOrCompanyName: picOrCompanyName,
                }}
                searchQuery={searchQuery}
                isRenderIcon={false}
              />
            </TouchableOpacity>
          );
        }}
        searchQuery={searchQuery}
        isLoading={isProjectLoading}
        data={projects}
      />
    );
  }, [searchQuery, isProjectLoading, projects, onPressCard]);

  return (
    <View style={{ height: width + resScale(160) }}>
      <BTabViewScreen
        isLoading={false}
        screenToRender={sceneToRender}
        tabToRender={searchQuery ? tabToRender : []}
      />
    </View>
  );
};

export default SearchingCustomer;
