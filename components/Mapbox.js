import React, { useState, useEffect } from 'react';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import { StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ({ origin, destination, Selectedusers }) => {
  const [isInRide, setIsInRide] = useState(false);

  useEffect(() => {
    if (origin && destination) {
      setIsInRide(false);
      setTimeout(() => setIsInRide(true), 100);
    }
  }, [origin, destination]);

  const onArrive = async () => {
    const title = 'لقد وصل الكابتن!';
    const body = 'لقد وصل الكابتن امام باب منزلك.';

    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await fetch(
        'https://iawm31dh1b.execute-api.me-south-1.amazonaws.com/dev/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            userId: Selectedusers,
            title: title,
            body: body,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <React.Fragment>
      {isInRide && origin && destination ? (
        <MapboxNavigation
          style={styles.container}
          origin={origin}
          destination={destination}
        //   showsEndOfRouteFeedback
          shouldSimulateRoute
          onLocationChange={(event) => {
            const { latitude, longitude } = event.nativeEvent;
          }}
          onRouteProgressChange={(event) => {
            const {
              distanceTraveled,
              durationRemaining,
              fractionTraveled,
              distanceRemaining,
            } = event.nativeEvent;
          }}
          onArrive={onArrive}
          onError={(event) => {
            const { message } = event.nativeEvent;
            console.error(message);
          }}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(App);
