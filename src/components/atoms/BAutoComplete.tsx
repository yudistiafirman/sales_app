import React from 'react';
import { Text, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { resScale } from '@/utils';
import BText from './BText';

const styles: Styles = {
  inputContainer: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    lineHeight: resScale(14),
    color: 'blue',
    backgroundColor: colors.white,
    borderRadius: layout.radius.sm,
    borderColor: colors.textInput.inActive,
  },
  container: {
    borderRadius: layout.radius.sm,
    borderColor: colors.textInput.inActive,
    borderWidth: 1,
    zIndex: 10,
  },
  dropdownContainer: {
    zIndex: 10,
    borderRadius: layout.radius.sm,
    borderColor: colors.textInput.inActive,
    borderWidth: 1,
    color: 'blue',
  },
  text: {
    color: colors.textInput.input,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
  },
  separator: {
    backgroundColor: colors.border.default,
    paddingHorizontal: layout.pad.xs + layout.pad.sm,
    width: '95%',
    alignSelf: 'center',
  },
  error: {
    borderColor: colors.primary,
  },
};

interface IProps {
  items?: any[];
  value?: any;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  onChange?: (e: any) => void;
  onSelect?: (index: any) => void;
  loading?: boolean;
  showChevron?: boolean;
  showClear?: boolean;
  onClear?: () => void;
}
function BAutoComplete({
  value,
  items,
  onChange,
  onSelect,
  loading,
  placeholder,
  showChevron = true,
  showClear = true,
  onClear,
}: IProps) {
  let isShowChevron = showChevron;
  if (items?.length === 0) {
    isShowChevron = false;
  }
  return (
    <AutocompleteDropdown
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      suggestionsListContainerStyle={styles.dropdownContainer}
      suggestionsListTextStyle={styles.text}
      textInputProps={{
        placeholder,
        autoCorrect: false,
        autoCapitalize: 'none',
        style: styles.text,
      }}
      debounce={500}
      loading={loading}
      initialValue={value} // or just '2'
      onSelectItem={onSelect}
      dataSet={items}
      onChangeText={onChange}
      closeOnBlur={false}
      useFilter={false}
      clearOnFocus={false}
      onClear={onClear}
      showChevron={isShowChevron}
      showClear={showClear}
      EmptyResultComponent={<View />}
      emptyResultText=""
    />
  );
}

export default BAutoComplete;
