import {Modal, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {useEffect, useState} from "react";
import { Audio } from 'expo-av';

type Props = {
  onClose?: () => void
  onNext: () => void
  visible: boolean
  success: boolean
}

const BRAVO_SOUND_PATH = '../../../assets/audio/bravo.wav'
const DOMMAGE_SOUND_PATH = '../../../assets/audio/dommage.wav'
// const bravoSound = Audio.Sound.createAsync( require(BRAVO_SOUND_PATH));
// const dommageSound = Audio.Sound.createAsync( require(DOMMAGE_SOUND_PATH));

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
          <Text style={styles.modalText}>{props.success ? "Bravo !" : "Dommage..."}</Text>
          <PrimaryButton name="SUIVANT" onPress={() => {
            props.onNext()
          }} />
          {/*<Pressable*/}
          {/*  style={[styles.button, styles.buttonClose]}*/}
          {/*  onPress={() => setModalVisible(!modalVisible)}>*/}
          {/*  <Text style={styles.textStyle}>Hide Modal</Text>*/}
          {/*</Pressable>*/}
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});