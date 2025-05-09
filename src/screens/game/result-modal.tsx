import analytics from '@react-native-firebase/analytics';
import {AVPlaybackSource} from 'expo-av';
import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import {SOUNDS, useSoundStore} from '../../store/audio';
import {COLORS} from '../../utils/color';
import {FONT} from '../../utils/font';

type Props = {
  onClose?: () => void;
  onNext: () => void;
  visible: boolean;
  success: boolean;
  answer?: string;
  choice?: string;
  children?: React.ReactNode;
  questionId?: string;
  gameId?: string;
  sound: AVPlaybackSource;
};

export function ResultModal(props: Props) {
  const soundStore = useSoundStore();
  const [soundFinished, setSoundFinished] = useState(false);
  async function onShow() {
    setSoundFinished(false);
    await analytics().logEvent('result', {
      success: props.success,
      answer: props.answer,
      choice: props.choice,
      question_id: props.questionId,
      game_id: props.gameId,
    });

    const soundCallback = async () => {
      await soundStore.play(props.sound, async () => setSoundFinished(true));
    };
    if (props.success) {
      await soundStore.play(SOUNDS.BRAVO, soundCallback);
    } else {
      await soundStore.play(SOUNDS.DOMMAGE, soundCallback);
    }
  }

  let content;
  if (props.children) {
    content = (
      <View
        style={[
          {
            flex: 3,
            marginTop: 30,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        {props.children}
      </View>
    );
  } else if (props.answer) {
    content = (
      <Text
        style={[
          styles.modalText,
          {
            fontSize: FONT.SIZE.GIANT,
            flex: 3,
            marginTop: 30,
          },
        ]}>
        {props.answer}
      </Text>
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={props.visible}
      onShow={onShow}
      onRequestClose={() => {
        props.onClose && props.onClose();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={[
              styles.modalText,
              {
                color: props.success ? COLORS.FONT.SUCCESS : COLORS.FONT.ERROR,
                fontSize: FONT.SIZE.BASE,
              },
            ]}>
            {props.success ? 'BRAVO !' : 'FAUX !'}
          </Text>
          <Text style={styles.modalText}>La bonne réponse</Text>
          {content ?? <></>}
          <View
            style={[
              {
                flex: 2,
                justifyContent: 'center',
              },
            ]}>
            {soundFinished ? (
              <PrimaryButton
                name="SUIVANT"
                onPress={() => {
                  props.onNext();
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    flexDirection: 'column',
    margin: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    padding: '5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '60%',
  },
  modalText: {
    flex: 1,
    fontSize: FONT.SIZE.BASE,
    color: COLORS.FONT.BASE,
    fontFamily: FONT.FAMILY,
    textAlign: 'center',
  },
});
