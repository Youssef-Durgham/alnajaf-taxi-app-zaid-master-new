import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const DestinationInputScreen = ({ navigation, route }) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);

  const onMapPress = (e) => {
    setDestination(e.nativeEvent.coordinate);
  };

  const goToInvitedPhoneInput = () => {
    setLoading(true);
    navigation.navigate('InvitedPhoneInput', { location: route.params.location, destination });
    setLoading(false);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <MapView style={{ width: '100%', height: '80%' }} onPress={onMapPress}>
            {destination && <Marker coordinate={destination} />}
          </MapView>
          <TouchableOpacity onPress={goToInvitedPhoneInput} disabled={!destination}>
            <Text>Select Destination</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default React.memo(DestinationInputScreen);
