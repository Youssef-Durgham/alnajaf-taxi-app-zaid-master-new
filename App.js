import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import Sign_upScreen from './screens/Sign_upScreen';
import MapSignupScreen from './screens/MapSignupScreen';
import Sign_inScreen from './screens/Sign_inScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, ActivityIndicator} from 'react-native';
import {
  HomeIcon,
  UserIcon,
  ListBulletIcon,
} from 'react-native-heroicons/outline';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListScreen from './screens/ListScreen';
import NotificationScreen from './screens/NotificationScreen';
import {I18nManager} from 'react-native';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import OrderScreen from './screens/OrderScreen';
import RegularOrderScreen from './screens/RegularOrderScreen';
import LocationInputScreen from './screens/LocationInputScreen';
import DestinationInputScreen from './screens/DestinationInputScreen';
import ManualLocationInputScreen from './screens/ManualLocationInputScreen';
import SuggestionPlaceScreen from './screens/SuggestionPlaceScreen';
import PhoneInviteNumberScreen from './screens/PhoneInviteNumberScreen';
import VerifyInfoScreen from './screens/VerifyInfoScreen';
import SuccessScreen from './screens/SuccessScreen';
import FailedScreen from './screens/FailedScreen';
import ApiErrorScreen from './screens/ApiErrorScreen';
import RNRestart from 'react-native-restart';
import MapNew from './components/MapsNew';
import {Provider} from 'react-redux';
import {store} from './store';
import CancelScreen from './screens/CancelScreen';
import VipOrderScreen from './screens/VipOrderScreen';
import CaptainInfoScreen from './screens/CaptainInfoScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileImageScreen from './screens/ProfileImageScreen';
import UserDataScreen from './screens/UserDataScreen';
import SupportScreen from './screens/SupportScreen';
import ChangeuserlocationScreen from './screens/ChangeuserlocationScreen';
import {Animated} from 'react-native';
import EditUserDataScreen from './screens/EditUserDataScreen';
import OTPchangephoneScreen from './screens/OTPchangephoneScreen';
import PointsScreen from './screens/PointsScreen';
import GiftScreen from './screens/GiftScreen';
import InviteExplainScreen from './screens/InviteExplainScreen';
import DiscountScreen from './screens/DiscountScreen';
import OrderDataScreen from './screens/OrderDataScreen';
import InternetCheck from './screens/InternetCheck';
import Sign_up_carScreen from './screens/Sign_up_carScreen';
import ScanScreen from './screens/ScanScreen';
import ClientDataScreen from './screens/ClientDataScreen';

const Stack = createStackNavigator();

// here add only bottom navbar screen
const BottomTab = createBottomTabNavigator();
const BottomTabScreen = ({initialRouteName, route}) => {
  return (
    <BottomTab.Navigator
      initialRouteName={initialRouteName === 'Setting' ? 'Setting' : 'Home'}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#f8f9fa',
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          backgroundColor: '#f8f9fa',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 60,
          borderTopWidth: 0,
          // shadowColor: '#171717',
          // shadowOffset: {width: 0, height: -0.1},
          // shadowOpacity: 0.2,
          // shadowRadius: 3,
        },
      }}>
      <BottomTab.Screen
        name="Map"
        component={ListScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View className=" h-full  flex ">
              <View
                className={`mx-auto ${
                  focused && 'bg-[#a05193]'
                } h-12 w-12 items-center mt-1 rounded-full`}>
                <ListBulletIcon
                  size={30}
                  style={{
                    color: focused ? '#e5e0ff' : '#ADB5BD',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                />
              </View>
              {/* <View
                className="mx-auto -mt-0.5"
                style={{
                  width: focused ? 14 : 0,
                  height: focused ? 400 : 0,
                  borderTopWidth: focused ? 14 : 0,
                  borderBottomWidth: focused ? 500 : 0,
                  borderTopColor: focused && '#a66cff',
                  borderBottomColor: focused && '#a66cff',
                  borderLeftWidth: focused ? 7 : 0,
                  borderRightWidth: focused ? 7 : 0,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                }}></View> */}
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View className=" h-full flex ">
              <View
                className={`mx-auto ${
                  focused && 'bg-[#a05193]'
                } h-12 w-12 items-center mt-1 rounded-full`}>
                <HomeIcon
                  size={30}
                  style={{
                    color: focused ? '#e5e0ff' : '#ADB5BD',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                />
              </View>
              {/* <View
                className="mx-auto -mt-0.5"
                style={{
                  width: focused ? 14 : 0,
                  height: focused ? 400 : 0,
                  borderTopWidth: focused ? 14 : 0,
                  borderBottomWidth: focused ? 500 : 0,
                  borderTopColor: focused && '#a66cff',
                  borderBottomColor: focused && '#a66cff',
                  borderLeftWidth: focused ? 7 : 0,
                  borderRightWidth: focused ? 7 : 0,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                }}></View> */}
            </View>
          ),
        }}
        initialParams={{onSignIn: route.params.onSignIn}}
      />

      <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View className=" h-full  flex ">
              <View
                className={`mx-auto ${
                  focused && 'bg-[#a05193]'
                } h-12 w-12 items-center mt-1 rounded-full`}>
                <UserIcon
                  size={30}
                  style={{
                    color: focused ? '#e5e0ff' : '#ADB5BD',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                />
              </View>
              {/* <View
                className="mx-auto -mt-0.5"
                style={{
                  width: focused ? 14 : 0,
                  height: focused ? 400 : 0,
                  borderTopWidth: focused ? 14 : 0,
                  borderBottomWidth: focused ? 500 : 0,
                  borderTopColor: focused && '#a66cff',
                  borderBottomColor: focused && '#a66cff',
                  borderLeftWidth: focused ? 7 : 0,
                  borderRightWidth: focused ? 7 : 0,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                }}></View> */}
            </View>
          ),
        }}
        initialParams={{onSignIn: route.params.onSignIn}}
      />
    </BottomTab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const handleSignIn = async token => {
    if (token) {
      await AsyncStorage.setItem('jwtToken', token);
    } else {
      await AsyncStorage.removeItem('jwtToken');
    }
    setUserToken(token);
    // update navigation state with the userToken
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'BottomTab', params: { userToken: token } }],
    // });
  };
  const handleSignOut = async () => {
    await AsyncStorage.setItem('jwtToken', '');
    setUserToken(null);
  };

  const [isRtl, setIsRtl] = useState(I18nManager.isRTL);

  // useEffect(() => {
  //   const rtl = () => {
  //     if (isRtl !== I18nManager.isRTL) {
  //       I18nManager.forceRTL(isRtl);
  //       RNRestart.Restart();
  //     } else {
  //       I18nManager.allowRTL(isRtl);
  //     }
  //   };
  //   rtl();
  // }, [isRtl]);

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      RNRestart.Restart();
    }
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');

      setUserToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  const forSlide = ({current, next, inverted, layouts: {screen}}) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0,
    );

    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.3, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted,
            ),
          },
        ],
      },
    };
  };

  return (
    <InternetCheck>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* {userToken != null ? ( */}
            {userToken ? (
              <>
                <Stack.Screen
                  name="BottomTab"
                  component={BottomTabScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Notification"
                  component={NotificationScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Changeuserlocation"
                  component={ChangeuserlocationScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Order"
                  component={OrderScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="RegularOrder"
                  component={RegularOrderScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="VipOrder"
                  component={VipOrderScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="LocationInput"
                  component={LocationInputScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="DestinationInput"
                  component={DestinationInputScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="MapNew"
                  component={MapNew}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="ManualLocationInput"
                  component={ManualLocationInputScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="SuggestionPlace"
                  component={SuggestionPlaceScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="PhoneInviteNumber"
                  component={PhoneInviteNumberScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="OrderData"
                  component={OrderDataScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="VerifyInfo"
                  component={VerifyInfoScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="SuccessScreen"
                  component={SuccessScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Failed"
                  component={FailedScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="ApiError"
                  component={ApiErrorScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Cancel"
                  component={CancelScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="CaptainInfo"
                  component={CaptainInfoScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Wallet"
                  component={WalletScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="UserData"
                  component={UserDataScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="TermsAndConditions"
                  component={TermsAndConditionsScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Support"
                  component={SupportScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="EditUserData"
                  component={EditUserDataScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Gift"
                  component={GiftScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Discount"
                  component={DiscountScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="InviteExplain"
                  component={InviteExplainScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Points"
                  component={PointsScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="ClientData"
                  component={ClientDataScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="OTPchangephone"
                  component={OTPchangephoneScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Onboarding"
                  component={OnboardingScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="PrfileImage"
                  component={ProfileImageScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Sign_in"
                  component={Sign_inScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                  initialParams={{onSignIn: handleSignIn}}
                />
                <Stack.Screen
                  name="Sign_up"
                  component={Sign_upScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Sign_up_car"
                  component={Sign_up_carScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MapSignup"
                  component={MapSignupScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="TermsAndConditions"
                  component={TermsAndConditionsScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Scan"
                  component={ScanScreen}
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="OTPVerification"
                  options={{
                    cardStyleInterpolator: forSlide,
                    headerShown: false,
                  }}>
                  {props => (
                    <OTPVerificationScreen {...props} onSignIn={handleSignIn} />
                  )}
                </Stack.Screen>
              </>
            )}

            {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Sign_up" component={Sign_upScreen} options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="Sign_in" component={Sign_inScreen} options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="MapSignup" component={MapSignupScreen} options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen}  />
              <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </InternetCheck>
  );
}
