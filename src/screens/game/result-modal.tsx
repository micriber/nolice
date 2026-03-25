import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {AudioSource} from 'expo-audio';
import React, {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import PrimaryButton from '../../components/PrimaryButton';
import {SOUNDS, useSoundStore} from '../../store/audio';
import COLORS from '../../utils/color';

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
  sound: AudioSource;
};

export function ResultModal(props: Props) {
  const soundStore = useSoundStore();
  const [soundFinished, setSoundFinished] = useState(false);

  async function onShow() {
    setSoundFinished(false);
    await logEvent(getAnalytics(), 'result', {
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

  return (
    <Modal
      animationType="fade"
      transparent
      visible={props.visible}
      onShow={onShow}
      onRequestClose={() => {
        props.onClose && props.onClose();
      }}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.feedbackIcon}>
            <MaterialCommunityIcons
              name={props.success ? 'check-circle' : 'close-circle'}
              size={RFPercentage(12)}
              color={
                props.success ? COLORS.FONT.SUCCESS : COLORS.FONT.ERROR
              }
            />
          </View>

          <View style={styles.answerArea}>
            {props.children ?? null}
          </View>

          <View style={styles.nextButton}>
            {soundFinished ? (
              <PrimaryButton
                icon="arrow-right"
                onPress={props.onNext}
                color={
                  props.success ? COLORS.FONT.SUCCESS : COLORS.BUTTON.PRIMARY
                }
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.OVERLAY,
  },
  modal: {
    width: '85%',
    height: '55%',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: RFPercentage(3),
    padding: RFPercentage(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  feedbackIcon: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerArea: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nextButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
