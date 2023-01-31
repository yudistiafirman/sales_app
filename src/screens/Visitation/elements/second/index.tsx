/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { BDivider, BForm, BSpacer, BText } from '@/components';
import { CreateVisitationSecondStep, Input, Styles } from '@/interfaces';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import SearchFlow from './Searching';
import { ScrollView } from 'react-native-gesture-handler';

import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { resScale } from '@/utils';
import { layout } from '@/constants';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

interface IProps {
  openBottomSheet: () => void;
}

const company = require('@/assets/icon/Visitation/company.png');
const individu = require('@/assets/icon/Visitation/profile.png');

const dummyData = [
  {
    id: 'kwos0299',
    name: 'Agus',
    position: 'Finance',
    phone: 81128869884,
    email: 'agus@gmail.com',
  },
  {
    id: '1233okjs',
    name: 'Joko',
    position: 'Finance',
    phone: 81128869884,
    email: 'Joko@gmail.com',
  },
  {
    id: 'jsncijc828',
    name: 'Johny',
    position: 'Finance',
    phone: 81128869884,
    email: 'Johny@gmail.com',
  },
];
function dummyReq() {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 5000);
  });
}

const SecondStep = ({ openBottomSheet }: IProps) => {
  const { values, action } = React.useContext(createVisitationContext);
  const { stepTwo: state, shouldScrollView } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationSecondStep) => (e: any) => {
    updateValueOnstep('stepTwo', key, e);
  };
  const [isLoading, setisLoading] = useState(false);

  const onFetching = (e: any) => {
    updateValueOnstep('stepTwo', 'companyName', { id: 1, title: e });

    // fetching then merge with the thing user type
    updateValueOnstep('stepTwo', 'options', {
      items: [{ id: 1, title: e }],
    });
    return;
  };

  const inputs: Input[] = React.useMemo(() => {
    // console.log('rerender input');
    const baseInput: Input[] = [
      {
        label: 'Jenis Pelanggan',
        isRequire: true,
        isError: false,
        type: 'cardOption',
        onChange: onChange('customerType'),
        value: state.customerType,
        options: [
          {
            icon: company,
            title: 'Perusahaan',
            value: 'COMPANY',
            onChange: () => {
              onChange('customerType')('COMPANY');
            },
          },
          {
            icon: individu,
            title: 'Individu',
            value: 'INDIVIDU',
            onChange: () => {
              onChange('customerType')('INDIVIDU');
            },
          },
        ],
      },
    ];
    if (state.customerType.length > 0) {
      const aditionalInput: Input[] = [
        {
          label: 'Nama Perusahaan',
          isRequire: true,
          isError: false,
          type: 'autocomplete',
          onChange: onFetching,
          value: state.companyName,
          items: state.options.items,
          loading: state.options.loading,
          onSelect: (item: any) => {
            updateValueOnstep('stepTwo', 'companyName', item);
          },
        },
        {
          label: 'Nama Proyek',
          isRequire: true,
          isError: false,
          type: 'textInput',
          onChange: (e: any) => {
            // console.log(e, 'event');
            onChange('projectName')(e.nativeEvent.text);
          },
          value: state.projectName,
        },
        {
          label: 'PIC',
          isRequire: true,
          isError: false,
          type: 'PIC',
          value: state.pics,
          onChange: () => {
            openBottomSheet();
          },
          onSelect: (index: number) => {
            const newPicList = values.stepTwo.pics.map((el, _index) => {
              return {
                ...el,
                isSelected: _index === index,
              };
            });
            updateValueOnstep('stepTwo', 'pics', newPicList);
          },
        },
      ];
      baseInput.push(...aditionalInput);
    }
    return baseInput;
  }, [values]);

  const [isSearch, setSearch] = React.useState<boolean>(false);

  const onSearch = (searching: boolean) => {
    setSearch(searching);
  };

  if (!shouldScrollView) {
    <View style={{ flex: 1 }}>
      <SearchFlow isSearch={isSearch} onSearch={onSearch} />
      {!isSearch && (
        <React.Fragment>
          <BSpacer size="small" />
          <View style={styles.dividerContainer}>
            <BDivider />
            <BSpacer size="extraSmall" />
            <BText color="divider">Atau Buat Baru Dibawah</BText>
            <BSpacer size="extraSmall" />
            <BDivider />
          </View>
          <BSpacer size="small" />
          <View>
            <BForm inputs={inputs} />
            <BSpacer size="large" />
          </View>
        </React.Fragment>
      )}
    </View>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SearchFlow isSearch={isSearch} onSearch={onSearch} />
      {!isSearch && (
        <React.Fragment>
          <BSpacer size="small" />
          <View style={styles.dividerContainer}>
            <BDivider />
            <BSpacer size="extraSmall" />
            <BText color="divider">Atau Buat Baru Dibawah</BText>
            <BSpacer size="extraSmall" />
            <BDivider />
          </View>
          <BSpacer size="small" />
          <View>
            <BForm inputs={inputs} />
            {state.customerType.length > 0 && isLoading && (
              <ShimmerPlaceHolder style={styles.labelShimmer} />
            )}
            <BSpacer size="large" />
          </View>
        </React.Fragment>
      )}
    </ScrollView>
  );
};

const styles: Styles = {
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'red',
  },
  labelShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
};

export default SecondStep;
