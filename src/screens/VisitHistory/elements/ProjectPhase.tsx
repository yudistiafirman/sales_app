import { BLabel, BSpacer } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

const ProjectPhase = ({ phase }: { phase: string }) => {
  const projectPhase = [
    {
      phase: 'LAND_PREP',
      name: 'Pasang Ceker Ayam',
    },
    {
      phase: 'FOUNDATION',
      name: 'Cor lantai',
    },
    {
      phase: 'FORMWORK',
      name: 'Pasang bekisting',
    },
    {
      phase: 'FINISHING',
      name: 'Finishing',
    },
  ];

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={[
            styles.faseContainer,
            {
              borderColor:
                index === projectPhase.length - 1
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
                  item.phase === phase
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
                  item.phase === phase ? colors.primary : colors.text.darker,
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      );
    },
    [phase, projectPhase.length]
  );
  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Fase Proyek" />
      <BSpacer size="extraSmall" />
      <FlatList
        data={projectPhase}
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
    height: 26,
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
