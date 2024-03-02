import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MenuScreen from "./src/screens/menu";
import GameScreen from "./src/screens/game";
import ScoreScreen from "./src/screens/score";

import * as SplashScreen from 'expo-splash-screen';
import React, {useCallback, useEffect} from "react";
import { TitilliumWeb_700Bold, useFonts } from '@expo-google-fonts/titillium-web';
import {SOUNDS, useSoundStore} from "./src/store/audio";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_700Bold
  });

  const soundStore = useSoundStore()
  useEffect(() => {
    soundStore.playBackground(SOUNDS.MUSIC)
  }, [])

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <NavigationContainer onReady={onReady}>
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{ animation: 'fade' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar/>
    </>
  );
};
