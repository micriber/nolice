import {StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "../../components/ChoiceButton";
import {AnimalImage} from "./animal-picture";
import {MAX_QUESTION, useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {Audio} from "expo-av";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default
function GameScreen({ navigation } : Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const store = useGameScoreStore()
  const ducks = []
  const answer = store.questions[store.currentIndex]?.possibilities.find((value) => value.isGood)
  if (answer) {
    for (let i = 0; i < answer!.value; i++) {
      ducks.push(<AnimalImage key={i} />)
    }
  }

  useEffect(() => {
    const playAudio = async () => {
      const { sound } = await Audio.Sound.createAsync( require("../../../assets/audio/count-duck.wav"));
      await sound.playAsync();
    }

    if (store.currentIndex < MAX_QUESTION) {
      playAudio()
    }
  }, [store.currentIndex])

  console.log({ current: store.currentIndex, possibilities: store.questions[store.currentIndex] })

  return (
    <View style={styles.container}>
      <ResultModal onNext={() => {
        setModalVisible(false)
        store.nextQuestion(success)
        setSuccess(false)
        if (!store.hasNextQuestion()) {
          navigation.navigate('Score')
        }
      }} success={success} visible={modalVisible}/>
      <View style={[styles.header]}>
        <View style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: '15%'
          }]}>
          {ducks}
        </View>
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
          {store.questions[store.currentIndex]?.possibilities?.map((possibility) => (
            <ChoiceButton key={possibility.value} value={possibility.value.toString()} onPress={() => {
              setModalVisible(true)
              setSuccess(possibility.isGood)
            }}/>
          ))}
        </View>
      </View>
      <View style={[styles.footer, {
        marginTop: '15%'
      }]}>
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
