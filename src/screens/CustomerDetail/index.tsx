import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { colors, fonts, layout } from '@/constants';
import { BContainer, BPic, BSpacer } from '@/components';
import { resScale } from '@/utils';
import ProjectBetween from './elements/ProjectBetween';
import Octicons from 'react-native-vector-icons/Octicons';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import BillingModal from './elements/BillingModal';

export default function CustomerDetail() {
  const [isBillingVisible, setIsBillingVisible] = useState(false);
  return (
    <>
      <BillingModal
        setIsModalVisible={setIsBillingVisible}
        isModalVisible={isBillingVisible}
      />
      <View style={styles.labelWarning}>
        <Text style={styles.labelText}>
          Ada dokumen pelanggan yang belum dilengkapi.
        </Text>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.buttonText}>Lengkapi Dokumen</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <Text style={styles.partText}>Pelanggan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Nama</Text>
            <Text style={styles.fontW400}>PT. Guna Karya Mandiri</Text>
          </View>
          <BSpacer size={'small'} />
          <Text style={styles.partText}>Proyek</Text>
          <BSpacer size={'extraSmall'} />
          <ProjectBetween projects={[{}, {}, {}]} />
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.partText}>PIC</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <BPic />
          <BSpacer size={'extraSmall'} />
          <Text style={styles.partText}>Alamat Penagihan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            <TouchableOpacity
              style={styles.addBilling}
              onPress={() => {
                setIsBillingVisible((curr) => !curr);
              }}
            >
              <Octicons
                name="plus"
                color={colors.primary}
                size={fonts.size.xs}
                style={styles.plusStyle}
              />
              <Text style={styles.seeAllText}>Tambah Alamat Penagihan</Text>
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.partText}>Dokumen</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Kelengkapan Dokumen</Text>
            <Text style={styles.fontW300}>2/6</Text>
          </View>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={0.33}
            color={colors.primary}
          />
        </BContainer>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  labelWarning: {
    backgroundColor: colors.status.offYellow,
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.text.secYellow,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
    flex: 0.9,
  },
  outlineButton: {
    borderColor: colors.primary,
    borderWidth: resScale(1),
    borderRadius: layout.radius.md,
    paddingVertical: layout.pad.sm,
    paddingHorizontal: layout.pad.md,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAllText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
  },
  fontW300: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.md,
  },
  fontW400: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
  },
  billingStyle: {
    alignItems: 'center',
    padding: layout.pad.lg,
  },
  addBilling: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusStyle: {
    marginRight: layout.pad.sm,
  },
});
