import {useCallback} from "react";
import {View} from "react-native";
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  TitilliumWeb_400Regular,
  TitilliumWeb_600SemiBold,
  TitilliumWeb_700Bold,
  TitilliumWeb_900Black,
} from '@expo-google-fonts/titillium-web';

import MenuScreen from "./src/screens/menu";
import GameScreen from "./src/screens/game";
import ScoreScreen from "./src/screens/score";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    TitilliumWeb_400Regular,
    TitilliumWeb_600SemiBold,
    TitilliumWeb_700Bold,
    TitilliumWeb_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log({ fontError, fontsLoaded })
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{animation: 'fade'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto"/>
    </View>
  );
};
