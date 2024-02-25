import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StyleSheet, View, Text} from "react-native";
import {MAX_QUESTION, useGameScoreStore} from "../../store/game";
import PrimaryButton from "../../components/PrimaryButton";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ScoreScreen({ navigation }: Props) {
  const store = useGameScoreStore()
  const handleClick = () => {
    navigation.navigate('Menu')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>{store.getResults()} / {MAX_QUESTION}</Text>
      </View>
      <View style={styles.body}>
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
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 0,
    width: 200,
  }
});
