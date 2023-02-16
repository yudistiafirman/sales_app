import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { resScale } from '@/utils';
import React from 'react';
import { Text } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import BText from './BText';

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
const BAutoComplete = ({
  value,
  items,
  onChange,
  onSelect,
  loading,
  placeholder,
  showChevron = true,
  showClear = true,
  onClear,
}: IProps) => {
  return (
    <React.Fragment>
      <AutocompleteDropdown
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        suggestionsListContainerStyle={styles.dropdownContainer}
        suggestionsListTextStyle={styles.text}
        textInputProps={{
          placeholder: placeholder,
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
        showChevron={showChevron}
        showClear={showClear}
        EmptyResultComponent={() => <></>}
        emptyResultText={''}
      />
    </React.Fragment>
  );
};

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
    paddingHorizontal: resScale(5),
    width: '95%',
    alignSelf: 'center',
  },
  error: {
    borderColor: colors.primary,
  },
};

export default BAutoComplete;
