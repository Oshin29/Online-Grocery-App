import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class ReceiverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      itemName: this.props.navigation.getParam('details')['item_name'],
      recieverId: this.props.navigation.getParam('details')['username'],
      recieverName: '',
      recieverContact: '',
      recieverAddress: '',
      recieverRequestDocId: '',
      docId: '',
      emailId:'',
    };
  }

  getRecieverDetails() {
    db.collection('users')
      .where('username', '==', this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverName: doc.data().first_name,
            recieverContact: doc.data().mobile_number,
            recieverAddress: doc.data().address,
           emailId: doc.data().username,
          });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection('users')
      .where('username', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };
  getDocIdOrderRequest=()=>{
    db
      .collection('order_requests')
      .where('username', '==', this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().order_status !== 'accepted') {
            this.setState({
              docId: doc.id,
            });
          }
        });
      });
  }

  updateOrderStatus = () => {
    db.collection('order_requests').doc(this.state.docId).update({
      order_status: 'interested',
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + ' has shown interest in delivering the order';
    db.collection('all_notifications').add({
      targeted_user_id: this.state.recieverId,
      orderAccepted_id: this.state.userId,
      item_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: 'unread',
      message: message,
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userId);
    this.getDocIdOrderRequest();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: 'Order Placed',
              style: { color: '#90A5A9', fontSize: 20, fontWeight: 'bold' },
            }}
            backgroundColor="#eaf8fe"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card title={'Items Information'} titleStyle={{ fontSize: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {this.state.itemName}
              </Text>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card
            title={'User Info for Order Placed'}
            titleStyle={{ fontSize: 20 }}>
            
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.recieverName}
              </Text>

            
              <Text style={{ fontWeight: 'bold' }}>
                Contact: {this.state.recieverContact}
              </Text>
            
            
              <Text style={{ fontWeight: 'bold' }}>
                Address: {this.state.recieverAddress}
              </Text>
      
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.recieverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateOrderStatus();
                this.addNotification();
                this.props.navigation.navigate('HomeScreen');
              }}>
              <Text>Interested</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
