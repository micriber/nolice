import {Fredoka_600SemiBold, Fredoka_700Bold} from '@expo-google-fonts/fredoka';
import {
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {NumberGame, FindGame} from './src/screens/game';
import {Home} from './src/screens/home';
import ScoreScreen from './src/screens/score';
import SettingsScreen from './src/screens/settings';
import {StackNavigatorParamList} from './src/screens/types';
import {MUSIC_TRACKS, useSoundStore} from './src/store/audio';
import {useSettingsStore} from './src/store/settings';

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

void SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: 'https://570746aa3468ae86a390bdc148e51e52@o919929.ingest.sentry.io/4506847089590272',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'development' : 'production',
  enableLogs: true,
});

function App() {
  const routeNameRef = React.useRef<string | undefined>(undefined);
  const navigationRef = useNavigationContainerRef<StackNavigatorParamList>();

  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const playBackground = useSoundStore((s) => s.playBackground);
  const preloadAllAssets = useSoundStore((s) => s.preloadAllAssets);
  const backgroundLoaded = useSoundStore((s) => s.backgroundLoaded);
  const assetsLoaded = useSoundStore((s) => s.assetsLoaded);
  const musicTrack = useSettingsStore((state) => state.musicTrack);
  useEffect(() => {
    playBackground(MUSIC_TRACKS[musicTrack]).catch((err: any) => {
      Sentry.logger.error('Audio error: background music init', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
    });
  }, [musicTrack]);

  useEffect(() => {
    preloadAllAssets().catch((err: any) => {
      Sentry.logger.error('Audio error: preload all assets', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
    });
  }, []);

  const onReady = useCallback(async () => {
    if (fontsLoaded && backgroundLoaded && assetsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [backgroundLoaded, assetsLoaded, fontsLoaded]);

  if (!fontsLoaded || !backgroundLoaded || !assetsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
          return onReady();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName =
            navigationRef.current?.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            await logEvent(getAnalytics(), 'screen_view', {
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
        ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="NumberGame"
            component={NumberGame}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="FindGame"
            component={FindGame}
            options={{animation: 'fade'}}
          />
          <Stack.Screen
            name="Score"
            component={ScoreScreen}
            options={{animation: 'fade'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);
