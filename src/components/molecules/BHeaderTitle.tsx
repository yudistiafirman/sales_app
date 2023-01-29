import { BText } from '@/components';
import { colors } from '@/constants';
import { Styles } from '@/interfaces';
import { View, Text } from 'react-native';
import { resScale } from '@/utils';
import { fonts } from '@/constants';
import respFS from '@/utils/resFontSize';

const BHeaderTitle = (
  title: string,
  headerStyle: 'flex-start' | 'center',
  role: string = ''
) => {
  const _styles: Styles = {
    container: {
      flex: 1,
    },
    chipView: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginHorizontal: resScale(36),
    },
    chip: {
      padding: resScale(2),
      paddingHorizontal: resScale(8),
      backgroundColor: colors.chip.green,
      borderRadius: resScale(4),
    },
    chipText: {
      fontFamily: fonts.family.montserrat[300],
      fontSize: respFS(10),
      color: colors.textInput.input,
    },
    headerTitleStyle: {
      alignSelf: headerStyle,
    },
  };

  return (
    <View style={_styles.container}>
      {role === 'Transport' || role === 'Dispatch' ? (
        <View style={_styles.container}>
          <BText type="header" style={_styles.headerTitleStyle}>
            {title}
          </BText>
          <View style={_styles.chipView}>
            <View style={_styles.chip}>
              <Text style={_styles.chipText}>{role}</Text>
            </View>
          </View>
        </View>
      ) : (
        <BText type="header" style={_styles.headerTitleStyle}>
          {title}
        </BText>
      )}
    </View>
  );
};

export default BHeaderTitle;
