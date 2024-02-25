import {Modal, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { Audio } from 'expo-av';

type Props = {
  onClose?: () => void
  onNext: () => void
  visible: boolean
  success: boolean,
  answer: number,
}

const BRAVO_SOUND_PATH = '../../../assets/audio/bravo.wav'
const DOMMAGE_SOUND_PATH = '../../../assets/audio/dommage.wav'

export function ResultModal(props: Props) {
  async function playSound() {
    const bravoSound = Audio.Sound.createAsync( require(BRAVO_SOUND_PATH));
    const dommageSound = Audio.Sound.createAsync( require(DOMMAGE_SOUND_PATH));

    const { sound } = props.success ? await bravoSound : await dommageSound;

    await sound.playAsync();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onShow={playSound}
      onRequestClose={() => {
        props.onClose && props.onClose()
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[
            styles.modalText,
            {color: props.success ? 'green' : 'red'}
          ]}>{props.success ? "Bravo !" : "Faux la bonne réponse est " + props.answer}</Text>
          <PrimaryButton name="SUIVANT" onPress={() => {
            props.onNext()
          }} />
        </View>
      </View>
    </Modal>
  )
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#f3f1f1',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#9b9b9b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 27,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});