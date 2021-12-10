import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import PostCard from './postCard';
import firebase from 'firebase';

var customFont = {
  Monkey: require('../assets/monkey.ttf'),
};

var stories = require('./temp_post.json');

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: [],
    };
  }

  async _LoadFonts() {
    await Font.loadAsync(customFont);
    this.setState({
      fontLoaded: true,
    });
  }
  componentDidMount() {
    this._LoadFonts();
    this.fetchStories();
    this.fetchUsers();
  }

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item: story }) => {
    return <PostCard story={story} navigation={this.props.navigation} />;
  };

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

  fetchStories = () => {
    firebase
      .database()
      .ref('/posts/')
      .on(
        'value',
        (data) => {
          let stories = [];
          if (data.val()) {
            Object.keys(data.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: data.val()[key],
              });
            });
          }
          this.setState({
            stories: stories,
          });
          this.props.setUpdateToFalse();
        },
        function (error) {
          console.log('Error while reading' + error.code);
        }
      );
  };

  render() {
    if (!this.state.fontLoaded) {
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
                STELLEGRAM
              </Text>
            </View>
          </View>
          {!this.state.stories[0] ? (
            <View style={styles.noStories}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.noStoriesTextLight
                    : styles.noStoriesText
                }>
                No Stories Available
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.stories}
                renderItem={this.renderItem}
              />
            </View>
          )}
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
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.1,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.2,
    height: RFValue(65),
    width: RFValue(65),
  },
  iconImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(17),
    marginLeft: RFValue(27),
    fontFamily: 'Monkey',
  },

  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(20),
    fontFamily: 'Monkey',
  },

  cardContainer: {
    flex: 0.93,
  },
});

