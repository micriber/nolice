import {Modal, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {SOUNDS, useSoundStore} from "../../store/audio";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";

type Props = {
  onClose?: () => void
  onNext: () => void
  visible: boolean
  success: boolean,
  answer?: number,
}

export function ResultModal(props: Props) {
  const soundStore = useSoundStore()
  async function onShow() {
    await analytics().logEvent('result', {
      success: props.success,
      answer: props.answer,
    })

    if (props.success) {
      await soundStore.play(SOUNDS.BRAVO)
    } else {
      await soundStore.play(SOUNDS.DOMMAGE)
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onShow={onShow}
      onRequestClose={() => {
        props.onClose && props.onClose()
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[
            styles.modalText,
            {
              color: props.success ? COLORS.FONT.SUCCESS : COLORS.FONT.ERROR,
              fontSize: FONT.SIZE.BASE
            }
          ]}>{props.success ? "BRAVO !" : "FAUX !"}</Text>
          <Text style={styles.modalText}>La bonne réponse</Text>
          <Text style={[
            styles.modalText,
            {
              fontSize: FONT.SIZE.BIG,
              flex: 2,
            }
          ]}>{props.answer}</Text>
          <View style={[{
            flex: 2,
            justifyContent: 'center',
          }]}>
            <PrimaryButton name="SUIVANT" onPress={() => {
              props.onNext()
            }} />
          </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    flexDirection: 'column',
    margin: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    padding: '5%',
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
    height: "50%",
  },
  modalText: {
    flex: 1,
    fontSize: FONT.SIZE.BASE,
    color: COLORS.FONT.BASE,
    fontFamily: FONT.FAMILY,
    textAlign: 'center',
  },
});