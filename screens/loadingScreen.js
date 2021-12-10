import React from 'react';
import {View, Text} from 'react-native';
import firebase from 'firebase';

export default class LoadingScreen extends React.Component{
  componentDidMount(){
    this.checkIfLoggedIn();
  }
  checkIfLoggedIn=()=>{
    firebase.auth().onAuthStateChanged((user)=>{
         if(user){
           this.props.navigation.navigate("DashboardScreen")
         }
         else{
           this.props.navigation.navigate("LoginScreen")
         }
    })
  }
  render(){
    return(
      <View>
          <Text>Loading</Text>
      </View>
    )
  }
}