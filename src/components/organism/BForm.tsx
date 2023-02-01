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
import { colors, layout } from '@/constants';
import CheckBox from '@react-native-community/checkbox';
import { BSwitch, BFileInput } from '@/components';

interface IProps {
  inputs: Input[];
  spacer?: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | number;
  noSpaceEnd?: boolean;
}

interface Styles {
  [key: string]: StyleProp<ViewStyle>;
}

const styles: Styles = {
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityLayout: {
    flexDirection: 'row',
  },
  quantityInput: {
    flex: 1,
  },
  quantityText: {
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: layout.pad.lg,
  },
  checkboxText: {
    flex: 1,
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
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
    keyboardType,
    checkbox,
    placeholder,
    hidePicLabel,
  } = input;

  if (type === 'quantity') {
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <View style={styles.quantityLayout}>
          <BTextInput
            style={styles.quantityInput}
            onChangeText={onChange}
            value={value}
            keyboardType={'numeric'}
            placeholder={placeholder}
          />
          <View style={styles.quantityText}>
            <BText>{'m3'}</BText>
          </View>
        </View>
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'textInput') {
    const textInputProps = { onChange, value };
    return (
      <React.Fragment>
        <BLabel label={label} isRequired={isRequire} />
        <BTextInput
          {...textInputProps}
          keyboardType={keyboardType ? keyboardType : 'default'}
          placeholder={placeholder}
        />
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
          placeholder={placeholder}
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
        <BSpacer size="small" />
        {!hidePicLabel ? (
          <>
            <View style={styles.optionContainer}>
              <BText type="header">PIC</BText>
              <BText bold="500" color="primary" onPress={onChange}>
                + Tambah PIC
              </BText>
            </View>
            <BSpacer size="extraSmall" />
            <BDivider />
            <BSpacer size="small" />
          </>
        ) : null}
        <BPicList isOption={true} data={value} onSelect={onSelect!} />
      </React.Fragment>
    );
  }

  if (type === 'switch') {
    return (
      <React.Fragment>
        <BSwitch label={label} value={value} onChange={onChange} />
      </React.Fragment>
    );
  }

  if (type === 'fileInput') {
    return (
      <React.Fragment>
        <BFileInput label={label} value={value} onChange={onChange} />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'checkbox') {
    return (
      <React.Fragment>
        <View style={styles.flexRow}>
          <View style={styles.checkboxText}>
            <BLabel label={label} isRequired={isRequire} />
          </View>
          <CheckBox
            disabled={checkbox?.disabled}
            value={checkbox?.value}
            onFillColor={colors.primary}
            onTintColor={colors.offCheckbox}
            onCheckColor={colors.primary}
            tintColors={{ true: colors.primary, false: colors.offCheckbox }}
            onValueChange={checkbox?.onValueChange}
          />
        </View>
      </React.Fragment>
    );
  }
};

const BForm = ({ inputs, spacer, noSpaceEnd }: IProps) => {
  return (
    <View>
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          {renderInput(input)}
          {(index < inputs.length - 1 || !noSpaceEnd) && (
            <BSpacer size={spacer ? spacer : 'small'} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default BForm;
