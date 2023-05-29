/* eslint-disable comma-dangle */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';

const Navigation = props => {
  const origin = {
    latitude: 12.3456,
    longitude: 78.9101,
  };

  const destination = {
    latitude: 98.7654,
    longitude: 43.2109,
  };

  return (
    <View style={styles.container}>
      <MapboxNavigation
        origin={[-97.760288, 30.273566]}
        destination={[-97.918842, 30.494466]}
        onLocationChange={event => {
          const {latitude, longitude} = event.nativeEvent;
          console.log('UUUUUUUUUUUUUUUUUUUUUUUuu', event.nativeEvent);
        }}
        onMapReady={event => {
          console.log('UUUUUUUUUUUUUUUUUUUUUUUuu', event.nativeEvent);
        }}
        onRouteProgressChange={event => {
          const {
            distanceTraveled,
            durationRemaining,
            fractionTraveled,
            distanceRemaining,
          } = event.nativeEvent;
          console.log('LLLLLLLLLLLLLLLLLLLLLLLL', event.nativeEvent);
        }}
        onError={event => {
          const {message} = event.nativeEvent;
          console.error(message);
        }}
        onCancelNavigation={() => {
          // User tapped the "X" cancel button in the nav UI
          // or canceled via the OS system tray on android.
          // Do whatever you need to here.
        }}
        onArrive={() => {
          // Called when you arrive at the destination.
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  mapContainer: {
    flex: 1,
  },
});

export default Navigation;
