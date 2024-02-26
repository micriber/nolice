import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StyleSheet, View, Text, Image} from "react-native";
import {MAX_QUESTION, useGameScoreStore} from "../../store/game";
import PrimaryButton from "../../components/PrimaryButton";
import {SOUNDS, useSoundStore} from "../../store/audio";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ScoreScreen({ navigation }: Props) {
  const store = useGameScoreStore()
  const soundStore = useSoundStore()

  const handleClick = () => {
    navigation.navigate('Menu')
  }

  let results = store.getResults();
  let isGood = results >= MAX_QUESTION / 2;
  let isPerfect = results = MAX_QUESTION;
  const congratulationSource = require('../../../assets/congratulation.jpeg');
  const retrySource = require('../../../assets/retry.jpeg');

  let message;
  if (!isGood) {
    message = "Il y a des erreurs mais je suis sûr que tu peux mieux faire.";
  } else if (isPerfect) {
    message = "Bravo ! Tu as bien répondu à toutes les questions.";
  } else {
    message = "Bravo ! Tu as bien répondu à la plupart des questions.";
  }

  return (
    <View style={styles.container} onLayout={async () => {
      await soundStore.play((isGood) ? SOUNDS.CONGRATULATION : SOUNDS.RETRY);
    }}>
      <View style={styles.header}>
        <Image style={styles.image} source={isGood ? congratulationSource : retrySource} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.score, styles.message]}>{message}</Text>
        <Text style={styles.score}>Résultat : <Text style={[{color: (isGood) ? 'green' : 'red'}]}>{results}</Text> / {MAX_QUESTION}</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton name="Retour" onPress={handleClick}/>
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
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'stretch',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: "TitilliumWeb_700Bold",
    color: '#f3f1f1',
  },
  message: {
    marginBottom: "10%",
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
