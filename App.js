import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from './screens/loadingScreen';
import LoginScreen from './screens/loginScreen';
import DashboardScreen from './screens/dashBoardScreen';
import firebase from 'firebase';
import { firebaseConfig } from './config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}