import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';

export default class SideBarMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      docId: '',
    };
  }
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, name) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/ ' + name);
    return ref.put(blob).then((response) => {
      this.fetchImage(name);
    });
  };

  fetchImage = async (name) => {
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/ ' + name);
    await ref
      .getDownloadURL()
      .then((uri) => {
        this.setState({
          image: uri,
        });
      })
      .catch((error) => {
        this.setState({
          image: '#',
        });
      });
  };
  getUserName() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserName();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5, background: '#F0F8FF', alignItems: 'center' }}>
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size="xlarge"
            onPress={() => {
              this.selectPicture();
            }}
            containerStyle={styles.imageContainer}
            showEditButton
          />
          <Text style={{ fontWeight: '100', fontSize: 20, paddingTop: 10 }}>
            {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('WelcomeScreen');
              firebase.auth().signOut();
            }}>
            <Icon
              name="logout"
              type="antdesign"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(10) }}
            />
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
    flexDirection: 'row',
  },
  logOutButton: {
    width: '100%',
    flexDirection: 'row',
    height: '100%',
  },
  logOutText: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    marginLeft: RFValue(30),
  },
  imageContainer: {
    flex: 0.74,
    width: '60%',
    height: '20%',
    marginTop: 30,
    marginLeft: 10,
    borderRadius: 40,
  },
});
