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
  Image,
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class Buy extends Component {
  constructor() {
    super();
    this.state = {
      userName: firebase.auth().currentUser.email,
      itemName: '',
      isOrderActive: '',
      orderInfo: '',
      orderStatus:'',
      requestId:'',
      requestedItemName: '',
      docId: '',
      itemInfo:'', 
      
      }
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  OrderItem = async(itemName) => {
    var randomRequestId = this.createUniqueId();
    var userName = this.state.userName;
    db.collection('order_requests').add({
      username: userName,
      item_name: itemName,
      order_status: 'placed',
      request_id: randomRequestId,
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    
    await this.getOrderPlaced();
    db.collection('users')
      .where('username', '==', userName)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            IsOrderActive: true,
          });
        });
      });
    this.setState({
      itemName: '',
      requestId: randomRequestId,
    });

    return alert('Order has been placed', '', [
      {
        text: 'OK',
        onPress: () => {
          this.props.navigation.navigate('HomeScreen');
        },
      },
    ]);
  };
  acceptedOrders = (itemName) => {
    if(this.state.orderStatus=="interested"){
    var userId = this.state.userName;
    var requestId = this.state.requestId;
    db.collection('accepted_orders').add({
      user_id: userId,
      item_name: itemName,
      request_id: requestId,
      order_status: 'accepted',
    });
    }
  };

  getIsOrderActive() {
    db.collection('users')
      .where('username', '==', this.state.userName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            isOrderActive: doc.data().IsOrderActive,
            userDocId: doc.id,
          });
        });
      });
  }
  getOrderPlaced = () => {
    // getting the requested book
    var OrderRequest = db
      .collection('order_requests')
      .where('username', '==', this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().order_status !== 'accepted') {
            
            this.setState({
              requestId: doc.data().request_id,
              requestedItemName: doc.data().item_name,
              orderStatus: doc.data().order_status,
              docId: doc.id,
              itemName:doc.data().item_name
            });
            
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection('users')
      .where('username', '==', this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and book nam
          db.collection('all_notifications')
            .where('request_id', '==', this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var acceptedId = doc.data().orderAccepted_id;
                var itemName = doc.data().item_name;

                //targert user id is the donor id to send notification to the user
                db.collection('all_notifications').add({
                  targeted_user_id: acceptedId,
                  message:
                    name + ' ' + lastName + ' accepted the order for' + itemName,
                  notification_status: 'unread',
                  item_name: itemName,
                });
              });
            });
        });
      });
  };

  updateOrderStatus = () => {
    //updating the book status after receiving the book
    if(this.state.orderStatus=="interested"){
    db.collection('order_requests').doc(this.state.docId).update({
      order_status: 'accepted',
    });

    //getting the  doc id to update the users doc
    db.collection('users')
      .where('username', '==', this.state.userName)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection('users').doc(doc.id).update({
            IsOrderActive: false,
          });
        });
      });
  }
  };

  componentDidMount() {
    this.getOrderPlaced();
    this.getIsOrderActive();
  }
  
  render() {
    if (this.state.isOrderActive === true) {
      return (
        
        <View style={{ flex: 1 }}>         
          <View style={{flex: 0.1}}>
            <MyHeader title="Order Status" navigation={this.props.navigation} />
          </View>
          <View style={styles.orderstatus}>
            <Text style={{fontSize: 20, marginTop:30}}>Order: </Text>
            <Text style={styles.orderrequested}>{this.state.itemName} </Text>
            <Text style={styles.status}>Status: </Text>
            <Text style={styles.orderStatus1}>{this.state.orderStatus}</Text>
           
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
             
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateOrderStatus();
                this.acceptedOrders(this.state.requestedItemName);
              }}>
              <Text style={styles.buttontxt}>Accepted the Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Order Grocery" navigation={this.props.navigation} />
        <KeyboardAvoidingView>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TextInput
              style={styles.formTextInput}
              placeholder={'Item Name'}
              numberOfLines={10}
              multiline
              onChangeText={(text) => {
                this.setState({ itemName: text });
              }}
              value={this.state.itemName}
            />
          </View>
        </KeyboardAvoidingView>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[styles.button, { marginTop: 50, width: '75%' }]}
            onPress={() => {
              this.OrderItem(this.state.itemName);
            }}>
            <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>
              Place the Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#3300FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  orderstatus: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
    orderrequested: {
    fontSize: 15,
    fontWeight: '200',
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 60,
  },
  status: {
    fontSize: 20,
    marginTop: 30,
  },
    orderStatus1: {
    fontSize: 15,
    fontWeight: '200',
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    marginLeft: 60,
  },
  buttonView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

});
