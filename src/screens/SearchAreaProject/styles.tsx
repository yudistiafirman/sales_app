import { StyleSheet } from "react-native";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";

const SearchAreaStyles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: layout.pad.lg },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationText: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.md,
    color: colors.text.darker,
  },
  locationListCardContainer: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginBottom: layout.pad.md,
  },
  innerListContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressTitle: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.text.darker,
  },
  addressDetail: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.sm,
    color: colors.text.darker,
  },
});

export default SearchAreaStyles;
