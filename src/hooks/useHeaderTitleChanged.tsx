import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

type useHeaderTitle = {
  title: string;
};

export default function useHeaderTitleChanged({ title }: useHeaderTitle) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, title]);
}
