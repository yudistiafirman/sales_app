import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { colors, fonts, layout } from '@/constants';

type projectType = {
  [key: string]: any;
};

type ProjectBetweenType = {
  projects: projectType[];
};

export default function ProjectBetween({ projects }: ProjectBetweenType) {
  return (
    <View style={styles.container}>
      {projects.map((project, index) => (
        <View
          key={index}
          style={[
            styles.between,
            index !== projects.length - 1 && styles.divider,
          ]}
        >
          <Text style={styles.projectName}>Playground</Text>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons
              name="history"
              color={colors.primary}
              size={fonts.size.xs}
              style={styles.iconStyle}
            />
            <Text style={styles.buttonText}>Riwayat Kunjungan</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.pad.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
    color: colors.primary,
  },
  projectName: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  iconStyle: {
    marginRight: layout.pad.sm,
  },
});
