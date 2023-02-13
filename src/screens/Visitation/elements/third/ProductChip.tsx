import { BText } from '@/components';
import { colors } from '@/constants';
import layout from '@/constants/layout';
import { Styles } from '@/interfaces';
import { resFontSize, resScale } from '@/utils';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface IProps {
  name: string;
  category: {
    name: string;
  };
  onDelete: () => void;
}

const styles: Styles = {
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderColor: Colors.border.grey,
    borderWidth: 1,
    borderRadius: layout.radius.sm,
    paddingHorizontal: resScale(10),
    paddingVertical: resScale(5),
    borderLeftColor: colors.primary,
    borderBottomColor: colors.border.grey,
    borderTopColor: colors.border.grey,
    borderRightColor: colors.border.grey,
    borderLeftWidth: 5,
  },
  category: {
    // position: 'absolute',
    // // right: -200,
    // top: 50,
    marginLeft: 10,
    backgroundColor: colors.secondary,
    paddingHorizontal: resScale(10),
    paddingVertical: resScale(3),
    borderRadius: layout.radius.lg,
  },
  text: {
    fontSize: resFontSize(8),
  },
  icon: {
    padding: 0,
    // width: 10,
    height: resScale(10),
    width: resScale(20),
    position: 'relative',
    right: resScale(10),
  },
  close: {
    padding: 0,
    // width: 10,
    height: resScale(10),
    width: resScale(10),
    right: resScale(10),
  },
};

const ProductChip = ({ name, category, onDelete }: IProps) => {
  return (
    <View style={styles.container}>
      <BText bold="bold">{name}</BText>
      <View style={styles.category}>
        <BText style={styles.text}>{category.name}</BText>
      </View>
      <Button
        icon="close"
        textColor={colors.textInput.input}
        style={styles.icon}
        onPress={onDelete}
      />
    </View>
  );
};

export default ProductChip;
