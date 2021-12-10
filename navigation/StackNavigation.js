import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './tabNavigator';
import PostScreen from '../screens/PostScreen';

const Stack = createStackNavigator();

export default class StackNavigator extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Post" component={PostScreen} />
      </Stack.Navigator>
    );
  }
}
