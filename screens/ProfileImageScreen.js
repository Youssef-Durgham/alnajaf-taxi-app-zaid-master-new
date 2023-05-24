import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

const ProfileImageScreen = () => {
  const navigation = useNavigation();
  const [resourcePath, setResourcePath] = useState({});
  const route = useRoute();
  const {
    fullName,
    phoneNumber,
    password,
    signupoption,
    signinoption,
    locations,
    locationtitle,
    birthdate,
    deviceToken,
    cartype,
    carmodel,
    carcolor,
    carpassenger,
    carnumber,
    carnumberword,
    carnumberregion,
    scannedImages,
  } = route.params;

  const selectFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, res => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        setResourcePath(res);

        // Navigate to the next screen and pass the image data
        navigation.navigate('MapSignup', {
          fullName,
          phoneNumber,
          password,
          signupoption,
          signinoption,
          locations,
          locationtitle,
          birthdate,
          deviceToken,
          cartype,
          carmodel,
          carcolor,
          carpassenger,
          carnumber,
          carnumberword,
          carnumberregion,
          scannedImages,
          imageData: res,
        });
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
      <Text
        style={{
          textAlign: 'center',
          color: 'black',
          fontSize: 20,
          marginBottom: 20,
        }}>
        اختر صورتك الشخصية
      </Text>

      <View className="my-auto">
        <TouchableOpacity
          className="h-10 w-[75%] mx-auto rounded-full"
          onPress={selectFile}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#4b63ac', '#a05193', '#e51978']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.5, 1]}
            angle={45}
            className="rounded-full"
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
              اختر صورتك الشخصية
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ProfileImageScreen);
