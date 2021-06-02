import React, { Component} from 'react';
import { View, Text, StyeSheet, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../Screens/HomeScreen'
import Buy from '../Screens/BuyThingsScreen';
import {AppStackNavigator} from './AppStackNavigator';
import {Icon} from 'react-native-elements';

export const TabNavigator = createBottomTabNavigator({
  
    HomeScreen : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Icon
            name="list"
            type="Feather"
            color="#696969"
          />,
      tabBarLabel : "HomeScreen",
    }
  },
 BuyThings: {
    screen: Buy,
    navigationOptions :{
      tabBarIcon : <Icon
            name="local-grocery-store"
            type="MaterialIcons"
            color="#696969"
          />,
      tabBarLabel : "Purchase Grocery",
    }
  }
  }
);