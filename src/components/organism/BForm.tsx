import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Input } from '@/interfaces';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';
import BTextInput from '../atoms/BTextInput';
import BCardOption from '../molecules/BCardOption';
import BComboDropdown from '../molecules/BComboDropdown';
import BDropdown from '../atoms/BDropdown';

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
    // isRequire,
  } = input;

  if (type === 'textInput') {
    return (
      <React.Fragment>
        <BText bold="500">{label}</BText>
        <BTextInput onChangeText={onChange} value={value} />
      </React.Fragment>
    );
  }

  if (type === 'area') {
    return (
      <React.Fragment>
        <BText bold="500">{label}</BText>
        <BTextInput
          onChangeText={onChange}
          value={value}
          multiline={true}
          numberOfLines={4}
        />
      </React.Fragment>
    );
  }

  if (type === 'cardOption') {
    return (
      <React.Fragment>
        <BText>{label}</BText>
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
      </React.Fragment>
    );
  }

  if (type === 'dropdown') {
    if (dropdown) {
      console.log('dropdown, masukl');
      return (
        <React.Fragment>
          <BText>{label}</BText>
          <BSpacer size="extraSmall" />
          <BDropdown
            open={false}
            value={null}
            items={dropdown.items}
            onChange={dropdown.onChange}
            placeholder={dropdown.placeholder}
          />
        </React.Fragment>
      );
    }
  }

  if (type === 'comboDropdown') {
    if (comboDropdown) {
      return (
        <React.Fragment>
          <BText>{label}</BText>
          <BSpacer size="extraSmall" />
          <BComboDropdown {...comboDropdown} />
        </React.Fragment>
      );
    }
  }
};

const BForm = ({ inputs }: IProps) => {
  return (
    <View>
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          {renderInput(input)}
          <BSpacer size="small" />
        </React.Fragment>
      ))}
    </View>
  );
};

export default BForm;
