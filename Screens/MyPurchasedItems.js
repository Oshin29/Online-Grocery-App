import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class MyPurchasedItems extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      myPurchasedItems: [],
    };
  }

  getMyPurchasedItems = () => {
    this.requestRef = db
      .collection('accepted_orders')
      .where('user_id', '==', this.state.userId)
      .where('order_status', '==', 'accepted')
      .onSnapshot((snapshot) => {
        var purchasedItems = snapshot.docs.map((doc) => doc.data());
        this.setState({
         myPurchasedItems : purchasedItems,
        });
      });
  };

  componentDidMount() {
    this.getMyPurchasedItems();
    console.log(this.state.myPurchasedItems)    
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.order_tatus}
        rightElement={this.state.userId}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Purchased Grocery" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.myPurchasedItems.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Purchased Grocery</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.myPurchasedItems}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
