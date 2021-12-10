import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Speech from 'expo-speech';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  Monkey: require('../assets/monkey.ttf'),
};

export default class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: 'white',
      speakerIcon: 'volume-high-outline',
      light_theme: true,
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

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };

  async initiateTTS(caption, author, posted_on, description) {
    const currentColor = this.state.speakerColor;
    this.setState({
      speakerColor: currentColor == 'white' ? '#eeb249' : 'white',
    });
    if (currentColor == 'white') {
      Speech.speak(`${caption} by ${author}`);
      Speech.speak(posted_on);
      Speech.speak(description);
    } else {
      Speech.stop();
    }
  }

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate('Home');
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let img = this.props.route.params.story.img;

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
                Stellegram
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardLight
                  : styles.storyCard
              }>
              <Image source={{ uri: img }} style={styles.image}></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyTitleTextLight
                        : styles.storyTitleText
                    }>
                    {this.props.route.params.story.caption}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }>
                    {this.props.route.params.story.author}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextLight
                        : styles.storyAuthorText
                    }>
                    {this.props.route.params.story.posted_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.initiateTTS(
                        this.props.route.params.story.caption,
                        this.props.route.params.story.author,
                        this.props.route.params.story.posted_on,
                        this.props.route.params.story.description
                      );
                    }}>
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style={styles.moralText}>
                  {this.props.route.params.story.description}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons name={'heart'} size={RFValue(30)} color={'white'} />
                  <Text style={styles.likeText}>14k</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
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
    fontSize: RFValue(23),
    fontFamily: 'Monkey',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'monkey',
  },
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  storyCardLight: {
    margin: RFValue(20),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    fontFamily: 'Monkey',
    fontSize: RFValue(20),
    color: 'white',
  },
  storyTitleTextLight: {
    fontFamily: 'monkey',
    fontSize: RFValue(25),
    color: 'black',
  },
  storyAuthorText: {
    fontFamily: 'Monkey',
    fontSize: RFValue(15),
    color: 'white',
  },
  storyAuthorTextLight: {
    fontFamily: 'monkey',
    fontSize: RFValue(18),
    color: 'black',
  },
  iconContainer: {
    flex: 0.2,
  },
  storyTextContainer: {
    padding: RFValue(20),
  },
  moralText: {
    fontFamily: 'Monkey',
    fontSize: RFValue(17),
    color: 'white',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Monkey',
    fontSize: RFValue(10),
    marginLeft: RFValue(5),
  },
});
