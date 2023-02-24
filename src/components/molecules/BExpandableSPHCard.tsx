import { layout, colors } from '@/constants';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import BText from '../atoms/BText';
import BProductCard from './BProductCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import formatCurrency from '@/utils/formatCurrency';
import BDivider from '../atoms/BDivider';
import BForm from '../organism/BForm';

type ProductsData = {
  name: string;
  volume: number;
  pricePerVol: number;
  totalPrice: number;
};

interface BExpandableSPHCardProps {
  productsData?: ProductsData[];
  sphNo?: string;
  totalPrice?: number;
  index?: number;
  onChecked?: (index: number) => void;
  checked?: boolean;
}

const BExpandableSphCard = ({
  productsData,
  sphNo,
  totalPrice,
  checked,
  onChecked,
  index,
}: BExpandableSPHCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const checkbox: Input[] = [
    {
      type: 'checkbox',
      checkbox: {
        value: checked,
        onValueChange: () => onChecked && onChecked(index!),
      },
    },
  ];

  const renderItem: ListRenderItem<ProductsData> = useCallback(({ item }) => {
    return (
      <BProductCard
        name={item.name}
        volume={item.volume}
        pricePerVol={item.pricePerVol}
        totalPrice={item.totalPrice}
        backgroundColor={colors.white}
        containerStyle={styles.productCardContainer}
      />
    );
  }, []);

  const renderItemSeparator = () => {
    return (
      <BDivider
        borderColor={colors.tertiary}
        marginHorizontal={layout.pad.md}
      />
    );
  };

  return (
    <View style={styles.customerCard}>
      <View style={styles.parentContainer}>
        <View style={styles.checkBoxContainer}>
          <BForm inputs={checkbox} />
        </View>
        <View style={styles.expandableContainer}>
          <View style={styles.topCard}>
            <BText type="title">{sphNo}</BText>
          </View>
          <View style={styles.textContentContainer}>
            <BText style={styles.parentPrice}>harga</BText>
            <BText style={styles.totalParentPrice}>{`IDR ${formatCurrency(
              totalPrice!
            )}`}</BText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={{
            transform: [expanded ? { rotate: '180deg' } : { rotate: '0deg' }],
            ...styles.chevron,
          }}
        >
          <Icon name="chevron-down" size={25} color={colors.icon.darkGrey} />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={styles.bottomCard}>
          <FlatList
            data={productsData}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={renderItemSeparator}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customerCard: {
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    padding: layout.pad.md,
  },
  parentContainer: { flexDirection: 'row' },
  checkBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.pad.ml,
    paddingTop: layout.pad.lg,
  },
  expandableContainer: { flex: 1, minHeight: resScale(56) },
  textContentContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  topCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  parentPrice: {
    fontFamily: font.family.montserrat['300'],
    fontSize: font.size.xs,
    color: colors.text.darker,
    marginRight: layout.pad.xl + layout.pad.sm,
  },
  totalParentPrice: {
    fontFamily: font.family.montserrat['500'],
    fontSize: font.size.sm,
    color: colors.text.darker,
  },
  bottomCard: {
    marginTop: layout.pad.sm,
    overflow: 'hidden',
  },
  productCardContainer: {
    borderRadius: 0,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BExpandableSphCard;
