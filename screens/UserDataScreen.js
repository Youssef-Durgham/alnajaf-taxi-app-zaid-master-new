import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native';
import {ChevronLeftIcon, PencilIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon5 from 'react-native-vector-icons/MaterialIcons';

const customTitles = {
  gender: 'الجنس',
  name: 'الاسم',
  phonenumber: 'رقم الهاتف',
  type: 'النوع',
};

const translations = {
  gender: {
    male: 'ذكر',
    female: 'أنثى',
  },
  type: {
    employee: 'موظف',
    student: 'طالب',
  },
};

const UserDataScreen = props => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/api/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error fetching user data');
      }

      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const translateValue = (key, value) => {
    if (translations[key] && translations[key][value]) {
      return translations[key][value];
    }
    return value;
  };

  return (
    <SafeAreaView className="bg-gray-100">
      <Pressable
        className="mt-5 ml-4 w-20 flex-row"
        onPress={() => navigation.goBack()}>
        <ChevronLeftIcon
          size={35}
          className="font-semibold"
          strokeWidth={2.5}
          color={'#a05193'}
        />
        <Text className="text-xl font-bold -ml-1 mt-0.5 text-[#a05193]">
          رجوع
        </Text>
      </Pressable>
      <View className="p-5 h-screen">
        {loading ? (
          <SkeletonPlaceholder>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <View className="flex-col">
                <View style={{marginLeft: 20}}>
                  <View
                    style={{
                      marginTop: 6,
                      width: 400,
                      height: 35,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={{marginLeft: 20, marginTop: 20}}>
                  <View
                    style={{
                      marginTop: 6,
                      width: 400,
                      height: 35,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={{marginLeft: 20, marginTop: 20}}>
                  <View
                    style={{
                      marginTop: 6,
                      width: 400,
                      height: 35,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={{marginLeft: 20, marginTop: 20}}>
                  <View
                    style={{
                      marginTop: 6,
                      width: 400,
                      height: 35,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            </View>
          </SkeletonPlaceholder>
        ) : (
          <>
            {Object.entries(userData).map(([key, value]) => {
              if (key === 'image') return null; // Do not render the image

              return (
                <View
                  // onPress={() =>
                  //   navigation.navigate('EditUserData', {
                  //     key,
                  //     title: customTitles[key] || key,
                  //     initialValue: value,
                  //     onUpdate: fetchUserData, // Pass fetchUserData as a callback
                  //   })
                  // }
                  key={key}
                  className="flex-row-reverse w-full items-center my-2 p-2 bg-white rounded">
                  {/* Add the PencilIcon component */}
                  <Text className="text-lg font-bold text-black">
                    {customTitles[key] || key}:
                  </Text>
                  <Text className="text-lg mr-4 text-black">
                    {translateValue(key, value)}
                  </Text>
                  {/* <View className="ml-auto">
                    <Icon5 name="edit" size={25} color="#ADB5BD" />
                  </View> */}
                </View>
              );
            })}
            <Pressable
              onPress={() =>
                navigation.navigate('EditUserData', {
                  key: 'password', // Use 'password' as the key
                  title: 'Password', // Provide a title (you can translate this to Arabic)
                  initialValue: '', // Initial value for the password can be empty
                  onUpdate: fetchUserData, // Pass fetchUserData as a callback
                })
              }
              className="flex-row-reverse w-full items-center my-2 p-2 bg-white rounded">
              {/* Add the PencilIcon component */}
              <Text className="text-lg font-bold text-black">
                تغيير كلمة المرور {/* Translate this to Arabic */}
              </Text>
              <View className="ml-auto">
                <Icon5 name="edit" size={25} color="#ADB5BD" />
              </View>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(UserDataScreen);
