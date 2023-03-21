import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';

interface IProps {
  isOption?: boolean;
  projectId?: string;
  onSelect?: (index: number) => void;
  idx?: number;
  isSelected?: boolean;
  projectName?: string;
}

const BProjectRBtn = ({
  isOption,
  projectId,
  isSelected,
  onSelect,
  idx,
  projectName,
}: IProps) => {
  const paddingLeft = isOption ? 0 : layout.pad.md + layout.pad.xs;
  return (
    <>
      <View style={styles.container}>
        {isOption && (
          <RadioButton
            uncheckedColor={colors.border.altGrey}
            value={projectId!}
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => {
              if (onSelect) {
                onSelect(idx!);
              }
            }}
          />
        )}
        <BText style={[styles.radioTitle, { paddingLeft: paddingLeft }]}>
          {projectName}
        </BText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    height: layout.pad.xl + layout.pad.sm,
    borderColor: colors.border.default,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom:layout.pad.lg
  },
  radioTitle: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
  },
});

export default BProjectRBtn;
