import * as React from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { TextInput } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
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
import BSwitch from '../atoms/BSwitch';
import BFileInput from '../atoms/BFileInput';
import BCalendar from './BCalendar';
import BComboRadioButton from '../molecules/BComboRadioButton';
import BTableInput from '../molecules/BTableInput';

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
    borderRadius: layout.radius.xs + layout.radius.sm,
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
  quantityInputPrice: {
    flex: 1,
    justifyContent: 'center',
    borderColor: colors.textInput.placeHolder,
    borderWidth: 1,
    borderRadius: layout.radius.sm,
  },
  quantityInputCalendar: {
    flex: 1,
    justifyContent: 'center',
    borderColor: colors.textInput.placeHolder,
    borderWidth: 1,
    borderRadius: layout.radius.sm,
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.ml,
  },
  quantityText: {
    position: 'absolute',
    right: 0,
    top: 6,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: layout.pad.lg,
  },
  priceText: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingStart: layout.pad.lg,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  calendarText: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingEnd: layout.pad.md,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  calendar: {
    borderWidth: 1,
    borderRadius: layout.radius.sm,
    borderColor: colors.lightGray,
  },
  checkboxText: {
    // flex: 1,
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  relative: {
    position: 'relative',
  },
  TextinputAbsolute: {
    position: 'absolute',
    width: '100%',
    height: resScale(73),
    zIndex: 2,
  },
  TextAreaAbsolute: {
    position: 'absolute',
    width: '100%',
    height: resScale(110),
    zIndex: 2,
  },
  calendarTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarOne: { flex: 1, marginEnd: layout.pad.sm },
  timeOne: { flex: 1, marginStart: layout.pad.sm },
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
  | undefined,
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
    labelStyle,
    textInputAsButton,
    textInputAsButtonOnPress,
    outlineColor,
    loading,
    calendar,
    calendarTime,
    disabledFileInput,
    quantityType,
    disableColor,
    comboRadioBtn,
    tableInput,
  } = input;

  if (type === 'tableInput') {
    return (
      <BTableInput
        titleBold={titleBold}
        textSize={input.textSize}
        onChangeValue={tableInput?.onChangeValue}
        firstColumnLabel={tableInput?.firstColumnLabel}
        secondColumnLabel={tableInput?.secondColumnLabel}
        tableInputListItem={tableInput?.tableInputListItem}
      />
    );
  }

  if (type === 'comboRadioButton') {
    return (
      <BComboRadioButton
        onSetComboRadioButtonValue={comboRadioBtn?.onSetComboRadioButtonValue}
        isRequire={isRequire}
        sizeInNumber={input.textSize}
        label={label}
        titleBold={titleBold}
        firstStatus={comboRadioBtn?.firstStatus}
        firstText={comboRadioBtn?.firstText}
        firstValue={comboRadioBtn?.firstValue}
        secondText={comboRadioBtn?.secondText}
        secondValue={comboRadioBtn?.secondValue}
        secondStatus={comboRadioBtn?.secondStatus}
        firstChildren={comboRadioBtn?.firstChildren}
        secondChildren={comboRadioBtn?.secondChildren}
      />
    );
  }

  if (type === 'quantity') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <View style={[styles.quantityLayout]}>
          <BTextInput
            style={[
              styles.quantityInput,
              { paddingEnd: layout.pad.xl },
              // isError && { borderColor: colors.primary },
            ]}
            onChangeText={(vl) => onChange(vl.replace(/\D/g, ''))}
            value={value}
            keyboardType="numeric"
            placeholder={placeholder}
            contentStyle={textStyles}
            outlineColor={outlineColor}
          />
          <View style={styles.quantityText}>
            <BText>{quantityType || 'm³'}</BText>
          </View>
        </View>
        {isError && (
          <BText size="small" color="primary" bold="100">
            {customerErrorMsg || `${label} harus diisi`}
          </BText>
        )}
      </View>
    );
  }

  if (type === 'price') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <View style={[styles.quantityLayout, { marginTop: layout.pad.md }]}>
          <View
            style={[
              styles.quantityInputPrice,
              { paddingStart: layout.pad.xxl },
              isError && { borderColor: colors.primary },
            ]}
          >
            <TextInputMask
              type="money"
              options={{
                precision: 0,
                separator: ',',
                delimiter: '.',
                unit: '',
                suffixUnit: '',
              }}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              style={[
                textStyles,
                Platform.OS !== 'android' && { minHeight: resScale(40) },
              ]}
            />
          </View>
          <View style={styles.priceText}>
            <BText>IDR</BText>
          </View>
        </View>
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
      </View>
    );
  }

  if (type === 'calendar') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <TouchableOpacity
          style={[styles.quantityLayout, { marginTop: layout.pad.md }]}
          onPress={() => calendar?.setCalendarVisible(!calendar?.isCalendarVisible)}
        >
          <View
            style={[
              styles.quantityInputCalendar,
              { paddingEnd: layout.pad.xl },
              isError && { borderColor: colors.primary },
            ]}
          >
            <BText>{value || placeholder}</BText>
          </View>
          <View style={styles.calendarText}>
            <Icon name="chevron-right" size={25} color={colors.black} />
          </View>
        </TouchableOpacity>
        {isError && (
          <BText size="small" color="primary" bold="100">
            {`${label} harus diisi`}
          </BText>
        )}
        {calendar?.isCalendarVisible && (
          <>
            <BSpacer size="extraSmall" />
            <View style={styles.calendar}>
              <BCalendar
                onDayPress={(date) => {
                  calendar?.setCalendarVisible(false);
                  calendar?.onDayPress(date);
                }}
              />
            </View>
          </>
        )}
      </View>
    );
  }

  if (type === 'calendar-time') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <View style={styles.calendarTime}>
          <View style={styles.calendarOne}>
            <BLabel
              sizeInNumber={input.textSize}
              bold={titleBold}
              label={calendarTime?.labelOne}
              isRequired={isRequire}
            />
            <TouchableOpacity
              style={[styles.quantityLayout, { marginTop: layout.pad.md }]}
              onPress={() => calendarTime?.setCalendarVisible(
                !calendarTime?.isCalendarVisible,
              )}
            >
              <View
                style={[
                  styles.quantityInputCalendar,
                  { paddingEnd: layout.pad.xl },
                  calendarTime?.isErrorOne && { borderColor: colors.primary },
                ]}
              >
                <BText
                  style={
                    calendarTime?.valueOne
                      ? {
                        color: colors.textInput.input,
                      }
                      : {
                        color: colors.textInput.placeHolder,
                      }
                  }
                >
                  {calendarTime?.valueOne
                    ? calendarTime?.valueOne
                    : calendarTime?.placeholderOne}
                </BText>
              </View>
            </TouchableOpacity>
            {calendarTime?.isErrorOne && (
              <BText size="small" color="primary" bold="100">
                {`${calendarTime?.labelOne} harus diisi`}
              </BText>
            )}
          </View>
          <View style={styles.timeOne}>
            <BLabel
              sizeInNumber={input.textSize}
              bold={titleBold}
              label={calendarTime?.labelTwo}
              isRequired={isRequire}
            />
            <TouchableOpacity
              style={[styles.quantityLayout, { marginTop: layout.pad.md }]}
              onPress={() => calendarTime?.setTimeVisible(!calendarTime?.isTimeVisible)}
            >
              <View
                style={[
                  styles.quantityInputCalendar,
                  { paddingEnd: layout.pad.xl },
                  calendarTime?.isErrorTwo && { borderColor: colors.primary },
                ]}
              >
                <BText
                  style={
                    calendarTime?.valueTwo
                      ? {
                        color: colors.textInput.input,
                      }
                      : {
                        color: colors.textInput.placeHolder,
                      }
                  }
                >
                  {calendarTime?.valueTwo
                    ? calendarTime?.valueTwo
                    : calendarTime?.placeholderTwo}
                </BText>
              </View>
            </TouchableOpacity>
            {calendarTime?.isErrorTwo && (
              <BText size="small" color="primary" bold="100">
                {`${calendarTime?.labelTwo} harus diisi`}
              </BText>
            )}
          </View>
        </View>
        {calendarTime?.isCalendarVisible && (
          <>
            <BSpacer size="extraSmall" />
            <View style={styles.calendar}>
              <BCalendar
                onDayPress={(date) => {
                  calendarTime?.setCalendarVisible(false);
                  calendarTime?.onDayPress(date);
                }}
              />
            </View>
          </>
        )}
        {calendarTime?.isTimeVisible && (
          <>
            <BSpacer size="extraSmall" />
            <View style={styles.calendar}>
              <DatePicker
                textColor={colors.text.darker}
                date={
                  calendarTime?.valueTwoMock
                    ? calendarTime?.valueTwoMock
                    : new Date()
                }
                onDateChange={(time) => {
                  calendarTime?.setTimeVisible(false);
                  calendarTime?.onTimeChange(time);
                }}
                mode="time"
                is24hourSource="locale"
                minuteInterval={1}
                locale="id"
                // timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
              />
            </View>
          </>
        )}
      </View>
    );
  }

  if (type === 'textInput') {
    const textInputProps = { onChange, value };
    const defaultErrorMsg = `${label} harus diisi`;
    // textInputAsButton
    return (
      <View
        style={[styles.relative, Platform.OS !== 'android' && { zIndex: -1 }]}
      >
        {textInputAsButton && (
          <TouchableOpacity
            onPress={textInputAsButtonOnPress}
            style={styles.TextinputAbsolute}
          />
        )}

        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BTextInput
          {...textInputProps}
          keyboardType={keyboardType || 'default'}
          placeholder={placeholder}
          disabled={isInputDisable}
          left={
            LeftIcon && (
              <TextInput.Icon
                forceTextInputFocus={false}
                icon={LeftIcon}
                style={{
                  marginTop: layout.pad.xs,
                }}
              />
            )
          }
          contentStyle={[
            textStyles,
            disableColor && {
              backgroundColor: disableColor,
              borderRadius: layout.radius.sm,
              borderColor: colors.textInput.placeHolder,
              borderWidth: 1,
            },
          ]}
          outlineColor={outlineColor}
        />
        {isError && (
          <>
            <BSpacer size="verySmall" />
            <BText size="small" color="error" bold="300">
              {customerErrorMsg || defaultErrorMsg}
            </BText>
          </>
        )}
      </View>
    );
  }

  if (type === 'area') {
    const defaultErrorMsg = `${label} harus diisi`;
    return (
      <View
        style={[styles.relative, Platform.OS !== 'android' && { zIndex: -1 }]}
      >
        {textInputAsButton && (
          <TouchableOpacity
            onPress={textInputAsButtonOnPress}
            style={styles.TextAreaAbsolute}
          />
        )}
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BTextInput
          onChangeText={onChange}
          value={value}
          multiline
          numberOfLines={4}
          minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
          placeholder={placeholder}
          contentStyle={textStyles}
          left={
            LeftIcon && (
              <TextInput.Icon
                forceTextInputFocus={false}
                icon={LeftIcon}
                style={{
                  marginTop: layout.pad.xs,
                }}
              />
            )
          }
        />
        {isError && (
          <BText size="small" color="primary" bold="100">
            {customerErrorMsg || defaultErrorMsg}
          </BText>
        )}
      </View>
    );
  }

  if (type === 'cardOption') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BLabel
          sizeInNumber={input.textSize}
          bold={titleBold}
          label={label}
          isRequired={isRequire}
        />
        <BSpacer size="verySmall" />
        <View
          pointerEvents={isInputDisable ? 'none' : 'auto'}
          style={[styles.optionContainer]}
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
      </View>
    );
  }

  if (type === 'autocomplete') {
    const defaultErrorMsg = `${label} harus diisi`;
    return (
      <>
        <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
          <BLabel
            sizeInNumber={input.textSize}
            bold={titleBold}
            label={label}
            isRequired={isRequire}
          />
          <BSpacer size="verySmall" />
        </View>

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
      </>
    );
  }

  if (type === 'dropdown') {
    if (dropdown) {
      return (
        <>
          <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
            <BLabel
              sizeInNumber={input.textSize}
              bold={titleBold}
              label={label}
              isRequired={isRequire}
            />
            <BSpacer size="verySmall" />
          </View>
          <BDropdown
            open={false}
            value={value}
            items={dropdown.items}
            onChange={dropdown.onChange}
            placeholder={dropdown.placeholder}
            isError={isError}
            errorMessage={`${label} harus dipilih`}
          />
        </>
      );
    }
  }

  if (type === 'comboDropdown') {
    if (comboDropdown) {
      return (
        <>
          <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
            <BLabel
              sizeInNumber={input.textSize}
              bold={titleBold}
              label={label}
              isRequired={isRequire}
            />
            <BSpacer size="verySmall" />
          </View>
          <BComboDropdown {...comboDropdown} />
        </>
      );
    }
  }

  if (type === 'PIC') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BSpacer size="verySmall" />
        {!hidePicLabel && (
          <>
            <View style={[styles.optionContainer]}>
              <BText sizeInNumber={fonts.size.md} bold="600">
                {label}
              </BText>
              <BText
                bold="500"
                sizeInNumber={fonts.size.sm}
                color="primary"
                onPress={onChange}
              >
                {`+ Tambah ${label}`}
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
        )}
        <BPicList
          isOption={
            label?.toLowerCase() === 'kompetitor' ? false : value?.length > 1
          }
          data={value}
          onSelect={onSelect!}
          isCompetitor={label?.toLowerCase() === 'kompetitor'}
        />
      </View>
    );
  }

  if (type === 'switch') {
    return (
      <View
        style={
          Platform.OS !== 'android' && { zIndex: -1, marginTop: layout.pad.md }
        }
      >
        <BSwitch
          labelStyle={labelStyle}
          label={label}
          value={value}
          onChange={onChange}
        />
      </View>
    );
  }

  if (type === 'fileInput') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <BFileInput
          isLoading={loading}
          label={label}
          sizeInNumber={input.textSize}
          bold={titleBold}
          isRequire={isRequire}
          value={value}
          onChange={onChange}
          isError={isError}
          disabled={disabledFileInput}
        />
        {isError && (
          <BText style={{ fontSize: fonts.size.xs }} color="primary" bold="400">
            {customerErrorMsg}
          </BText>
        )}
      </View>
    );
  }

  if (type === 'checkbox') {
    return (
      <View style={Platform.OS !== 'android' && { zIndex: -1 }}>
        <View style={styles.flexRow}>
          <CheckBox
            disabled={checkbox?.disabled}
            value={checkbox?.value}
            onFillColor={colors.primary}
            onTintColor={colors.offCheckbox}
            onCheckColor={colors.primary}
            tintColors={{
              true: colors.primary,
              false: colors.offCheckbox,
            }}
            tintColor={colors.offCheckbox}
            onCheckColor={colors.white}
            onFillColor={colors.primary}
            onTintColor={colors.primary}
            boxType="square"
            onValueChange={checkbox?.onValueChange}
            style={[
              { marginStart: layout.pad.xs },
              Platform.OS !== 'android' && {
                height: resScale(20),
                width: resScale(20),
              },
            ]}
          />
          <View
            style={[
              styles.checkboxText,
              { paddingEnd: layout.pad.md },
              Platform.OS !== 'android' && {
                marginStart: layout.pad.md,
                marginEnd: layout.pad.xl,
              },
            ]}
          >
            <BLabel
              numberOfLines={1}
              bold={titleBold}
              label={label}
              isRequired={isRequire}
            />
          </View>
        </View>
        {isError && (
          <BText
            style={[
              { fontSize: fonts.size.xs, marginStart: layout.pad.xl },
              Platform.OS !== 'android' && { marginTop: layout.pad.md },
            ]}
            color="primary"
            bold="400"
          >
            {customerErrorMsg}
          </BText>
        )}
      </View>
    );
  }
};

function BForm({
  inputs, spacer, noSpaceEnd, titleBold,
}: IProps) {
  return (
    <View>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {renderInput(input, titleBold)}
          {(index < inputs.length - 1 || !noSpaceEnd) && (
            <BSpacer size={spacer || 'middleSmall'} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default BForm;
