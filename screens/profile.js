import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  monkey: require('../assets/monkey.ttf'),
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: '',
      name: '',
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser() {
    var theme, name, image;
    await firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        image = snapshot.val().profile_picture;
        console.log('Hello' + image);
      });

    this.setState({
      light_theme: theme == 'light' ? true : false,
      isEnabled: theme == 'light' ? false : true,
      name: name,
      profile_image: image,
    });
  }
  toggleSwitch() {
    const previousState = this.state.isEnabled;
    const theme = !previousState ? 'dark' : 'light';
    firebase
      .database()
      .ref('users/' + firebase.auth().currentUser.uid)
      .update({
        current_theme: theme,
      });
    this.setState({
      isEnabled: !previousState,
      light_theme: previousState,
    });
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: this.state.profile_image }}
                style={styles.profileImage}></Image>
              <Text
                style={
                  this.state.light_theme
                    ? styles.nameTextLight
                    : styles.nameText
                }>
                {this.state.name}
              </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.themeTextLight
                    : styles.themeText
                }>
                Theme
              </Text>
              <Switch
                trackColor={{
                  false: '#767577',
                  true: this.state.light_theme ? '#eee' : 'white',
                }}
                thumbColor={this.state.isEnabled ? '#ee8249' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  this.toggleSwitch();
                }}
                value={this.state.isEnabled}
              />
            </View>
            <View />
          </View>
          <View />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(18),
    fontFamily: 'monkey',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(18),
    fontFamily: 'monkey',
  },

  screenContainer: {
    flex: 0.85,
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
  },
  nameText: {
    color: 'white',
    fontSize: RFValue(20),
    fontFamily: 'monkey',
    marginTop: RFValue(10),
  },
  nameTextLight: {
    color: 'black',
    fontSize: RFValue(20),
    fontFamily: 'monkey',
    marginTop: RFValue(10),
  },

  themeContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(20),
  },
  themeText: {
    color: 'white',
    fontSize: RFValue(15),
    fontFamily: 'monkey',
    marginRight: RFValue(15),
  },
  themeTextLight: {
    color: 'black',
    fontSize: RFValue(15),
    fontFamily: 'monkey',
    marginRight: RFValue(15),
  },
});
