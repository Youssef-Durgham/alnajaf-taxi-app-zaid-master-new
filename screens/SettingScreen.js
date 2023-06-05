import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
} from 'react-native';
import {Modal, Button, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const SettingScreen = props => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  // const [orderStatus, setOrderStatus] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [note, setNote] = useState('');

  // const fetchOrderStatus = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('jwtToken');
  //     const response = await fetch(
  //       'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/order/status',
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `${token}`,
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       console.log(response);
  //       throw new Error('Error fetching order status');
  //     }

  //     const data = await response.json();
  //     setOrderStatus(data.status);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
      // fetchOrderStatus();
      // return a cleanup function if needed
      return () => {};
    }, []),
  );
  // useEffect(() => {
  //   fetchUserData();
  //   fetchOrderStatus();
  // }, []);

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
    } catch (error) {
      console.error(error);
    }
  };

  const selectFile = () => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, async res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else {
        const {uri, type, fileName} = res.assets[0]; // Get the uri, type and fileName from the assets array
        setUserData({...userData, image: uri});
        await uploadProfilePicture(uri, type, fileName);
      }
    });
  };

  const uploadProfilePicture = async (uri, type, fileName) => {
    console.log(uri);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const result = await RNFetchBlob.fetch(
        'POST',
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/phone/upload-profile-picture',
        {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'profile_image',
            filename: fileName,
            type: type,
            data: RNFetchBlob.wrap(uri),
          },
        ],
      );
      console.log(result.data);
      const responseJson = JSON.parse(result.data);

      if (responseJson.message === 'Profile picture updated successfully') {
        console.log('Profile picture uploaded successfully');
      } else {
        console.log('Error uploading profile picture:', responseJson.message);
      }
    } catch (error) {
      console.log('Error uploading profile picture:', error);
    }
  };

  const handleSignOutPress = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
    } catch (e) {}
    props.route.params.onSignIn(null);
  };

  const handleDeletePress = () => {
    // if (orderStatus) {
    setIsWarningModalVisible(true);
    // } else {
    //   setIsDeleteModalVisible(true);
    // }
  };

  const deleteUser = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/phone/users/delete',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({note}), // Include the note in the request body
        },
      );

      if (!response.ok) {
        console.log(response);
        throw new Error('Error deleting user');
      }
      setNote('');
      handleSignOutPress();
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirmation = async () => {
    setIsDeleteModalVisible(false);

    // Delete the user
    await deleteUser();
  };

  const cancelOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/orders/delete', // replace with your API endpoint
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({note}), // include the note in the request body
        },
      );

      if (!response.ok) {
        throw new Error('Error cancelling the order');
      }
      setNote('');
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelConfirmation = async () => {
    setIsCancelModalVisible(false);

    // Cancel the order
    await cancelOrder();
  };

  return (
    <SafeAreaView className="flex h-full">
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setIsDeleteModalVisible(!isDeleteModalVisible);
        }}>
        <View style={styles.overlay}>
          <View
            className="bg-white rounded-lg p-4"
            style={styles.modalContainer}>
            <Text className="text-center text-lg text-gray-700 mb-4">
              هل أنت متأكد من حذف حسابك؟
            </Text>
            <TextInput
              style={styles.noteInput}
              placeholder="أضف ملاحظة"
              onChangeText={text => setNote(text)}
              value={note}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleDeleteConfirmation}>
                <Text style={styles.buttonText}>نعم</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>لا</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCancelModalVisible}
        onRequestClose={() => {
          setIsCancelModalVisible(!isCancelModalVisible);
        }}>
        <View style={styles.overlay}>
          <View
            className="bg-white rounded-lg p-4 w-[75%]"
            style={styles.modalContainer}>
            <Text className="text-center text-xl text-gray-700 mb-4">
              هل أنت متأكد من إلغاء الاشتراك؟
            </Text>
            <TextInput
              className="bg-slate-300 text-lg h-fit"
              placeholder="سبب الغاء الاشتراك"
              onChangeText={text => setNote(text)}
              value={note}
            />
            <View className="flex-row space-x-5 mx-auto mt-5">
              <TouchableOpacity
                onPress={handleCancelConfirmation}
                className="w-[40%] h-14 rounded-full mx-auto">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#e51978', '#a05193', '#4b63ac']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.4, 1]}
                  angle={45}
                  className="w-full justify-center items-center rounded-full mx-auto p-3 h-14">
                  <Text className="text-center my-auto text-white text-xl font-bold">
                    نعم
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsCancelModalVisible(false)}
                className="w-[40%] h-14 rounded-full mx-auto">
                <LinearGradient
                  // Button Linear Gradient
                  colors={['#e51978', '#a05193', '#4b63ac']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.4, 1]}
                  angle={45}
                  className="w-full justify-center items-center rounded-full mx-auto p-3 h-14">
                  <Text className="text-center my-auto text-white text-xl font-bold">
                    لا
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isWarningModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setIsWarningModalVisible(!isWarningModalVisible);
        }}>
        <View style={styles.overlay}>
          <View
            className="bg-white rounded-lg p-4"
            style={styles.modalContainer}>
            <Text className="text-center text-lg text-gray-700 mb-4">
              يجب عليك إلغاء الاشتراك أولا
            </Text>
            <Button
              title="حسنا"
              onPress={() => setIsWarningModalVisible(false)}
              className="text-blue-500"
            />
          </View>
        </View>
      </Modal>
      {/* <View
        className={`absolute top-0 left-0 m-5 w-20 h-10 rounded-full flex items-center justify-center ${
          orderStatus ? 'bg-green-500' : 'bg-red-500'
        }`}
        onClick={fetchOrderStatus}>
        <Text className="text-white font-bold">
          {orderStatus ? 'فعال' : 'غير فعال'}
        </Text>
      </View> */}
      <View className="relative mb-5 flex items-center  mt-20">
        {userData.image ? (
          <Image
            source={{uri: userData.image}}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
            <Text className="text-center">ليس لديك صورة شخصية</Text>
          </View>
        )}
        <View className="flex items-center justify-center">
          <TouchableOpacity
            className="absolute bottom-0 right-0 left-5 w-7 h-7 rounded-full border-t-2 border-l-2 border-white bg-gray-200 flex items-center justify-center"
            onPress={selectFile}>
            {/* <Text className="text-white font-bold">+</Text> */}
            <Icon name="camera" size={13} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-center text-black font-bold text-2xl mb-5">
        {userData.name}
      </Text>
      <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto rounded-t-xl border-zinc-200"
        onPress={() => navigation.navigate('UserData')}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg font-medium mr-3 mt-0.5">
              معلومات الحساب
            </Text>
            <View className="bg-gray-500 w-8 h-8 justify-center items-center rounded-full">
              <Icon2 name="account" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto border-zinc-200"
        onPress={() => navigation.navigate('Points')}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg font-medium mr-3 mt-0.5">
              نقاطي
            </Text>
            <View className="bg-sky-500 w-8 h-8 justify-center items-center rounded-full">
              <Icon2 name="star-four-points" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto border-zinc-200"
        onPress={() => navigation.navigate('Changeuserlocation')}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg font-medium mr-3 mt-0.5">
              تغيير موقع الانطلاق
            </Text>
            <View className="bg-teal-400 w-8 h-8 justify-center items-center rounded-full">
              <Icon3 name="location-outline" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto border-zinc-200"
        onPress={() => navigation.navigate('OrderData')}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg font-medium mr-3 mt-0.5">
              معلومات الاشتراك
            </Text>
            <View className="bg-cyan-500 w-8 h-8 justify-center items-center rounded-full">
              <Icon name="info" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto border-zinc-200"
        onPress={handleSignOutPress}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg mr-3 font-medium mt-0.5">
              تسجيل الخروج
            </Text>
            <View className="bg-orange-400 w-8 h-8 justify-center items-center rounded-full">
              <Icon4 name="logout" size={22} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        className="border-b bg-white p-2 w-[90%] mx-auto border-zinc-200"
        onPress={() => setIsCancelModalVisible(true)}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg mr-3 font-medium mt-0.5">
              الغاء الاشتراك
            </Text>
            <View className="bg-red-400 w-8 h-8 justify-center items-center rounded-full">
              <Icon2 name="cancel" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        className="bg-white p-2 w-[90%] mx-auto rounded-b-xl"
        onPress={handleDeletePress}>
        <View className="flex-row justify-between items-center">
          <View className="justify-center items-center">
            <Icon5 name="keyboard-arrow-left" size={30} color="#ADB5BD" />
          </View>
          <View className="flex-row justify-end items-center">
            <Text className="text-black text-lg mr-3 font-medium mt-0.5">
              حذف الحساب
            </Text>
            <View className="bg-red-500 w-8 h-8 justify-center items-center rounded-full">
              <Icon2 name="delete-forever" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  noImageText: {
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#ddd',
  },
  changeImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageText: {
    color: 'white',
    fontWeight: 'bold',
  },

  modalContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black color
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 100, // Adjust this value according to your needs
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  rowContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(SettingScreen);
