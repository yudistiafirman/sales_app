import { BLabel, BSpacer } from '@/components';
import { colors, layout } from '@/constants';
import { STAGE_PROJECT } from '@/constants/dropdown';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const ProjectPhase = ({ phase }: { phase: string }) => {
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={[
            styles.faseContainer,
            {
              borderColor:
                index === STAGE_PROJECT.length - 1
                  ? colors.white
                  : colors.textInput.inActive,
            },
          ]}
        >
          <View
            style={[
              styles.circle,
              {
                backgroundColor:
                  item.value === phase
                    ? colors.primary
                    : colors.textInput.inActive,
              },
            ]}
          />
          <Text
            style={[
              styles.textFase,
              {
                color:
                  item.value === phase ? colors.primary : colors.text.darker,
              },
            ]}
          >
            {item.label}
          </Text>
        </View>
      );
    },
    [phase, STAGE_PROJECT.length]
  );
  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Fase Proyek" />
      <BSpacer size="extraSmall" />
      <FlashList
        estimatedItemSize={10}
        data={STAGE_PROJECT}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingLeft: layout.pad.sm + 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
  faseContainer: {
    borderLeftWidth: 1,
    borderColor: colors.textInput.inActive,
    height: resScale(26),
  },
  circle: {
    position: 'absolute',
    top: 0,
    left: -5,
    width: layout.pad.md,
    height: layout.pad.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.textInput.inActive,
  },
  textFase: {
    marginLeft: (layout.pad.xs + layout.pad.sm) * 2,
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.md,
    color: colors.textInput.inActive,
    marginTop: -layout.pad.sm,
  },
});

export default ProjectPhase;
