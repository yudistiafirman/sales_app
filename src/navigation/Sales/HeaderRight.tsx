import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { View, Text, NativeModules, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import bStorage from '@/actions/BStorage';
import { signOut } from '@/actions/CommonActions';
import crashlytics from '@react-native-firebase/crashlytics';
import Icon from 'react-native-vector-icons/Feather';
import { BDivider } from '@/components';
const { RNCustomConfig } = NativeModules;

const versionName = RNCustomConfig?.version_name;

const _styles: Styles = {
  fullParent: {
    flex: 1,
  },
  chipView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.pad.lg,
  },
  chip: {
    padding: layout.pad.sm,
    alignItems: 'flex-end',
  },
  chipText: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  moreView: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.sm,
    borderWidth: 1,
    borderColor: colors.lightGray,
    position: 'absolute',
    top: 50,
    right: 15,
    elevation: 8,
  },
  logout: {
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
    alignSelf: 'center',
  },
  version: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.vs,
    paddingHorizontal: layout.pad.md,
    paddingVertical: layout.pad.sm,
    alignSelf: 'center',
    color: colors.text.darker,
  },
};

export default function SalesHeaderRight() {
  const dispatch = useDispatch<AppDispatch>();
  const [isShowMore, setShowMore] = React.useState(false);

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.clearItem();
        dispatch(signout(false));
        crashlytics().setUserId('');
      }
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  const renderMore = () => {
    return (
      <View style={_styles.moreView}>
        <View style={_styles.fullParent}>
          <TouchableOpacity style={_styles.logout} onPress={onLogout}>
            <Text style={_styles.chipText}>{'Logout'}</Text>
          </TouchableOpacity>
          <View>
            <BDivider />
          </View>
          <Text style={_styles.version}>{'APP Version ' + versionName}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMore(!isShowMore)}
        style={_styles.chipView}
      >
        <View style={_styles.chip}>
          <Icon name={'more-vertical'} size={18} color={colors.white} />
        </View>
      </TouchableOpacity>
      {isShowMore && renderMore()}
    </>
  );
}
