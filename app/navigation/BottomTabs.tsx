import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import MyPostsScreen from '../screens/Posts/MyPostsScreen';
import MessageListScreen from '../screens/Messaging/MessageListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { BottomTabParamList } from './types';
import { colors } from '../constants/Colors';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      id="BottomTabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Image
                source={require('../assets/homelogo.png')}
                style={[styles.icon, focused && styles.iconFocused]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyPosts"
        component={MyPostsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Image
                source={require('../assets/storyplogo.png')}
                style={[styles.icon, focused && styles.iconFocused]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Image
                source={require('../assets/messlogo.png')}
                style={[styles.icon, focused && styles.iconFocused]}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Image
                source={require('../assets/taologo.png')}
                style={[styles.icon, focused && styles.iconFocused]}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: colors.primarySoft,
  },
  icon: {
    width: 26,
    height: 26,
  },
  iconFocused: {
    tintColor: colors.primary,
  },
});