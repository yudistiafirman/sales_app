import React from "react";
import { TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { BText } from "@/components";
import { colors, fonts } from "@/constants";
import layout from "@/constants/layout";
import { Styles } from "@/interfaces";
import { resFontSize, resScale } from "@/utils";

interface IProps {
  name?: string;
  category?: {
    name: string;
  };
  onDelete?: () => void;
}

const styles: Styles = {
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: layout.radius.sm,
    paddingHorizontal: layout.pad.xs + layout.pad.md,
    paddingVertical: layout.pad.sm,
    borderLeftColor: colors.primary,
    borderBottomColor: colors.border.grey,
    borderTopColor: colors.border.grey,
    borderRightColor: colors.border.grey,
    borderLeftWidth: resScale(5),
  },
  category: {
    marginLeft: layout.pad.sm + layout.pad.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: layout.pad.xs + layout.pad.md,
    paddingVertical: resScale(3),
    borderRadius: layout.radius.lg,
  },
  text: {
    fontSize: fonts.size.vs,
  },
  icon: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    marginStart: layout.pad.md,
  },
  close: {
    padding: 0,
    height: resScale(10),
    width: resScale(10),
    right: resScale(10),
  },
};

function ProductChip({ name, category, onDelete }: IProps) {
  return (
    <View style={styles.container}>
      <BText bold="bold">{name}</BText>
      <View style={styles.category}>
        <BText style={styles.text}>{category?.name}</BText>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.icon} onPress={onDelete}>
          <AntDesign
            name="close"
            color={colors.textInput.input}
            size={resScale(15)}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ProductChip;
