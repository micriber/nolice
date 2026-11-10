# NOLICE

## Idées d’évolution — Nolice – Maternelle

L’objectif à terme est de proposer six jeux sous le nom **Nolice – Maternelle**. Aux quatre jeux actuels (nombres, animaux, couleurs et formes) s’ajouterait un jeu de lettres : « Trouve la lettre A », avec quatre choix comme A, S, L et F, en commençant par les majuscules.

Les deux pistes suivantes sont à explorer pour le sixième jeu ; le choix reste ouvert.

### Les suites

L’enfant observe une suite d’animaux ou de formes et choisit l’image qui vient après parmi quatre propositions. Consigne orale : « Qu’est-ce qui vient après ? »

Exemple : chat, chien, chat, chien, **?** → chat.

Progression possible :

- Deux éléments en alternance : chat, chien, chat, chien…
- Trois éléments : rond, carré, triangle, rond, carré…
- Un motif avec répétition : chat, chat, chien, chat, chat…

Afficher suffisamment de répétitions pour rendre le motif identifiable. Le jeu doit pouvoir se jouer sans savoir lire et pourrait réutiliser les illustrations existantes.

### Les tailles

L’enfant compare plusieurs représentations du même animal ou objet à différentes tailles et touche celle qui répond à la consigne : « Trouve le plus grand » ou « Trouve le plus petit ».

Exemple : quatre lapins de tailles différentes → toucher le plus petit.

Conserver la même illustration pour que seule la taille varie, avec des écarts bien visibles et une seule bonne réponse. Une progression possible serait de commencer avec deux choix, puis d’en proposer trois ou quatre.

Une version **Nolice – Élémentaire** est également envisagée ensuite, avec des jeux adaptés à ce niveau ; les premières pistes sont un jeu de calcul et un jeu où il faut deviner des mots.

### Requirements

Make sure you have the following installed:
- [Node.js & npm](https://nodejs.org/en/download/package-manager)
- [SDK Manager](https://developer.android.com/tools/sdkmanager)

## Android
### SDK (Software Development Kit)

Install Android SDK 33 via SDK Manager
```bash 
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.3" "system-images;android-33;default;x86_64"
```

### AVD (Android Virtual Device)

Create a new AVD with avdmanager (replace `android-33` with your desired name)
```bash
avdmanager create avd -n "android-33" -k "system-images;android-33;default;x86_64"
```

You can use a device definition with specify the device name, such as `pixel_7_pro`.

Example
```bash
avdmanager create avd -n "pixel-7-pro" -k "system-images;android-33;default;x86_64" --device "pixel_7_pro"
```

For listing all devices
```bash
avdmanager list devices
```

Result
```bash
---------
id: 31 or "pixel_7"
    Name: Pixel 7
    OEM : Google
---------
id: 32 or "pixel_7_pro"
    Name: Pixel 7 Pro
    OEM : Google
---------
id: 33 or "pixel_c"
    Name: Pixel C
    OEM : Google
---------
id: 34 or "pixel_tablet"
    Name: Pixel Tablet
    OEM : Google
---------
id: 35 or "pixel_xl"
    Name: Pixel XL
    OEM : Google
---------
```

### Emulator

Start the emulator with the AVD name (example with `pixel-7-pro`)
```bash
emulator @pixel-7-pro -no-boot-anim -netdelay none -no-snapshot -wipe-data
``` 
> [!TIP]
> It's not necessary to start the emulator manually before running the project because Expo can automatically open the emulator.

## Run the project

### Install dependencies

Install the dependencies with npm
```bash
npm install
```

### Start the project on Android emulator
Start the project with Expo
```bash
npm run android
```

select the emulator or device to run the project
```bash
> nolice@1.1.0 android
> expo run:android -d

? Select a device/emulator › 
❯   pixel-7-pro (emulator)
```

## Build the project
### Build APK

For local build you need to set `SENTRY_AUTH_TOKEN` in the environment variables.

Build a local APK with Expo
```bash
export SENTRY_AUTH_TOKEN=your_auth_token
npm run build:local:preview
```

Build APK with expo SAAS
```bash
npm run build:preview
```

### Build AAB (Android App Bundle)

Build a local AAB with Expo
```bash
npm run build:local:release
```

Build AAB with expo SAAS
```bash
npm run build:release
```

### Install APK

Connect the device or emulator to the computer with USB or Wifi debugging enabled .

For activate Wifi debugging
>TODO: Add instructions to enable Wifi debugging

To connect the device with Wifi debugging.
```bash
adb connect 192.168.1.2:94097   # replace with your device IP
``` 

You can install APK on the emulator or device with adb
```bash
adb install build-1719502913379.apk
```
