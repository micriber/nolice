import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';

import { Logo } from './src/svg/logo'

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
      </Stack.Navigator>
    </NavigationContainer>
	<StatusBar style="auto" />
	</>
  );
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function MenuScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {navigation.navigate('Game')}}
        >
          <Text style={styles.playButtonText}>JOUER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GameScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        {
          alignItems: 'center',
        }]}>
        <Image
          style={{
            width: '80%',
            height: 400,
            resizeMode: 'contain'
          }}
          source={require('./assets/duck.jpeg')}
        />
      </View>
      <View style={styles.body}>
        <View style={[
          {
            flex: 0.5,
          }
        ]}>
          <Text style={{
            fontSize: 27,
            color: "#ffffff",
            fontWeight: "bold",
          }}>Combien vois-tu de canards ?</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={[
            {
              flex: 1,
              alignItems: 'center',
            }
          ]}>
            <TouchableOpacity
                style={{
                  alignItems: 'center',
                  backgroundColor: '#8ff672',
                  width: '30%',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}
                onPress={() => {navigation.navigate('Menu')}}
            >
              <Text style={styles.playButtonText}>2</Text>
            </TouchableOpacity>
          </View>
          <View style={[
            {
              flex: 1,
              alignItems: 'center',
            }
          ]}>
            <TouchableOpacity
                style={{
                  alignItems: 'center',
                  backgroundColor: '#8ff672',
                  width: '30%',
                  justifyContent: 'center',
                  borderRadius: 25,
                }}
                onPress={() => {navigation.navigate('Menu')}}
            >
              <Text style={styles.playButtonText}>4</Text>
            </TouchableOpacity>
          </View>
          <View style={[
            {
              flex: 1,
              alignItems: 'center',
            }
          ]}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#8ff672',
                width: '30%',
                justifyContent: 'center',
                borderRadius: 25,
              }}
              onPress={() => {navigation.navigate('Menu')}}
            >
              <Text style={styles.playButtonText}>6</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {navigation.navigate('Menu')}}
        >
          <Text style={styles.playButtonText}>RETOUR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53afd5',
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#f6da72',
    height: 50,
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 80,
  },
  playButtonText: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
