import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, layout } from '@/constants';

type projectType = {
  id?: string;
  name?: string;
};

type ProjectBetweenType = {
  projects: projectType;
  onPress: () => void;
};

export default function ProjectBetween({ projects, onPress }: ProjectBetweenType) {
  return (
    <View style={styles.container}>
      <View style={[styles.between]}>
        <Text style={styles.projectName}>{projects.name}</Text>
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
          <MaterialCommunityIcons
            name="history"
            color={colors.primary}
            size={fonts.size.xs}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Riwayat Kunjungan</Text>
        </TouchableOpacity>
      </View>
      {/* {projects.map((project, index) => (
        <View
          key={index}
          style={[
            styles.between,
            index !== projects.length - 1 && styles.divider,
          ]}
        >
          <Text style={styles.projectName}>{project[0].name}</Text>
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
      ))} */}
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
