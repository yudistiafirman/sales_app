import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BPic, BSpacer, BText } from '@/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, layout } from '@/constants';
import { customerDataInterface } from '@/interfaces';

export default function ExpandableCustomerCard({
  item,
}: {
  item: customerDataInterface;
}) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  function changeLayout() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((curr) => !curr);
  }

  function bottomCardHeight(): ViewStyle | null {
    return expanded ? null : { height: 0 };
  }

  return (
    <View style={styles.customerCard}>
      <View style={styles.topCard}>
        <BText type="title">
          {item.display_name ? item.display_name : item.picName}
        </BText>
        <TouchableOpacity
          onPress={changeLayout}
          style={{
            transform: [expanded ? { rotate: '180deg' } : { rotate: '0deg' }],
          }}
        >
          <Icon name="chevron-down" size={25} color={colors.icon.darkGrey} />
        </TouchableOpacity>
      </View>
      <View style={[bottomCardHeight(), styles.bottomCard]}>
        <BText>{item.type}</BText>
        <BSpacer size="medium" />
        <BPic
          name={item.name}
          email={item.email ? item.email : undefined}
          phone={item.phone}
          position={item.position}
          border={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerCard: {
    backgroundColor: colors.tertiary,
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
  },
  topCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomCard: {
    overflow: 'hidden',
  },
});
