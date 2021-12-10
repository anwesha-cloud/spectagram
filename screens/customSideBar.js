import React from 'react';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

export default class CustomSideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      light_theme: false,
    };
  }
  componentDidMount() {
    this.fetchUsers();
  }
  fetchUsers = () => {
    var theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (data) {
        theme = data.val().current_theme;
      });

    this.setState({
      light_theme: theme == 'light' ? true : false,
    });
  };
  render() {
    var props = this.props;
    return (
      <View style={{flex:1,backgroundColor:this.state.light_theme?'white':'#15193c'}}>
        <Image styles={styles.sideMenuProfileIcon} source={require('../assets/logo.png')} />
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }
}

const styles=StyleSheet.create({
sideMenuProfileIcon:{
  width:RFValue(140),
  height:RFValue(140),
  borderRadius:RFValue(70),
  alignSelf:'center',
  marginTop:RFValue(60),
  resizeMode:'contain',
}})