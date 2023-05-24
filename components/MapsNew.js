import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {FlatList} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const MapSignupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [location, setLocation] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const mapRef = useRef(null);

  const zoomIn = async () => {
    const camera = await mapRef.current.getCamera();
    camera.zoom += 1;
    mapRef.current.animateCamera(camera, {duration: 100});
  };

  const zoomOut = async () => {
    const camera = await mapRef.current.getCamera();
    camera.zoom -= 1;
    mapRef.current.animateCamera(camera, {duration: 100});
  };

  useEffect(() => {
    (async () => {
      try {
        if (route.params.fromlocation) {
          const parsedLocation = {
            longitude: route.params.fromlocation.coordinates[0],
            latitude: route.params.fromlocation.coordinates[1],
          };
          setLocation(parsedLocation);
          const camera = {
            center: parsedLocation,
            // zoom: 100, // remove this line
          };
          mapRef.current.animateCamera(camera, {duration: 500});
        } else {
          alert('يرجى تحديد الموقع على الخريطة');
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [route.params.fromlocation]);

  const initialRegion = useMemo(() => {
    if (location) {
      return {
        ...location,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
        zoom: 15, // <-- add this line to set default zoom level
      };
    }
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
      zoom: 15, // <-- add this line to set default zoom level
    };
  }, [location]);

  const handlePress = useCallback(event => {
    setLocation(event.nativeEvent.coordinate);
  }, []);

  const handleManual = useCallback(() => {
    setModalVisible(false);
    setShowMap(true); // Show the map when "Add manually" is clicked
  }, []);

  const [data, setData] = useState({});
  const origin = useMemo(() => {
    if (route.params.fromlocation) {
      return {
        latitude: route.params.fromlocation.coordinates[1],
        longitude: route.params.fromlocation.coordinates[0],
      };
    }
    return null;
  }, [route.params.fromlocation]);

  let destination = null;
  {
    location &&
      (destination = {
        latitude: location.latitude,
        longitude: location.longitude,
      });
  }

  useEffect(() => {
    // Retrieve the data passed from RegularOrderScreen
    const {
      taxiType,
      typeOfWork,
      daysOfWork,
      genderType,
      phoneNumber,
      fromlocation,
      groupPhoneNumbers,
      screentype,
    } = route.params;
    setData({
      phoneNumber,
      genderType,
      typeOfWork,
      daysOfWork,
      fromlocation,
      taxiType,
      groupPhoneNumbers,
      screentype,
    });
  }, [route.params]);

  const handleContinue = useCallback(async () => {
    if (location) {
      const updatedData = {
        ...data,
        Tolocation: location, // assuming you have a state variable for selectedLocation
      };

      // Navigate back to RegularOrderScreen with the updated data
      if (route.params.screentype) {
        navigation.navigate('VipOrder', {updatedData});
      } else {
        navigation.navigate('RegularOrder', {updatedData});
      }
    } else {
      alert('يرجى تحديد الموقع على الخريطة');
    }
  }, [location, data, route.params.screentype, navigation]);

  const [suggestedPlaces, setSuggestedPlaces] = useState('');

  const fetchSuggestedPlaces = async () => {
    try {
      const response = await fetch(
        'https://xd8wshpkog.execute-api.me-south-1.amazonaws.com/dev/suggestion-places-mobile',
      );
      const datas = await response.json();
      setSuggestedPlaces(datas);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSuggestedPlaces();
  }, []);
  const handlePlaceSelect = item => {
    const newLocation = {
      latitude: item.location.coordinates[0],
      longitude: item.location.coordinates[1],
    };
    setLocation(newLocation);
    const updatedData = {
      ...data,
      Tolocation: item.location.coordinates,
    };

    handleManual();
  };

  useEffect(() => {
    fitCoordinates();
  }, [fitCoordinates, location]);

  const fitCoordinates = useCallback(async () => {
    if (!origin || !destination || !mapRef.current) return;

    await new Promise(resolve => setTimeout(resolve, 500));

    mapRef.current.fitToCoordinates([origin, destination], {
      edgePadding: {top: 150, right: 150, bottom: 150, left: 150},
      animated: true,
    });
  }, [origin, destination, mapRef]);

  const zoomToUserLocation = async () => {
    try {
      if (route.params.fromlocation) {
        const parsedLocation = {
          longitude: route.params.fromlocation.coordinates[0],
          latitude: route.params.fromlocation.coordinates[1],
        };

        const camera = {
          center: parsedLocation,
        };
        mapRef.current.animateCamera(camera, {duration: 500});
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const renderItem = ({item}) => (
    <Pressable className="w-full h-10" onPress={() => handlePlaceSelect(item)}>
      <Text className="text-black font-bold text-lg border-b border-zinc-300 pb-2">
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text className="text-black mx-auto text-xl font-bold text-center mb-3">
              الاماكن المقترحة
            </Text>
            <View className="border-b border-[#eb0a73] h-0.5 w-72"></View>
            {!suggestedPlaces ? (
              <View className="mt-5">
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : (
              <FlatList
                data={suggestedPlaces}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                windowSize={15} // Increase the number of items rendered outside the visible area
                maxToRenderPerBatch={10} // Limit the number of items rendered per batch
                initialNumToRender={10} // Limit the initial number of items to render
                removeClippedSubviews={true} // Remove items that are off-screen
              />
            )}

            <View className="flex flex-row mt-5">
              <Pressable
                className="rounded-xl w-28 h-10"
                onPress={handleManual}>
                <LinearGradient
                  colors={['#e51978', '#a05193', '#4b63ac']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  locations={[0, 0.4, 1]}
                  angle={45}
                  className="rounded-xl w-32 h-10">
                  <Text className="text-center my-auto text-white text-base font-extrabold">
                    اخرى
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {!modalVisible && showMap && (
        <>
          <MapView
            style={styles.map}
            ref={mapRef}
            onPress={handlePress}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}>
            {origin && <Marker coordinate={origin} tracksViewChanges={false} />}
            {destination && (
              <Marker coordinate={destination} tracksViewChanges={false} />
            )}
            {origin && destination && (
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={'AIzaSyAeOen8Tr6LYEpkLkGk3E__uhvE25t7E40'}
                strokeWidth={3}
                strokeColor="hotpink"
                onReady={fitCoordinates}
              />
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
            <Pressable
              onPress={zoomToUserLocation}
              className=""
              disabled={showSpinner}>
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
      )}
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
    margin: 40,
    backgroundColor: 'white',
    borderRadius: 30,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonYes: {
    backgroundColor: '#2196F3',
  },
  buttonNo: {
    backgroundColor: '#F44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default React.memo(MapSignupScreen);
