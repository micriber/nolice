import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MusicButton from '../../components/MusicButton';
import PrimaryButton from '../../components/PrimaryButton';
import COLORS from '../../utils/color';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function MainMenu({navigation}: Props) {
  const handleClick = async () => {
    await logEvent(getAnalytics(), 'play');
    navigation.navigate('GameSelectionMenu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.body}>
        <PrimaryButton icon="play" onPress={handleClick} size="large" />
      </View>
      <View style={styles.footer}>
        <MusicButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
