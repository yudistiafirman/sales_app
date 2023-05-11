import React from 'react';
import { SafeAreaView, TouchableOpacity, View, ViewStyle } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import resScale from '@/utils/resScale';
import TncNavBar from '@/screens/Price/element/TncNavBar';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import tncHTML from './TncHtml';

interface TncProps {
  isVisible?: boolean | undefined;
  onCloseTnc: () => void;
}

function Tnc({ isVisible, onCloseTnc }: TncProps) {
  const webViewStyle: ViewStyle = {
    backgroundColor: colors.white,
    width: '100%',
  };

  const contentContainer: ViewStyle = {
    flex: 1,
    marginRight: layout.pad.lg,
  };

  const loadingContainer: ViewStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const htmlStyle = `
  body {
    width: 100%;
    height: 100%;
  }`;

  const leftIcon = () => (
    <TouchableOpacity onPress={onCloseTnc}>
      <Icon name="close" size={resScale(19)} color={colors.text.darker} />
    </TouchableOpacity>
  );

  return (
    <Modal style={{ margin: 0 }} isVisible={isVisible}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <TncNavBar leftComponent={leftIcon()} headerTitle="Ketentuan" />
        <View style={contentContainer}>
          <AutoHeightWebView
            customStyle={htmlStyle}
            source={{ html: tncHTML }}
            style={webViewStyle}
            startInLoadingState
            renderLoading={() => (
              <View style={loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default Tnc;
