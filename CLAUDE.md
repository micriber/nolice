# Nolice

Mobile app (Android-first) — educational game for young French-speaking kids. Four mini-games:
- **NumberGame** ("Compter les animaux") — count N animals shown, pick the right number 1–9
- **FindGame** in 3 flavors via `gameType` param — `animal`, `color`, `shape`. User hears "Trouve X" and taps the matching picture among 4 choices.

Each game runs 10 randomized questions, then shows a Score screen with replay button.

UI language: French only. UI text and audio are entirely in French.

## Tech stack

- **Expo 55** (managed workflow with native code via prebuild), React Native 0.83, React 19.2, TypeScript
- **Navigation**: `@react-navigation/native-stack` v7 — single stack, all screens are stack screens
- **State**: Zustand v4 (`src/store/`)
- **Audio**: `expo-audio` (migrated from `expo-av` in commit `f30cb5c`)
- **Analytics**: `@react-native-firebase/analytics` (modular API only — `logEvent`, not legacy namespaced API)
- **Crash reporting**: Sentry (`@sentry/react-native`)
- **Fonts**: `TitilliumWeb_700Bold` via `@expo-google-fonts`
- **Responsive sizing**: `react-native-responsive-fontsize` (`RFPercentage(n)` = n% of screen height)

## Repo layout

```
App.tsx                  Entry: SafeAreaProvider > NavigationContainer > Stack
app.json                 Expo config (plugins: firebase, sentry, expo-audio, expo-font, expo-build-properties)
eas.json                 EAS build profiles: development/preview/production
src/
  screens/
    menu/                MainMenu (JOUER) + GameSelectionMenu (4 game buttons)
    game/
      NumberGame.tsx     "Combien comptes-tu de X ?"
      FindGame.tsx       "Trouve X" — generic for animal/color/shape
      result-modal.tsx   Post-answer modal (BRAVO/FAUX + correct answer + SUIVANT)
      ChoiceButton.tsx   Round button for answer choices (number/animal/color/shape)
      {animal,color,shape}-picture.tsx  SVG/image components per type
    score/index.tsx      Final score + REJOUER → MainMenu
    types.ts             StackNavigatorParamList
  components/
    PrimaryButton.tsx    Big yellow button (JOUER, SUIVANT, REJOUER, game selection)
    InstructionButton.tsx  Voice icon → replays current question audio
    MusicButton.tsx      Toggle background music
  store/
    audio.ts             useSoundStore — single foreground player + looping background player
    game.ts              useGameScoreStore — questions[], currentIndex, init/next/hasMore/getResults
  utils/                 array.shuffle, random helpers, color/font constants
assets/audio/            ~76 mp3 files (questions, answers, BRAVO/FAUX/CONGRAT/RETRY, music)
assets/svg/              SVG logos and shapes
```

## Navigation flow

`MainMenu` → `GameSelectionMenu` → (`NumberGame` | `FindGame`) → `Score` → back to `MainMenu`

`FindGame` is parameterized at navigation time with `{questionConfig, gameType}` — the same screen handles animal/color/shape, just different `questionConfig` arrays defined in `GameSelectionMenu.tsx`.

## Audio model (important — easy to get wrong)

`useSoundStore` exposes:
- `play(src, callback?)` — foreground player. Plays one sound at a time. Calls `callback` when the sound finishes.
- `playBackground / pauseBackground / unPauseBackground` — looping music at 20% volume.

Key contract:
- **Only one foreground player exists at any moment.** When `play()` is called, the previous player is `pause()`d (synchronously stops audio) then `remove()`d (async release on Android).
- The listener for `didJustFinish` guards with `if (get().currentPlayer === player)` before clearing state — prevents a late-firing event from a stale player from wiping out the active one.
- This pattern was a regression fix after migrating from `expo-av` (where `stopAsync`/`unloadAsync` were awaited). On Android, `player.remove()` schedules release via `GlobalScope.launch(Dispatchers.Main)` — without explicit `pause()` first, the old sound keeps playing briefly while the new one starts → user hears two audios simultaneously.

Audio file mapping (`src/store/audio.ts`):
- `SOUNDS` — global one-offs: `MUSIC`, `BRAVO`, `DOMMAGE`, `CONGRATULATION`, `RETRY`
- `SOUNDS_COUNT_QUESTION` — count questions per animal + spoken numbers 1–9
- `SOUNDS_QUESTION[gameType.toUpperCase()][key.toUpperCase()].{QUESTION,ANSWER}` — find/identify per game type per item

ResultModal plays BRAVO/FAUX → callback plays the correct-answer sound → callback sets `soundFinished=true` which reveals the SUIVANT button (kept rendered with `opacity:0` + `pointerEvents:'none'` to keep modal width stable).

## Layout conventions

- Each screen's root is `<SafeAreaView>` from `react-native-safe-area-context` (not RN's deprecated one). Don't add `paddingTop` for the status bar — SafeAreaView handles it.
- All button/header text uses `numberOfLines={1}` + `adjustsFontSizeToFit` — fonts shrink to fit rather than wrapping/clipping. Multiline body text (score message, count question) is left as-is.
- `FONT.SIZE` is in `RFPercentage` of screen height — text is responsive to device size.

## Game store (`useGameScoreStore`)

Shared between NumberGame and FindGame. Calling `init(maxQuestion, maxAnswer)` resets `currentIndex` to 0 and regenerates `questions[]`. Each `Question` has an `answer` (the correct value index), `possibilities[]` (4 shuffled choices including the answer), and a `success` boolean mutated on answer.

`hasMoreQuestion()` returns true while `currentIndex < length - 1`.

## Build / dev commands

```
npm run android              # expo run:android -d (builds dev client, installs, starts Metro)
npm run ios                  # expo run:ios
npm run lint                 # eslint --max-warnings 0
npm run ts:check             # tsc --noemit (run this after changes; CI gates on it)
npm run build:local:preview  # local EAS APK build (needs SENTRY_AUTH_TOKEN env)
npm run build:preview        # remote EAS APK build
npm run build:release        # remote EAS AAB build
```

To run on a connected phone: enable USB debugging, `adb devices` should list it, then `npm run android` and pick the device.

## Conventions / pitfalls

- **Firebase analytics**: use the modular API (`logEvent(getAnalytics(), 'event_name', {...})`). `logScreenView` is deprecated — use `logEvent(analytics, 'screen_view', {screen_name, screen_class})`.
- **Don't add `paddingTop` to screen roots** — use SafeAreaView.
- **Don't create a fresh player for each component re-render** — always go through `useSoundStore.play()`.
- **Background music volume is 0.2** — don't change without checking the mix with question audio.
- **Two consecutive questions can't have the same answer** — `init()` reshuffles until that's true. Keep this invariant if editing the generator.
- **`questionConfig` for FindGame is duplicated by gameType inline in `GameSelectionMenu.tsx`** — if adding/renaming an item, update both the config and the matching audio entry in `SOUNDS_QUESTION[gameType.toUpperCase()]`.

## Things that are NOT in the codebase

- No tests (no Jest/RTL setup). UI changes need to be verified manually on device.
- No iOS-specific config beyond the default — Android is the primary target.
- No i18n — strings are inlined in French.
