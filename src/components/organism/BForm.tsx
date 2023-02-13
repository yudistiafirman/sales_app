import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Input } from '@/interfaces';
import BSpacer from '../atoms/BSpacer';
import BTextInput from '../atoms/BTextInput';
import BCardOption from '../molecules/BCardOption';
import BComboDropdown from '../molecules/BComboDropdown';
import BDropdown from '../atoms/BDropdown';
import BLabel from '../atoms/BLabel';
import BText from '../atoms/BText';
import BDivider from '../atoms/BDivider';
import BPicList from './BPicList';
import BAutoComplete from '../atoms/BAutoComplete';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import CheckBox from '@react-native-community/checkbox';
import { TextInput } from 'react-native-paper';
import BSwitch from '../atoms/BSwitch';
import BFileInput from '../atoms/BFileInput';

interface IProps {
  inputs: Input[];
  spacer?: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | number;
  noSpaceEnd?: boolean;
  titleBold?:
    | 'bold'
    | '400'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}

interface Styles {
  [key: string]: StyleProp<ViewStyle>;
}

const styles: Styles = {
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorPicContainer: {
    width: resScale(213),
    height: resScale(40),
    borderRadius: layout.pad.xs + layout.pad.sm,
    backgroundColor: colors.status.errorPic,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.pad.sm,
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

const textStyles: TextStyle = {
  color: colors.textInput.input,
  fontFamily: fonts.family.montserrat[400],
  fontSize: fonts.size.md,
};

const renderInput = (
  input: Input,
  titleBold?:
    | 'bold'
    | '400'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined
): React.ReactNode => {
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
    isInputDisable,
    customerErrorMsg,
    onClear,
    LeftIcon,
  } = input;

  if (type === 'quantity') {
    return (
      <React.Fragment>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <View style={styles.quantityLayout}>
          <BTextInput
            style={styles.quantityInput}
            onChangeText={onChange}
            value={value}
            keyboardType={'numeric'}
            placeholder={placeholder}
            contentStyle={textStyles}
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
    const defaultErrorMsg = `${label} harus diisi`;

    return (
      <React.Fragment>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BTextInput
          {...textInputProps}
          keyboardType={keyboardType ? keyboardType : 'default'}
          placeholder={placeholder}
          disabled={isInputDisable}
          left={LeftIcon && <TextInput.Icon icon={LeftIcon} />}
          contentStyle={textStyles}
        />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {customerErrorMsg || defaultErrorMsg}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'area') {
    const defaultErrorMsg = `${label} harus diisi`;
    return (
      <React.Fragment>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BTextInput
          onChangeText={onChange}
          value={value}
          multiline={true}
          numberOfLines={4}
          placeholder={placeholder}
          contentStyle={textStyles}
        />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {customerErrorMsg || defaultErrorMsg}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'cardOption') {
    return (
      <React.Fragment>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BSpacer size="verySmall" />
        <View
          pointerEvents={isInputDisable ? 'none' : 'auto'}
          style={styles.optionContainer}
        >
          {options?.map((val, index) => (
            <React.Fragment key={index}>
              <BCardOption
                icon={val.icon}
                title={val.title}
                fullWidth
                isActive={value === val.value}
                onPress={val.onChange}
              />
              {index !== options.length - 1 && <BSpacer size={6} />}
            </React.Fragment>
          ))}
        </View>
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'autocomplete') {
    const defaultErrorMsg = `${label} harus diisi`;
    return (
      <React.Fragment>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BSpacer size="verySmall" />

        {!isInputDisable ? (
          <BAutoComplete
            {...input}
            onClear={onClear}
            showClear={input.showClearAutoCompleted}
            showChevron={input.showChevronAutoCompleted}
          />
        ) : (
          <BTextInput
            value={value?.title}
            placeholder={placeholder}
            disabled={isInputDisable}
            contentStyle={textStyles}
          />
        )}
        {isError && (
          <BText size="small" color="primary" bold="100">
            {customerErrorMsg || defaultErrorMsg}
          </BText>
        )}
      </React.Fragment>
    );
  }

  if (type === 'dropdown') {
    if (dropdown) {
      return (
        <React.Fragment>
          <BLabel
            sizeInNumber={input.textSize}
            bold={titleBold}
            label={label}
            isRequired={isRequire}
          />
          <BSpacer size="verySmall" />
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
          <BLabel
            sizeInNumber={input.textSize}
            bold={titleBold}
            label={label}
            isRequired={isRequire}
          />
          <BSpacer size="verySmall" />
          <BComboDropdown {...comboDropdown} />
        </React.Fragment>
      );
    }
  }

  if (type === 'PIC') {
    return (
      <React.Fragment>
        <BSpacer size="verySmall" />
        {!hidePicLabel ? (
          <>
            <View style={styles.optionContainer}>
              <BText sizeInNumber={fonts.size.md} bold="600">
                PIC
              </BText>
              <BText
                bold="500"
                sizeInNumber={fonts.size.sm}
                color="primary"
                onPress={onChange}
              >
                + Tambah PIC
              </BText>
            </View>
            <BSpacer size="verySmall" />
            <BDivider />
            <BSpacer size="extraSmall" />
            {isError && (
              <View style={styles.errorPicContainer}>
                <BText
                  style={{ fontSize: fonts.size.md }}
                  color="primary"
                  bold="400"
                >
                  {customerErrorMsg}
                </BText>
              </View>
            )}
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
            <BLabel bold={titleBold} label={label} isRequired={isRequire} />
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

const BForm = ({ inputs, spacer, noSpaceEnd, titleBold }: IProps) => {
  return (
    <View>
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          {renderInput(input, titleBold)}
          {(index < inputs.length - 1 || !noSpaceEnd) && (
            <BSpacer size={spacer ? spacer : 'middleSmall'} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default BForm;
