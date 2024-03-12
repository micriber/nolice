import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MenuScreen from "./src/screens/menu";
import GameScreen from "./src/screens/game";
import ScoreScreen from "./src/screens/score";
import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, {useCallback, useEffect} from "react";
import { TitilliumWeb_700Bold, useFonts } from '@expo-google-fonts/titillium-web';
import {SOUNDS, useSoundStore} from "./src/store/audio";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://570746aa3468ae86a390bdc148e51e52@o919929.ingest.sentry.io/4506847089590272",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: 'production',
});

function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  const [fontsLoaded] = useFonts({
    TitilliumWeb_700Bold
  });

  const soundStore = useSoundStore()
  useEffect(() => {
    console.log('play background');
    soundStore.playBackground(SOUNDS.MUSIC).catch(console.error);
  }, [])

  const onReady = useCallback(async () => {
    if (fontsLoaded && soundStore.backgroundLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [soundStore.backgroundLoaded, fontsLoaded]);

  if (!fontsLoaded || !soundStore.backgroundLoaded) {
    return null;
  }

  return (
    <>
      <NavigationContainer
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          return onReady();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
        ref={navigationRef}
      >
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

export default Sentry.wrap(App);