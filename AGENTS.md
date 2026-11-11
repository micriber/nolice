# Nolice

Mobile app (Android-first) — educational game for young French-speaking kids. Four mini-games:
- **NumberGame** ("Les nombres") — count N animals shown, pick the right number 1–9
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
- **Fonts**: Fredoka (display/titles) + Nunito (UI text) via `@expo-google-fonts` — see `src/utils/font.ts`
- **Theme**: « Banquise » design (2026 redesign from a Claude Design handoff) — tokens in `src/utils/color.ts` (`NOL` palette, `shade()` helper, per-game `GAMES` config: amber=number, coral=animal, violet=color, teal=shape)
- **Sizing**: dp values taken from the 412dp-wide phone design, multiplied by `useScale()` (`src/utils/scale.ts`) so tablets get the phone layout enlarged

## Repo layout

```
App.tsx                  Entry: SafeAreaProvider > NavigationContainer > Stack
app.json                 Expo config (plugins: firebase, sentry, expo-audio, expo-font, expo-build-properties, local portrait plugin)
plugins/                 Local Expo config plugins (withPortraitOnLargeScreens)
eas.json                 EAS build profiles: development/preview/production
src/
  screens/
    welcome/index.tsx    First launch only: three steps to pick a mascot, a decor and a track among the base ones, then Home
    home/index.tsx       Landing = brand header (mascot and brush button, both → Settings, music) + 2-col grid of icon-led game cards
    settings/index.tsx   Réglages: mascot (9), decor (4), music track (4) — persisted via useSettingsStore. Rewards not won yet are greyed with a lock and an « i »
    settings/unlock-popup.tsx  Popup explaining how to win a locked reward
    game/
      NumberGame.tsx     "Combien de X ?" — count card + 4 number tiles
      FindGame.tsx       "Trouve X" — generic for animal/color/shape, 2×2 tiles
      GameHeader.tsx     Top bar (home, progress dots, music) + prompt row with SpeakerOrb
      Tile.tsx           White answer tile: idle/right/wrong/dim states, badge, shake/pop
      result-sheet.tsx   Bottom sheet after answering (mascot mood + Bravo!/Presque! + Continuer)
      {animal,color,shape}-picture.tsx  Picture components per type (animals are PNG, colors and shapes SVG), take a `size` dp prop
      question-config.ts FindGame item lists per game type (`QUESTION_CONFIGS`: key + French label), `FindGameKey`, `QuestionConfig`
    score/index.tsx      Mascot mood + 3 stars + score pill + the reward won with this game, if any (tapping it selects it) + REJOUER → Home
    types.ts             StackNavigatorParamList, NavigationProp, FindGameParams
  components/
    Screen.tsx           Screen root: full-screen IceBg + SafeAreaView around the content
    FillSvg.tsx          Svg stretched over its container (gradients, backgrounds)
    DecorThumb.tsx       Miniature of a decor (Settings, Welcome, unlock popup, reward card on Score)
    Equalizer.tsx        Dancing bars marking the track being heard (Settings, Welcome)
    IceBg.tsx            Animated background, 4 scenes (banquise/bulles/nuages/automne): snow, bubbles, clouds or leaves drifting across the screen over two hills, `tint` per game
    MascotVisit.tsx      The mascot showing up at the bottom of the screen now and then (game screens only): it hops across, or pops up from below and jumps on the spot
    BigButton.tsx        Chunky 3D button that presses down (Continuer, Rejouer)
    RoundBtn.tsx         Chunky round button (home, brush, music)
    Mascot.tsx           Mascot w/ moods (happy/content/sad) + anims (float/bob/jump) + MASCOTS list
    MusicButton.tsx      Music toggle pill: colored+note = on, white+slashed = off
    Progress.tsx         10 question dots (green/red/current/upcoming)
    Confetti.tsx         One-shot falling confetti (correct answer, happy score)
    SpeakerOrb.tsx       account-voice icon in white orb + ring wave → replays question audio
    GameGlyphs.tsx       Home card pictograms: Numerals "123", painter palette, shape cluster
  store/
    audio.ts             useSoundStore — single foreground player + looping background player
    game.ts              useGameScoreStore — questions[], currentIndex, init/next/hasMore/getResults
    settings.ts          useSettingsStore — mascot/decor/musicTrack and `welcomed` (welcome tour done), persisted to a JSON file (expo-file-system)
    rewards.ts           useRewardsStore — mascots and decors won so far, persisted to a JSON file; `claim(gameId, game, score)` grants the reward of a finished game
  utils/                 array.shuffle, random helpers, color (NOL palette + GAMES) / font constants, scale (tablet enlargement), rewards (what unlocks each locked mascot, decor and track), tracks (label and pictogram of each music track)
assets/audio/            ~77 mp3 files (questions, answers, bravo/dommage/congratulation/retry, music tracks)
assets/animals/          PNG animals (game pictures and mascots)
assets/branding/         nolice.png (default mascot « Nolice ») and the adaptive icon foreground
assets/svg/              SVG color splashes and shapes
```

## Navigation flow

`Home` (landing = game selection) → (`NumberGame` | `FindGame`) → `Score` → back to `Home`. On the very first launch the stack starts on `Welcome` instead, which `replace`s itself with `Home` once the tour is finished and sets `welcomed`; `App.tsx` reads that flag once to choose the first route. The game screen `replace`s itself with `Score`, so Android back from Score lands on Home. `Settings` is reachable from Home's brush button and from the mascot next to it. There is no separate "JOUER" menu anymore — it was merged into Home during the redesign.

`FindGame` is parameterized at navigation time with `{questionConfig, gameType}` — the same screen handles animal/color/shape, just a different list from `QUESTION_CONFIGS` (`src/screens/game/question-config.ts`). `Score` receives `{gameId, gameType}` (gameType colors the score number).

## Audio model (important — easy to get wrong)

`useSoundStore` exposes:
- `play(src, callback?)` — foreground sound, one at a time. Calls `callback` when the sound finishes.
- `replay()` — `seekTo(0) + play()` on the foreground player; `SpeakerOrb` uses it to repeat the question without re-decoding.
- `stop()` — pauses the foreground sound and drops its pending callback. Game and Score screens call it on unmount so nothing keeps playing on the next screen.
- `playBackground(src)` — looping music at 20% volume, lowered to 6% while a foreground sound plays; a new source swaps the track and keeps the current on/off state.
- `startBackground(src)` — `playBackground(src)`, then turns the music on if it was off: used when the child picks a track (Settings, Welcome).
- `toggleBackground()` — music on/off, returns the new state. It reads the real player state, so one tap restarts music the system paused behind the store's back (audio focus loss).

Key contract:
- **One foreground `AudioPlayer` for the whole app life**, created on the first `play()` and reused: each later `play()` does `pause()` (stops the old sound synchronously) → `replace(src)` → `seekTo(0)` → `play()`. The background player is reused the same way when the track changes. The player stays alive after `didJustFinish`, which is what makes `replay()` possible.
- The `playbackStatusUpdate` listener is attached once, at player creation. The pending callback lives in the module-level `foregroundCallback`; each `play()` clears it and arms the new one only after its own `seekTo(0)`, so neither an interrupted sound nor a late `didJustFinish` from the previous one fires a callback.
- **All question/answer sounds are preloaded at boot via `preloadAllAssets()`** (called from `App.tsx`; music tracks are loaded by `playBackground` instead). The splash screen stays visible until fonts, `backgroundLoaded` and `assetsLoaded` are all ready. After splash hides, every `play(src)` hits the in-memory cache that expo-audio populated via `preload()` → near-instant playback on Android (no decode step). iOS consumes preloaded sources on first player creation, so only the first `play()` of each sound benefits there.
- **Preload requires a real `file://` path on Android — do NOT pass `require(...)` IDs directly to `preload()`.** expo-audio's `preload()` on Android resolves bundled `require()` assets to a raw resource identifier (e.g. `assets_audio_responsestar`) and feeds it to `FileDataSource`, which throws `FileNotFoundException`. The workaround in `preloadAllAssets()`: `Asset.fromModule(src).downloadAsync()` to materialize a `file://` path, fall back to `new File(Paths.cache, ...).copy()` (from `expo-file-system` v55 API) if `localUri` is not `file://`, then call `preload({uri: filePath})`. The resolved URI is stored in `resolvedUris` and reused by `resolveSource()` so `play()` consumes the same cached file.
- `play()` exposes `audioLoading: boolean` which is `true` between the call and the moment the player reports `status.playing === true` (with a 2s safety timeout). UIs use this to gate user input (e.g., `Tile` `disabled` prop) and avoid the bug where cancelling a still-loading sound corrupts the audio engine state.

Audio file mapping (`src/store/audio.ts`):
- `SOUNDS` — global one-offs: `BRAVO`, `DOMMAGE`, `CONGRATULATION`, `RETRY`
- `MUSIC_TRACKS` — background tracks keyed by the `musicTrack` setting (`joyeuse`, `calme`); `App.tsx` calls `playBackground(MUSIC_TRACKS[musicTrack])` each time the setting changes
- `SOUNDS_COUNT_QUESTION` — count questions per animal + spoken numbers 1–9
- `SOUNDS_QUESTION[gameType.toUpperCase()][key.toUpperCase()].{QUESTION,ANSWER}` — find/identify per game type per item

ResultSheet plays BRAVO/DOMMAGE → callback plays the correct-answer sound → callback sets `soundFinished=true` which reveals the Continuer button (kept rendered with `opacity:0` + `pointerEvents:'none'` to keep the sheet height stable, with a 4s safety timeout).

## Layout conventions

- Each screen's root is `<Screen>` (`src/components/Screen.tsx`): `<IceBg>` covers the whole screen, status bar included, and the content sits in a `<SafeAreaView>` from `react-native-safe-area-context`, which already handles the status bar inset. Pass `scene` (decor from settings) and, in games, `tint` (game color) and `mascotVisit={!answered}`: the mascot shows up at the bottom of the screen 10–20s into the game, then every 30–60s of question time, with a visit drawn at random, and freezes (visit and wait) while the result sheet hides it. Tapping it sends hearts up. It sits behind the content, so the touch only reaches it through views marked `pointerEvents="box-none"` (the `SafeAreaView` in `Screen`, the content `View` of both game screens): a new wrapper around the game content needs it too.
- Button/header text uses `numberOfLines={1}` + `adjustsFontSizeToFit` — fonts shrink to fit rather than wrapping/clipping. Multiline body text (score message) is left as-is.
- `FONT` exposes font families only (`DISPLAY`/`DISPLAY_BOLD` = Fredoka, `UI`/`UI_HEAVY` = Nunito); sizes are inline dp values taken from the design.
- "Chunky 3D" buttons (BigButton/RoundBtn/Tile/GameCard) fake depth with a darker edge layer: the press swaps `paddingBottom` and compensates with `marginTop` so total height stays constant.
- Result feedback: stars/mood thresholds are aligned — score `<5` → 1★/sad, `5–8` → 2★/content, `≥9` → 3★/happy. Three stars is the score that wins a reward (`SUCCESS_SCORE`). Per-answer: green outline + check on the correct tile, red + cross on the picked wrong one, others dim.

## Game store (`useGameScoreStore`)

Shared between NumberGame and FindGame. Calling `init(maxQuestion, maxAnswer, minAnswer, closeChoices)` resets `currentIndex` to 0 and regenerates `questions[]`. NumberGame calls `init(10, 9, 1, true)` (answers are the numbers 1–9, wrong choices stay within ±3 of the answer); FindGame calls `init(10, questionConfig.length - 1, 0, false)` (answers are indexes into `questionConfig`, wrong choices are drawn from the whole list). Each `Question` has an `answer`, `possibilities[]` (4 shuffled choices including the answer), and a `success` boolean set through `answer(isGood)`.

`hasMoreQuestion()` returns true while `currentIndex < length - 1`.

## Build / dev commands

```
npm run android              # expo run:android -d (builds dev client, installs, starts Metro)
npm run ios                  # expo run:ios
npm run lint                 # eslint --max-warnings 0
npm run ts:check             # tsc --noemit (run this after changes; CI gates on it)
npm test                     # jest (run this after changes; CI gates on it)
npm run build:local:preview  # local EAS APK build (needs SENTRY_AUTH_TOKEN env)
npm run build:preview        # remote EAS APK build
npm run build:release        # remote EAS AAB build
```

To run on a connected phone: enable USB debugging, `adb devices` should list it, then `npm run android` and pick the device.

## Tests

Jest with the `jest-expo` preset, test files next to the code they cover (`*.test.ts`):
- `src/store/game.test.ts`, `src/utils/random.test.ts` — question generation rules, checked over a few hundred random games each.
- `src/screens/game/question-config.test.ts` — every FindGame item has its sounds and its picture.
- `src/utils/rewards.test.ts` — the reward plan adds up (ten rewards, one mascot then one decor or track per game, two mascots for a perfect game), the popup sentences, and which reward a finished game wins.
- `src/store/rewards.test.ts` — rewards are saved and reloaded, a game is claimed once, and saved settings drop a mascot or decor that was not won. Runs against an in-memory `expo-file-system`.
- `src/store/audio.test.ts` — the audio contract above, against a fake `expo-audio` player whose seek and status events the test drives. It proves the store's logic, not the real player: audio changes still need a device check.

## Conventions / pitfalls

- **Zustand subscriptions**: read `useSoundStore` through selectors (`useSoundStore((s) => s.play)`), one per field, so a component re-renders only for the state it shows.
- **Firebase analytics**: use the modular API (`logEvent(getAnalytics(), 'event_name', {...})`). `logScreenView` is deprecated — use `logEvent(analytics, 'screen_view', {screen_name, screen_class})`. Analytics is fire-and-forget (`void logEvent(...)`), so navigation and audio never wait on Firebase.
- **Don't create a fresh player for each component re-render** — always go through `useSoundStore.play()`.
- **Background music volume is 0.2, 0.06 under a foreground sound** (`MUSIC_VOLUME`, `DUCKED_MUSIC_VOLUME` in `src/store/audio.ts`) — don't change without checking the mix with question audio. The music comes back on `didJustFinish` or `stop()`, and stays low when the finish callback chains another sound.
- **Question order** — `init()` deals answers in shuffled rounds, so every answer comes up before one repeats, and it reverses a round that would open on the answer closing the previous one, so two consecutive questions never share an answer. Keep both rules if editing the generator.
- **Adding/renaming a FindGame item** touches three places: its list in `QUESTION_CONFIGS`, the audio entry in `SOUNDS_QUESTION[gameType.toUpperCase()]` and the picture map in its `*-picture.tsx`. `question-config.test.ts` fails while one is missing.
- **Settings persistence** goes through `useSettingsStore` (JSON file via the sync `expo-file-system` v55 `File` API) — no AsyncStorage in this project.
- **Adding a music track**: add the key to `MusicTrackKey` (`src/store/settings.ts`), the mp3 to `MUSIC_TRACKS` (`src/store/audio.ts`) and its label and pictogram to `TRACK_CHOICES` (`src/utils/tracks.ts`), a pictogram a child can tell apart without reading. Picking a track in Settings turns the music on, and dancing bars mark the one being heard.
- **Tablet sizing**: every size a child sees goes through `useScale()` — 1 on a phone, up to 2 on a tablet, held back by the window height so a page never overflows. A page taller than 700dp in the design passes its own design height (`useScale(860)` in Settings). A raw dp value stays phone-sized on a tablet.
- **Stretched SVGs go through `<FillSvg>`**: it measures its container and passes numeric sizes. A `width="100%"` Svg keeps its old drawing when the window is resized (a foldable being opened), and comes out too narrow inside a padded parent.
- **Portrait lock on tablets**: Android may ignore it on screens ≥ 600dp and show the app in a portrait band inside a landscape screen (a narrow, short window — hence the height limit in `useScale()`). On Android 16 the lock is dropped entirely for apps targeting API 36; `plugins/withPortraitOnLargeScreens.js` declares the temporary opt-out, which stops working once the app targets API 37 — a landscape layout is needed before that bump.
- **Rewards** (plan in `readme.md`, « Les récompenses à débloquer »): `src/utils/rewards.ts` holds the rules — what each locked mascot or decor needs (`MASCOT_UNLOCKS`, `DECOR_UNLOCKS`) and `rewardFor(game, score, owned)`, which gives at most one reward per game: a perfect-game mascot on 10/10 while one is left, otherwise from 9/10 the next reward of the game. Score claims it once per `gameId` through `useRewardsStore` and shows it on a card the child taps to select it; Settings greys what `lockOf()` still reports as locked, and `useSettingsStore` falls back to the default mascot or decor when the saved one was not won. The two extra tracks do not exist yet: Settings shows them as « Mystère » and no game can win them. Unlocking a new mascot or decor = one entry in its `*_UNLOCKS` map.
- **Adding a 5th/6th game**: append to `GAMES` in `src/utils/color.ts` — the Home grid auto-wraps to 3 rows of 2 (layout validated in the design).

## Things that are NOT in the codebase

- No component or end-to-end tests. UI, navigation and real audio playback need to be verified manually on device.
- No iOS-specific config beyond the default — Android is the primary target.
- No i18n — strings are inlined in French.
