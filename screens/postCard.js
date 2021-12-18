import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import IonIcons from 'react-native-vector-icons/Ionicons';
import firebase from "firebase";

let customFonts = {
  Monkey: require('../assets/monkey.ttf'),
};

export default class PostCard extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      light_theme: true,
      post_id: post.key,
      post_data: post.value,
      is_liked: false,
      likes: post.value.likes,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };

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

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Post', {
              post: post,
            });
          }}>
          <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
            <View  style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }>
              <View style={styles.titleContainer}>
                <Image
                  style={styles.profileImg}
                  source={require('../assets/profile_img.png')}
                />
                <Text style={
                    this.state.light_theme
                      ? styles.authorTextLight
                      : styles.authorText
                  }>
                  {post.author}
                </Text>
                <Image
                  style={styles.storyImage}
                  source={{ uri: post.img }}
                />
                <Text style={
                    this.state.light_theme
                      ? styles.storyTitleTextLight
                      : styles.storyTitleText
                  }>
                  {post.caption}
                </Text>
                <Text style={
                    this.state.light_theme
                      ? styles.descriptionTextLight
                      : styles.descriptionText
                  }>
                  {post.description}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <IonIcons size={RFValue(30)} color={'white'} name="heart" />
                  <Text style={styles.likeText}>14 K</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: '#566573',
    borderRadius: RFValue(20),
  },
  cardContainerLight: {
    margin: RFValue(13),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },

  storyImage: {
    resizeMode: 'contain',
    width: '85%',
    alignSelf: 'center',
    marginLeft: RFValue(-20),
    height: RFValue(250),
  },
  titleContainer: { paddingLeft: RFValue(20), justifyContent: 'center' },
  storyTitleText: {
    fontSize: RFValue(17),
    fontFamily: 'Monkey',
    color: 'white',
  },
  storyTitleTextLight: {
    fontSize: RFValue(17),
    fontFamily: 'Monkey',
    color: 'black',
  },
  profileImg: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginTop: RFValue(23),
    resizeMode: 'contain',
  },
  authorText: {
    fontSize: RFValue(14),
    fontFamily: 'Monkey',
    color: 'white',
    marginLeft: RFValue(50),
    marginTop: RFValue(-44),
  },
  authorTextLight: {
    fontSize: RFValue(14),
    fontFamily: 'Monkey',
    color: 'black',
    marginLeft: RFValue(50),
    marginTop: RFValue(-44),
  },
  descriptionText: {
    fontFamily: 'Monkey',
    fontSize: 10,
    color: 'white',
    paddingTop: RFValue(10),
  },
  descriptionTextLight: {
    fontFamily: 'Monkey',
    fontSize: 10,
    color: 'black',
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Monkey',
    fontSize: RFValue(13),
    marginLeft: RFValue(5),
    marginTop: RFValue(5),
  },
});
