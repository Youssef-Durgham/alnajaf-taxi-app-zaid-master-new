import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

const ManualLocationInput = ({navigation, route}) => {
  const {
    fromlat,
    fromlong,
    taxiType,
    typeOfWork,
    daysOfWork,
    genderType,
    phoneNumber,
  } = route.params;

  const name = route.params?.name ?? 'اضف موقعك الحالي';
  const checkmanual = route.params?.checkmanual;
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // Set an initial position for the map and the marker
    const initialPosition = {
      latitude: 33.32594716374021,
      longitude: 44.34271400818926,
    };
    setRegion({...region, ...initialPosition});
    setMarkerPosition(initialPosition);
  }, [region]);

  const onRegionChange = newRegion => {
    setRegion(newRegion);
  };

  const onMapPress = e => {
    setMarkerPosition(e.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    // Pass the location data back to the previous screen
    if (checkmanual) {
      navigation.navigate('VerifyInfo', {
        tolat: markerPosition.latitude,
        tolong: markerPosition.longitude,
        taxiType,
        typeOfWork,
        daysOfWork,
        fromlat,
        fromlong,
        genderType,
        phoneNumber,
      });
    } else {
      navigation.navigate('SuggestionPlace', {
        fromlat: markerPosition.latitude,
        fromlong: markerPosition.longitude,
        taxiType,
        typeOfWork,
        daysOfWork,
        genderType,
        phoneNumber,
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1}} className="bg-white">
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 10,
          }}
          className="bg-white">
          {name}
        </Text>
        <MapView
          style={{width: Dimensions.get('window').width, height: '100%'}}
          initialRegion={region}
          onRegionChangeComplete={onRegionChange}
          onPress={onMapPress}>
          <Marker coordinate={markerPosition} />
        </MapView>
      </View>
      <View style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}>
        <TouchableOpacity
          onPress={handleConfirmLocation}
          style={{
            backgroundColor: '#e51978',
            borderRadius: 10,
          }}
          className="w-40">
          <LinearGradient
            // Button Linear Gradient
            colors={['#e51978', '#a05193', '#4b63ac']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            locations={[0, 0.4, 1]}
            angle={45}
            className="w-full justify-center items-center rounded-lg mx-auto p-3 h-14">
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
              تأكيد الموقع
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ManualLocationInput);
