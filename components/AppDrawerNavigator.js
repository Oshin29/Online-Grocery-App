import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { TabNavigator } from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';
import NotificationScreen from '../Screens/Notifications';
import SettingScreen from '../Screens/SettingScreen';
import MyPurchasedItems from '../Screens/MyPurchasedItems';
import { Icon } from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    Setting: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="fontawesome5" />,
        drawerLabel: 'Settings',
      },
    },
     Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: 'Notifications',
      },
     },
    MyPurchasedItems: {
      screen: MyPurchasedItems,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: 'My Purchased Grocery',
      },
    },
  },
  {
    contentComponent: SideBarMenu,
  },
  {
    initialRouteName: 'Home',
  }
);
