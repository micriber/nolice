import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MenuScreen from "./src/screens/menu";
import GameScreen from "./src/screens/game";
import ScoreScreen from "./src/screens/score";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
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
	<StatusBar style="auto" />
	</>
  );
};
