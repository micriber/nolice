import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { Logo } from './src/svg/logo'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{title: 'Menu'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
	<StatusBar style="auto" />
	</>
  );
};

function MenuScreen() {
  return (
    <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'column',
        },
      ]}>
      <View style={styles.header}>
        <Logo />
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {}}
        >
          <Text style={styles.playButtonText}>JOUER</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{flex: 3, backgroundColor: 'green'}} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  body: {
    flex: 1,
    // height: "50%",
    justifyContent: 'center',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#3d8c40',
    height: 50,
    // width: 150,
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#081108"
  }
});
