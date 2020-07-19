import React from 'react';
import {Image} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import {TabImage} from './../AppStyles';

//Home
const Home = createStackNavigator({
  Home: {screen: HomeScreen},
});

//Menu
const Profile = createStackNavigator({
  Profile: {screen: ProfileScreen},
});

//TabNavigator
const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={[TabImage.homeTabImage, {tintColor: tintColor}]}
            source={require('../../assets/home.png')}
          />
        ),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Image
            style={[TabImage.homeTabImage, {tintColor: tintColor}]}
            source={require('../../assets/menu.png')}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#e91e63',
    },
  },
);

export default BottomTabNavigator;
