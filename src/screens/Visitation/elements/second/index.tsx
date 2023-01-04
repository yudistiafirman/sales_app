import React from 'react';
import { View } from 'react-native';
import { BDivider, BForm, BSearchBar, BSpacer, BText } from '@/components';
import { Input, Styles } from '@/interfaces';

interface SecondState {
  location: {};
  customerType: string;
  companyName: string;
  projectName: string;
}

interface IState {
  step: number;
  stepOne: {};
  stepTwo: {};
}

interface IProps {
  updateValue: (key: keyof IState, value: any) => void;
}

const styles: Styles = {
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

const company = require('@/assets/icon/Visitation/company.png');
const individu = require('@/assets/icon/Visitation/profile.png');

const SecondStep = (props: IProps) => {
  const { updateValue } = props;

  const [state, setState] = React.useState<SecondState>({
    companyName: '',
    customerType: '',
    location: {},
    projectName: '',
  });

  const onChange = (key: keyof SecondState) => (e: any) => {
    setState({
      ...state,
      [key]: e,
    });
  };

  const inputs: Input[] = [
    {
      label: 'Jenis Pelanggan',
      isRequire: true,
      isError: true,
      type: 'cardOption',
      onChange: onChange('customerType'),
      value: state.customerType,
      options: [
        {
          icon: company,
          title: 'Perusahaan',
          value: 'customer',
          onChange: () => {
            onChange('customerType')('customer');
          },
        },
        {
          icon: individu,
          title: 'Individu',
          value: 'individu',
          onChange: () => {
            onChange('customerType')('individu');
          },
        },
      ],
    },
    {
      label: 'Nama Perusahaan',
      isRequire: true,
      isError: true,

      type: 'textInput',
      onChange: onChange('companyName'),
      value: state.companyName,
    },
    {
      label: 'Nama Proyek',
      isRequire: true,
      isError: true,

      type: 'textInput',
      onChange: onChange('projectName'),
      value: state.projectName,
    },
  ];

  const onAddPic = () => {
    console.log(state, 'ini state<<<<<');
  };

  React.useEffect(() => {
    updateValue('stepTwo', state);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <React.Fragment>
      <BSearchBar />
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
        <BSpacer size="small" />
        <View style={styles.picContainer}>
          <BText type="header">PIC</BText>
          <BText bold="500" color="primary" onPress={onAddPic}>
            + Tambah PIC
          </BText>
        </View>
        <BSpacer size="extraSmall" />
        <BDivider />
        <BSpacer size="small" />
      </View>
    </React.Fragment>
  );
};

export default SecondStep;
