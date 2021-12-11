import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

let customFonts = {
  monkey: require('../assets/monkey.ttf'),
};

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropdownHeight: 40,
      title: '',
      description: '',
      author: firebase.auth().currentUser.uid,
      posted_on:new Date()
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
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

  addPost() {
    if (this.state.title && this.state.description) {
      firebase
        .database()
        .ref('/posts/' + Math.random().toString(36).slice(2))
        .set({
          title: this.state.title,
          author: firebase.auth().currentUser.displayName,
          authorUid: this.state.author,
          previewImage: this.state.previewImage,
          description: this.state.description,
          posted_on: this.state.posted_on,
        });
    } else {
      Alert.alert('FILL IN ALL THE FIELDS');
    }
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image_1: require('../assets/image_1.jpg'),
        image_2: require('../assets/image_2.jpg'),
        image_3: require('../assets/image_3.jpg'),
        image_4: require('../assets/image_4.jpg'),
        image_5: require('../assets/image_5.jpg'),
        image_6: require('../assets/image_6.jpg'),
        image_7: require('../assets/image_7.jpg'),
      };
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
                style={styles.iconImage} />
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                New Post
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}/>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: 'Image 1', value: 'image_1' },
                    { label: 'Image 2', value: 'image_2' },
                    { label: 'Image 3', value: 'image_3' },
                    { label: 'Image 4', value: 'image_4' },
                    { label: 'Image 5', value: 'image_5' },
                    { label: 'Image 6', value: 'image_6' },
                    { label: 'Image 7', value: 'image_7' },
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 50,

                    marginBottom: 20,
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{ backgroundColor: 'transparent' }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  dropDownStyle={{ backgroundColor: 'black' }}
                  labelStyle={{
                    color: 'white',
                    fontFamily: 'Monkey',
                    fontSize: 10,
                  }}
                  arrowStyle={{
                    color: 'white',
                    fontFamily: 'Monkey',
                  }}
                  onChangeItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                />
              </View>
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(title) =>
                  this.setState({
                    title: title,
                  })
                }
                placeholder={'Title'}
                placeholderTextColor= {this.state.light_theme? " black":"white"}
              />
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(author) =>
                  this.setState({
                    author,
                  })
                }
                placeholder="Author"
                placeholderTextColor={this.state.light_theme? " black":"white"}
                multiline={true}
                numberOfLines={4}
              />
              <TextInput
                style={[
                  this.state.light_theme
                    ? styles.inputFontLight
                    : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(description) =>
                  this.setState({
                    description: description,
                  })
                }
                placeholder="Description"
                placeholderTextColor={this.state.light_theme? " black":"white"}
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity 
                style={styles.button}
                onPress=
                {() => {
                  this.addPost();
                }}>
                  <Text style={styles.buttonText}>Create</Text>
                
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={{ flex: 0.08 }} />
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
    fontSize: RFValue(28),
    fontFamily: 'monkey',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'monkey',
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: '93%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    fontFamily: 'monkey',
  },
  inputFontLight: {
    height: RFValue(40),
    borderColor: 'black',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'black',
    fontFamily: 'monkey',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  button:{
    height:RFValue(50),
    width: RFValue(100),
    borderWidth :RFValue(3),
    borderColor:"white",
    backgroundColor:"rgb(253, 95, 49 )",
    marginTop:RFValue(50),
    borderRadius:RFValue(35),
    justifyContent:'center',
    marginLeft:RFValue(45)
  },
  buttonText:{
    textAlign :"center", 
    fontWeight:'bold',
    fontSize:RFValue(18)
    
  }
});
