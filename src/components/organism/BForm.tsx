import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Input } from '@/interfaces';
import BSpacer from '../atoms/BSpacer';
import BTextInput from '../atoms/BTextInput';
import BCardOption from '../molecules/BCardOption';
import BComboDropdown from '../molecules/BComboDropdown';
import BDropdown from '../atoms/BDropdown';
import BLabel from '../molecules/BLabel';
import BText from '../atoms/BText';
import BDivider from '../atoms/BDivider';
import BPicList from './BPicList';
import BAutoComplete from '../atoms/BAutoComplete';

interface IProps {
  inputs: Input[];
}

interface Styles {
  [key: string]: StyleProp<ViewStyle>;
}

const styles: Styles = {
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

const renderInput = (input: Input): React.ReactNode => {
  const {
    type,
    label,
    onChange,
    value,
    options,
    comboDropdown,
    dropdown,
    isRequire,
    isError,
    onSelect,
  } = input;

  if (type === 'textInput') {
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <BTextInput onChangeText={onChange} value={value} />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'area') {
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <BTextInput
          onChangeText={onChange}
          value={value}
          multiline={true}
          numberOfLines={4}
        />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'cardOption') {
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <BSpacer size="extraSmall" />
        <View style={styles.optionContainer}>
          {options?.map((val, index) => (
            <React.Fragment key={index}>
              <BCardOption
                icon={val.icon}
                title={val.title}
                fullWidth
                isActive={value === val.value}
                onPress={val.onChange}
              />
              <BSpacer size="small" />
            </React.Fragment>
          ))}
        </View>
        <BSpacer size="extraSmall" />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'autocomplete') {
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <BSpacer size="extraSmall" />
        <BAutoComplete {...input} />
      </React.Fragment>
    );
  }

  if (type === 'dropdown') {
    if (dropdown) {
      console.log('dropdown, masukl');
      return (
        <React.Fragment>
          <BLabel label={label} isRequired={isRequire} />
          <BSpacer size="extraSmall" />
          <BDropdown
            open={false}
            value={null}
            items={dropdown.items}
            onChange={dropdown.onChange}
            placeholder={dropdown.placeholder}
            isError={isError}
            errorMessage={`${label} harus dipilih`}
          />
        </React.Fragment>
      );
    }
  }

  if (type === 'comboDropdown') {
    if (comboDropdown) {
      return (
        <React.Fragment>
          <BLabel label={label} isRequired={isRequire} />
          <BSpacer size="extraSmall" />
          <BComboDropdown {...comboDropdown} />
        </React.Fragment>
      );
    }
  }

  if (type === 'PIC') {
    return (
      <React.Fragment>
        <BSpacer size="medium" />
        <View style={styles.optionContainer}>
          <BText type="header">PIC</BText>
          <BText bold="500" color="primary" onPress={onChange}>
            + Tambah PIC
          </BText>
        </View>
        <BSpacer size="extraSmall" />
        <BDivider />
        <BSpacer size="medium" />
        <BPicList
          isOption={value.length > 1 ? true : false}
          data={value}
          onSelect={onSelect!}
        />
      </React.Fragment>
    );
  }
};

const BForm = ({ inputs }: IProps) => {
  return (
    <View>
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          {renderInput(input)}
          <BSpacer size="medium" />
        </React.Fragment>
      ))}
    </View>
  );
};

export default BForm;
