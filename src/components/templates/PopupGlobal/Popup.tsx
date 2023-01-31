import Modal from 'react-native-modal';
import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Popup() {
  const isPopUpVisible = useSelector(
    (state: RootState) => state.modal.isPopUpVisible
  );
  return (
    <Modal isVisible={isPopUpVisible}>
      <View>
        <Text>ini popup global</Text>
      </View>
    </Modal>
  );
}
