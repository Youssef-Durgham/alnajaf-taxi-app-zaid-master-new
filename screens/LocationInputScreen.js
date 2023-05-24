import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

const LocationInputScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const useCurrentLocation = async () => {
    setLoading(true);
    const location = await AsyncStorage.getItem('location');
    setLoading(false);
    navigation.navigate('DestinationInput', {location});
  };

  const manualLocationEntry = () => {
    navigation.navigate('ManualLocation');
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TouchableOpacity onPress={useCurrentLocation}>
            <Text>Use Current Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={manualLocationEntry}>
            <Text>Enter Location Manually</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LocationInputScreen;
