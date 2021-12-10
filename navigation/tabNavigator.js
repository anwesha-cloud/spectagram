import React from 'react';
import Feed from '../screens/feed';
import CreatePost from '../screens/createPost';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';

const Tab = createMaterialBottomTabNavigator();

export default class TabNavigator extends React.Component {
  render() {
    return (
      <Tab.Navigator
        labeled={false}
        activeColor={'white'}
        inactiveColor={'gray'}
        barStyle={styles.bottomTabStyle}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Feed') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'CreatePost') {
              iconName = focused ? 'create' : 'create-outline';
            }
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                style={styles.icons}
              />
            );
          },
        })}>
        <Tab.Screen name="Feed" component={Feed} header={false} />
        <Tab.Screen name="CreatePost" component={CreatePost} />
      </Tab.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: 'purple',
    height: '8%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
  },
  icons: {
    width: RFValue(35),
    height: RFValue(35),
  },
});
