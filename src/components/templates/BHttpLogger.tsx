import * as React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Draggable from 'react-native-draggable';
import Modal from 'react-native-modal';
import NetworkLogger from 'react-native-network-logger';
import Icon from 'react-native-vector-icons/Feather';
import { colors, layout } from '@/constants';

const styles = StyleSheet.create({
  close: {
    borderRadius: layout.radius.xl,
    backgroundColor: colors.text.darker,
    borderWidth: 1,
    padding: layout.pad.xs,
    alignSelf: 'flex-end',
    zIndex: 1,
    marginBottom: -layout.pad.md,
  },
  container: {
    borderRadius: layout.radius.xl,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: layout.pad.md,
  },
  button: {
    alignItems: 'flex-end',
  },
});

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

interface BHttpLoggerProps {
  isShowButtonNetwork: boolean;
  isNetworkLoggerVisible: boolean;
  setShowButtonNetwork: () => void;
  setVisibleNetworkLogger: () => void;
}

function BHttpLogger({
  isShowButtonNetwork,
  isNetworkLoggerVisible,
  setShowButtonNetwork,
  setVisibleNetworkLogger,
}: BHttpLoggerProps) {
  return (
    <>
      {isShowButtonNetwork && (
        <>
          <Draggable maxX={width} minX={0} x={width - 50} y={100} minY={20} maxY={height}>
            <>
              <TouchableOpacity style={styles.close} onPress={setShowButtonNetwork}>
                <Icon name="x" size={10} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={setVisibleNetworkLogger} style={styles.container}>
                <Icon name="cloud" size={30} color={colors.primary} />
              </TouchableOpacity>
            </>
          </Draggable>
          <Modal
            backdropOpacity={0.5}
            backdropColor={colors.text.darker}
            hideModalContentWhileAnimating
            coverScreen
            isVisible={isNetworkLoggerVisible}
            style={{ margin: layout.pad.xl }}>
            <TouchableOpacity onPress={setVisibleNetworkLogger} style={styles.button}>
              <Icon name="x" size={30} color={colors.white} />
            </TouchableOpacity>
            <NetworkLogger />
          </Modal>
        </>
      )}
    </>
  );
}

export default BHttpLogger;
