import React from 'react';
import { TypedNavigator } from '@react-navigation/native';
import { Text, View } from 'react-native';
import BStackScreen from '@/navigation/elements/BStackScreen';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';

function DetailsScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Details Screen</Text>
    </View>
  );
}

function DetailsScreen2() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Details Screen 2</Text>
    </View>
  );
}

const VisitationStack = ({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) => {
  return <CreateVisitation />;
};

function TestStack({
  Stack,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
}) {
  return [
    BStackScreen({
      Stack: Stack,
      name: 'Details',
      title: 'Details',
      component: DetailsScreen,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Details2',
      title: 'Details2',
      component: DetailsScreen2,
    }),
    BStackScreen({
      Stack: Stack,
      name: 'Create Visitation',
      title: 'Create Visitation',
      component: CreateVisitation,
    }),
  ];
}

export default TestStack;
