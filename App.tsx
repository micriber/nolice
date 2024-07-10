import {TitilliumWeb_700Bold, useFonts} from '@expo-google-fonts/titillium-web';
import analytics from '@react-native-firebase/analytics';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import React, {useCallback, useEffect, useState} from 'react';

import {NumberGame, FindGame} from './src/screens/game';
import {MainMenu, GameSelectionMenu} from './src/screens/menu';
import ScoreScreen from './src/screens/score';
import {StackNavigatorParamList} from './src/screens/types';
// import {SOUNDS, useSoundStore} from './src/store/audio';
import TrackPlayer, {RepeatMode} from "react-native-track-player";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: 'https://570746aa3468ae86a390bdc148e51e52@o919929.ingest.sentry.io/4506847089590272',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: 'development',
});

function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [fontsLoaded] = useFonts({
    TitilliumWeb_700Bold,
  });

  // const soundStore = useSoundStore();
  useEffect(() => {
    async function setup() {
      let isSetup = false;
      try {
        const index = await TrackPlayer.getActiveTrackIndex();
        console.log('index', index);
        isSetup = true;
      } catch {
        console.log('setup');
        await TrackPlayer.setupPlayer();
        isSetup = true;
      }

      const queue = await TrackPlayer.getQueue();
      if(isSetup && queue.length <= 0) {
        console.log('add');
        await TrackPlayer.add([
          {
            id: 'music',
            url: require( './assets/audio/music.mp3'),
          }
        ]);
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      }

      setIsPlayerReady(isSetup);
      TrackPlayer.play().catch((error) => console.log(error));
    }

    setup();
    // soundStore.playBackground(SOUNDS.MUSIC).catch(console.error);
  }, []);

  const onReady = useCallback(async () => {
    if (fontsLoaded && isPlayerReady) {
      await SplashScreen.hideAsync();
    }
  }, [isPlayerReady, fontsLoaded]);

  if (!fontsLoaded || !isPlayerReady) {
    return null;
  }

  return (
    <>
      <NavigationContainer
        onReady={() => {
          // @ts-ignore
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          return onReady();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          // @ts-ignore
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
        // @ts-ignore
        ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="MainMenu"
            component={MainMenu}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="GameSelectionMenu"
            component={GameSelectionMenu}
            options={{animation: 'fade'}}
          />
          {/*<Stack.Screen*/}
          {/*  name="NumberGame"*/}
          {/*  component={NumberGame}*/}
          {/*  options={{animation: 'fade'}}*/}
          {/*/>*/}
          {/*<Stack.Screen*/}
          {/*  name="FindGame"*/}
          {/*  component={FindGame}*/}
          {/*  options={{animation: 'fade'}}*/}
          {/*/>*/}
          {/*<Stack.Screen*/}
          {/*  name="Score"*/}
          {/*  component={ScoreScreen}*/}
          {/*  options={{animation: 'fade'}}*/}
          {/*/>*/}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar />
    </>
  );
}
async function playbackService() {
  // TODO: Attach remote event handlers
}
export default Sentry.wrap(App);
TrackPlayer.registerPlaybackService(() => playbackService);
