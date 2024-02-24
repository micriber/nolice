import {StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React from "react";
import ChoiceButton from "../../components/ChoiceButton";
import {AnimalImage} from "./animal-picture";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default
function GameScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        {
          alignItems: 'center',
          flexDirection: 'row',
        }]}>
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
        <AnimalImage />
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
          <ChoiceButton answer="2" onPress={() => {
            navigation.navigate('Menu')
          }}/>
          <ChoiceButton answer="4" onPress={() => {
            navigation.navigate('Menu')
          }}/>
          <ChoiceButton answer="6" onPress={() => {
            navigation.navigate('Menu')
          }}/>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton name="RETOUR" onPress={() => {
          navigation.navigate('Menu')
        }}/>
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
