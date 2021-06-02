import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import WelcomeScreen from './Screens/WelcomeScreen';
import { TabNavigator } from './components/AppTabNavigator';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  } 
}
const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  AppDrawerNavigator: { screen: AppDrawerNavigator},
  BottomTab: { screen: TabNavigator },
  
});   

const AppContainer = createAppContainer(switchNavigator);
