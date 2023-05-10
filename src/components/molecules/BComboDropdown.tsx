import React from "react";
import { View } from "react-native";

import BDropdown from "../atoms/BDropdown";
import BSpacer from "../atoms/BSpacer";

interface IProps {
  itemsOne: {
    label: string;
    value: string | number | any;
  }[];
  itemsTwo: {
    label: string;
    value: string | number | any;
  }[];
  onChangeOne:
    | ((value: any) => void)
    | ((value: any[] | null) => void)
    | undefined;
  onChangeTwo:
    | ((value: any) => void)
    | ((value: any[] | null) => void)
    | undefined;
  placeholderOne: string;
  placeholderTwo: string;
  isErrorOne?: boolean;
  isErrorTwo?: boolean;
  errorMessageOne?: string;
  errorMessageTwo?: string;
  valueOne?: any;
  valueTwo?: any;
}
function BComboDropdown(props: IProps) {
  const {
    itemsOne,
    itemsTwo,
    onChangeOne,
    onChangeTwo,
    placeholderOne,
    placeholderTwo,
    errorMessageOne,
    errorMessageTwo,
    isErrorOne,
    isErrorTwo,
    valueOne,
    valueTwo,
  } = props;

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 6 }}>
        <BDropdown
          open={false}
          value={valueOne}
          items={itemsOne}
          onChange={onChangeOne}
          placeholder={placeholderOne}
          isError={isErrorOne}
          errorMessage={errorMessageOne}
        />
      </View>
      <BSpacer size="extraSmall" />
      <View style={{ flex: 4 }}>
        <BDropdown
          open={false}
          value={valueTwo}
          items={itemsTwo}
          onChange={onChangeTwo}
          placeholder={placeholderTwo}
          isError={isErrorTwo}
          errorMessage={errorMessageTwo}
        />
      </View>
    </View>
  );
}

export default BComboDropdown;
