import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import {HomeIcon, QueueListIcon} from 'react-native-heroicons/mini';

const BottomTab = createBottomTabNavigator();

const BottomTabScreen = ({initialRouteName, handleSignOut}) => {
  return (
    <BottomTab.Navigator
      initialRouteName={initialRouteName === 'Setting' ? 'Setting' : 'Home'}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#212121',
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          backgroundColor: '#212121',
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          height: 70,
          borderTopWidth: 0,
          // shadowColor: '#171717',
          // shadowOffset: {width: 0, height: -0.1},
          // shadowOpacity: 0.2,
          // shadowRadius: 3,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View>
              <HomeIcon
                size={25}
                style={{
                  color: focused ? '#ffc20d' : '#d8d8d8',
                }}
              />
            </View>
          ),
        }}
        initialParams={{handleSignOut: handleSignOut}}
      />
      {/* <BottomTab.Screen
        name="User Setting"
        component={UsersettingScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <UserCircleIcon
                size={25}
                style={{
                  color: focused ? "#ffc20d" : "#d8d8d8",
                }}
              />
            </View>
          ),
        }}
      /> */}
      <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View>
              <QueueListIcon
                size={25}
                style={{
                  color: focused ? '#ffc20d' : '#d8d8d8',
                }}
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabScreen;
