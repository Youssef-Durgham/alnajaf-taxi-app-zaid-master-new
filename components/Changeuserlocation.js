// import React, {useRef, useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
//   Alert,
//   classNameSheet,
//   SafeAreaView,
//   Modal,
// } from 'react-native';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinearGradient from 'react-native-linear-gradient';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import {
//   ArrowLeftIcon,
//   ChevronLeftIcon,
//   XCircleIcon,
// } from 'react-native-heroicons/outline';

// const MapSignupScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {
//     fullName,
//     phoneNumber,
//     password,
//     gender,
//     occupation,
//     signinoption,
//     signupoption,
//   } = route.params;
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [confirm, setConfirm] = useState('');
//   const [showSpinner, setShowSpinner] = useState(false);
//   const [modalVisible, setModalVisible] = useState(true);
//   const [showMap, setShowMap] = useState(true);

//   const mapRef = useRef(null);

//   const zoomIn = async () => {
//     const camera = await mapRef.current.getCamera();
//     camera.zoom += 1;
//     mapRef.current.animateCamera(camera, {duration: 500});
//   };

//   const zoomOut = async () => {
//     const camera = await mapRef.current.getCamera();
//     camera.zoom -= 1;
//     mapRef.current.animateCamera(camera, {duration: 500});
//   };
//   console.log(confirm);

//   useEffect(() => {
//     (async () => {
//       try {
//         const storedLocation = await AsyncStorage.getItem('userLocation');
//         if (storedLocation) {
//           setLocation(JSON.parse(storedLocation));
//         } else {
//           alert('يرجى تحديد الموقع على الخريطة');
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     })();
//   }, []);
//   const initialRegion = location
//     ? {
//         ...location,
//         latitudeDelta: 0.004,
//         longitudeDelta: 0.004,
//       }
//     : {
//         latitude: 0,
//         longitude: 0,
//         latitudeDelta: 0.004,
//         longitudeDelta: 0.004,
//       };

//   const handlePress = event => {
//     setLocation(event.nativeEvent.coordinate);
//     AsyncStorage.setItem(
//       'userLocation',
//       JSON.stringify(event.nativeEvent.coordinate),
//     );
//   };

//   const handleContinue = async () => {
//     if (location) {
//       setShowSpinner(true);
//       try {
//         console.log(`Phone number: +964${phoneNumber}`);
//         const confirmation = await auth().signInWithPhoneNumber(
//           `+964${phoneNumber}`,
//         );
//         setShowSpinner(false);
//         navigation.navigate('OTPVerification', {
//           fullName,
//           phoneNumber,
//           password,
//           gender,
//           occupation,
//           location,
//           confirm: confirmation, // Pass confirmation directly here
//           signupoption,
//           signinoption,
//           confirmation,
//         });
//       } catch (error) {
//         setShowSpinner(false);
//         console.log(error.message);

//         // Show a warning when the error is 'auth/too-many-requests'
//         if (error.code === 'auth/too-many-requests') {
//           Alert.alert(
//             'تحذير',
//             'لقد قمنا بحظر جميع الطلبات من هذا الجهاز بسبب النشاط غير العادي. يرجى المحاولة مرة أخرى في وقت لاحق.',
//             [{text: 'OK', onPress: () => setModalVisible(true)}],
//           );
//         } else {
//           // Show a generic error message for other errors
//           Alert.alert(
//             'Error',
//             'An error occurred while signing in. Please try again.',
//             [{text: 'OK', onPress: () => setModalVisible(true)}],
//           );
//         }
//       }
//     } else {
//       alert('يرجى تحديد الموقع على الخريطة');
//     }
//   };

//   const goToMarker = async () => {
//     if (location) {
//       const camera = await mapRef.current.getCamera();
//       camera.center = location;
//       mapRef.current.animateCamera(camera, {duration: 500});
//     } else {
//       alert('No marker available to navigate to.');
//     }
//   };

//   const handleYes = async () => {
//     setModalVisible(false);
//     setShowMap(false); // Hide the map
//     await handleContinue();
//   };

//   const handleManual = () => {
//     setModalVisible(false);
//     setShowMap(true); // Show the map when "Add manually" is clicked
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text className="text-black mx-auto text-xl font-bold text-center mb-3">
//               هل تريد اضافة موقعك الحالي كنقطة للانطلاق ؟
//             </Text>
//             <View className="flex flex-row space-x-4 mt-5">
//               <Pressable className="rounded-xl w-28 h-10" onPress={handleYes}>
//                 <LinearGradient
//                   colors={['#e51978', '#a05193', '#4b63ac']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 1}}
//                   locations={[0, 0.4, 1]}
//                   angle={45}
//                   className="rounded-xl w-28 h-10">
//                   <Text className="text-center my-auto text-white text-lg font-extrabold">
//                     اجل
//                   </Text>
//                 </LinearGradient>
//               </Pressable>
//               <Pressable
//                 className="rounded-xl w-28 h-10"
//                 onPress={handleManual}>
//                 <LinearGradient
//                   colors={['#e51978', '#a05193', '#4b63ac']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 1}}
//                   locations={[0, 0.4, 1]}
//                   angle={45}
//                   className="rounded-xl w-32 h-10">
//                   <Text className="text-center my-auto text-white text-base font-extrabold">
//                     اضافة الموقع يدوياً
//                   </Text>
//                 </LinearGradient>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       {!modalVisible && showMap && (
//         <>
//           <View className="flex flex-row justify-between p-3">
//             <Pressable
//               className="self-center w-5"
//               onPress={() => navigation.goBack()}
//               disabled={showSpinner}>
//               <ChevronLeftIcon
//                 size={35}
//                 className="font-semibold"
//                 strokeWidth={2.5}
//                 color={'#000'}
//               />
//             </Pressable>
//             <Text className="self-center mr-[10%] text-xl text-black font-bold">
//               يرجى تحديد موقع سكنك على الخريطة
//             </Text>
//           </View>

//           <MapView
//             style={styles.map}
//             ref={mapRef}
//             onPress={handlePress}
//             provider={PROVIDER_GOOGLE}
//             initialRegion={initialRegion}>
//             {location && <Marker coordinate={location} />}
//           </MapView>

//           <View className="absolute top-[12%] right-2 p-3 rounded-full z-50 space-y-2">
//             <Pressable className="" onPress={zoomIn} disabled={showSpinner}>
//               <LinearGradient
//                 // Button Linear Gradient
//                 colors={['#4198d4', '#336eb0', '#365091']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 1}}
//                 locations={[0, 0.3, 1]}
//                 angle={45}
//                 className="w-12 h-12 rounded-full items-center justify-center">
//                 <Feather name="zoom-in" size={30} color={'#fff'} />
//               </LinearGradient>
//             </Pressable>

//             <Pressable className="" onPress={zoomOut} disabled={showSpinner}>
//               <LinearGradient
//                 // Button Linear Gradient
//                 colors={['#4198d4', '#336eb0', '#365091']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 1}}
//                 locations={[0, 0.3, 1]}
//                 angle={45}
//                 className="w-12 h-12 rounded-full items-center justify-center">
//                 <Feather name="zoom-out" size={30} color={'#fff'} />
//               </LinearGradient>
//             </Pressable>
//             <Pressable className="" onPress={goToMarker} disabled={showSpinner}>
//               <LinearGradient
//                 colors={['#4198d4', '#336eb0', '#365091']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 1}}
//                 locations={[0, 0.3, 1]}
//                 angle={45}
//                 className="w-12 h-12 rounded-full items-center justify-center">
//                 <MaterialIcons name="my-location" size={30} color={'#fff'} />
//               </LinearGradient>
//             </Pressable>
//           </View>

//           <Pressable
//             onPress={handleContinue}
//             className="w-[80%] h-12 absolute bottom-8 self-center"
//             disabled={showSpinner}>
//             <LinearGradient
//               // Button Linear Gradient
//               colors={['#e51978', '#a05193', '#4b63ac']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 1}}
//               locations={[0, 0.3, 1]}
//               angle={45}
//               className="flex-1 rounded-[30px] items-center">
//               <Text className="text-xl text-white font-bold text-center my-auto">
//                 تأكيد الموقع
//               </Text>
//             </LinearGradient>
//           </Pressable>
//         </>
//       )}
//       {showSpinner && (
//         <View style={styles.spinnerContainer}>
//           <ActivityIndicator size="large" color="#fff" />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mapContainer: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   zoomButtons: {
//     position: 'absolute',
//     top: 20,
//     right: 10,
//     zIndex: 0,
//   },
//   zoomButton: {
//     backgroundColor: '#333',
//     padding: 10,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   zoomButtonText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     zIndex: 0,
//   },
//   spinnerContainer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },
//   button: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: '#0d6efd',
//     padding: 20,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   buttonYes: {
//     backgroundColor: '#2196F3',
//   },
//   buttonNo: {
//     backgroundColor: '#F44336',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default React.memo(MapSignupScreen);

import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {memo} from 'react';
import axios from 'axios';

const Changeuserlocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const {
    fullName,
    phoneNumber,
    password,
    gender,
    occupation,
    signinoption,
    signupoption,
    deviceToken,
    imageData,
  } = route.params;
  console.log(
    fullName,
    phoneNumber,
    password,
    gender,
    occupation,
    signinoption,
    signupoption,
    deviceToken,
    imageData,
  );
  const [location, setLocation] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef(null);
  const MemoMarker = memo(Marker);

  const zoomIn = useCallback(async () => {
    const camera = await mapRef.current.getCamera();
    camera.zoom += 1;
    mapRef.current.animateCamera(camera, {duration: 100});
  }, []);

  const zoomOut = useCallback(async () => {
    const camera = await mapRef.current.getCamera();
    camera.zoom -= 1;
    mapRef.current.animateCamera(camera, {duration: 100});
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('userLocation');
        if (storedLocation) {
          const location = JSON.parse(storedLocation);
          setLocation(location);

          // set map camera to the location
          const camera = {
            center: location,
            zoom: 15, // Change this value to your desired zoom level
          };
          if (mapRef.current) {
            mapRef.current.animateCamera(camera, {duration: 500});
          }
        } else {
          alert('يرجى تحديد الموقع على الخريطة');
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const initialRegion = useMemo(() => {
    return location
      ? {
          ...location,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }
      : {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        };
  }, [location]);

  const handlePress = useCallback(event => {
    setLocation(event.nativeEvent.coordinate);
    AsyncStorage.setItem(
      'userLocation',
      JSON.stringify(event.nativeEvent.coordinate),
    );
  }, []);
  const handleContinue = useCallback(async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (location) {
      setShowSpinner(true);
      try {
        const response = await axios.put(
          'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/api/user/location',
          location,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          },
        );
        setShowSpinner(false);
        console.log(response.data);
        setSuccessModalVisible(true); // <-- show success modal
      } catch (error) {
        setShowSpinner(false);
        console.error(error);
      }
    } else {
      alert('Please select a location on the map');
    }
  }, [location]);
  const handleSuccessModalClose = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  const goToMarker = async () => {
    if (location) {
      const camera = await mapRef.current.getCamera();
      camera.center = location;
      mapRef.current.animateCamera(camera, {duration: 500});
    } else {
      alert('No marker available to navigate to.');
    }
  };

  const [region, setRegion] = useState(initialRegion);

  const onRegionChangeComplete = newRegion => {
    setRegion(newRegion);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={handleSuccessModalClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Text className="'mb-4 text-center text-lg text-black">
              تم تغيير الموقع بنجاح
            </Text>
            <Pressable
              onPress={handleSuccessModalClose}
              className="w-24 h-10 mt-3 self-center"
              disabled={showSpinner}>
              <LinearGradient
                // Button Linear Gradient
                colors={['#e51978', '#a05193', '#4b63ac']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0, 0.3, 1]}
                angle={45}
                className="flex-1 rounded-[30px] items-center">
                <Text className="text-xl text-white font-bold text-center my-auto">
                  اغلاق
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>

      <>
        <MapView
          style={styles.map}
          ref={mapRef}
          onPress={handlePress}
          onPoiClick={event => {
            setLocation(event.nativeEvent.coordinate);
            AsyncStorage.setItem(
              'userLocation',
              JSON.stringify(event.nativeEvent.coordinate),
            );
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onRegionChangeComplete={onRegionChangeComplete}>
          {location && (
            <MemoMarker coordinate={location} tracksViewChanges={false} />
          )}
        </MapView>
        <View className="absolute w-screen flex-row">
          <View className="p-3 mr-3 mt-3 rounded-full z-50 space-y-2">
            <Pressable
              className="self-center w-5"
              onPress={() => navigation.goBack()}
              disabled={showSpinner}>
              <ChevronLeftIcon
                size={35}
                className="font-semibold"
                strokeWidth={2.5}
                color={'#000'}
              />
            </Pressable>
          </View>
          <View className="w-[80%] mt-5">
            <GooglePlacesAutocomplete
              className=""
              placeholder="ابحث"
              debounce={400}
              nearbyPlacesAPI="GooglePlacesSearch"
              fetchDetails={true}
              enablePoweredByContainer={false}
              query={{
                key: 'AIzaSyAeOen8Tr6LYEpkLkGk3E__uhvE25t7E40',
                language: 'ar',
                components: 'country:iq',
              }}
              styles={{
                textInput: {
                  textAlign: 'center',
                  color: '#000',
                  fontSize: 16,
                },
                row: {
                  backgroundColor: '#FFFFFF',
                  padding: 13,
                  height: 40,
                  flexDirection: 'row',
                  textAlign: 'right',
                },
              }}
              blur={false}
              renderRow={rowData => (
                <View className="flex mx-auto">
                  <Text className="text-black">{rowData.description}</Text>
                </View>
              )}
              returnKeyType={'search'}
              onPress={(data, details = null) => {
                const newLocation = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                setLocation(newLocation);
                const camera = {
                  center: newLocation,
                  zoom: 15, // Change this value to your desired zoom level
                };
                mapRef.current.animateCamera(camera, {duration: 500});
              }}
            />
          </View>
        </View>

        <View className="absolute bottom-[15%] right-2 p-3 rounded-full z-50 space-y-2">
          <Pressable className="" onPress={zoomIn} disabled={showSpinner}>
            <LinearGradient
              // Button Linear Gradient
              colors={['#4198d4', '#336eb0', '#365091']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.3, 1]}
              angle={45}
              className="w-12 h-12 rounded-full items-center justify-center">
              <Feather name="zoom-in" size={30} color={'#fff'} />
            </LinearGradient>
          </Pressable>

          <Pressable className="" onPress={zoomOut} disabled={showSpinner}>
            <LinearGradient
              // Button Linear Gradient
              colors={['#4198d4', '#336eb0', '#365091']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.3, 1]}
              angle={45}
              className="w-12 h-12 rounded-full items-center justify-center">
              <Feather name="zoom-out" size={30} color={'#fff'} />
            </LinearGradient>
          </Pressable>
          <Pressable className="" onPress={goToMarker} disabled={showSpinner}>
            <LinearGradient
              colors={['#4198d4', '#336eb0', '#365091']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              locations={[0, 0.3, 1]}
              angle={45}
              className="w-12 h-12 rounded-full items-center justify-center">
              <MaterialIcons name="my-location" size={30} color={'#fff'} />
            </LinearGradient>
          </Pressable>
        </View>

        <Pressable
          onPress={handleContinue}
          className="w-[80%] h-12 absolute bottom-8 self-center"
          disabled={showSpinner}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.3, 1]}
            angle={45}
            className="flex-1 rounded-[30px] items-center">
            <Text className="text-xl text-white font-bold text-center my-auto">
              تأكيد الموقع
            </Text>
          </LinearGradient>
        </Pressable>
      </>

      {showSpinner && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  zoomButtons: {
    position: 'absolute',
    top: 20,
    right: 10,
    zIndex: 0,
  },
  zoomButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 0,
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0d6efd',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default React.memo(Changeuserlocation);
