# NOLICE

## Idées d’évolution — Nolice – Maternelle

**Nolice – Maternelle** compte six jeux : les nombres, les animaux, les couleurs, les formes, les lettres (« Trouve la lettre A », avec quatre choix comme A, S, L et F, en majuscules pour commencer) et les suites.

### Les suites

L’enfant observe une suite qui mêle animaux et formes, et choisit l’image qui vient après parmi quatre propositions. Consigne, écrite et dite : « Qu’est-ce qui vient après ? »

Exemple : chat, rond, chat, rond, chat, **?** → rond.

Une partie mélange quatre sortes de suites, de cinq images chacune :

- Deux images en alternance : chat, rond, chat, rond, chat…
- La première image doublée : chat, chat, rond, chat, chat…
- La deuxième image doublée : chat, rond, rond, chat, rond…
- Trois images : chat, rond, chien, chat, rond…

Chaque suite contient au moins un animal et une forme, et chaque forme a sa propre couleur. Les quatre propositions contiennent toujours les images de la suite. Le jeu se joue sans savoir lire et réutilise les illustrations des animaux et des formes. Sa réponse a sa propre voix, « C’est le chat. », qui répond à la question posée.

La piste suivante reste ouverte pour un prochain jeu.

### Les tailles

L’enfant compare plusieurs représentations du même animal ou objet à différentes tailles et touche celle qui répond à la consigne : « Trouve le plus grand » ou « Trouve le plus petit ».

Exemple : quatre lapins de tailles différentes → toucher le plus petit.

Conserver la même illustration pour que seule la taille varie, avec des écarts bien visibles et une seule bonne réponse. Une progression possible serait de commencer avec deux choix, puis d’en proposer trois ou quatre.

Une version **Nolice – Élémentaire** est également envisagée ensuite, avec des jeux adaptés à ce niveau ; les premières pistes sont un jeu de calcul et un jeu où il faut deviner des mots.

### Les récompenses à débloquer

Vingt et une récompenses se gagnent en jouant : treize mascottes, quatre décors et quatre musiques.

| | Disponible au départ | À débloquer |
|---|---|---|
| Mascottes | Nolice, le chat et le chien | Treize autres animaux : lapin, canard, oiseau, cochon, vache, mouton, hibou, grenouille, papillon, tortue, coccinelle, crabe et baleine |
| Décors | Nuages et bulles | La banquise, l’automne, les étoiles et l’océan |
| Musiques | Joyeuse et calme | Aventure, festive, jazzy et nature |

Chaque jeu est lié à une mascotte, puis à un décor ou une musique :

| Jeu | Première réussite | Deuxième réussite |
|---|---|---|
| Les nombres | Le mouton | La musique aventure |
| Les animaux | Le canard | L’automne |
| Les couleurs | L’oiseau | La musique festive |
| Les formes | Le cochon | La banquise |
| Les lettres | Le hibou | Les étoiles |
| Les suites | La grenouille | La musique nature |

Une réussite est une partie terminée avec au moins 9 sur 10. Le lapin, la vache, le papillon, la tortue, la coccinelle, le crabe et la baleine sont les mascottes du sans-faute. Le décor de l’océan, puis la musique jazzy, se gagnent eux aussi au sans-faute, une fois ces mascottes obtenues.

Une partie ne donne jamais plus d’une récompense :

- Un sans-faute (10 sur 10), dans n’importe quel jeu, donne une récompense du sans-faute tant qu’il en reste : les mascottes d’abord, puis le décor, puis la musique.
- Sinon, une réussite donne la récompense suivante du jeu : sa mascotte, puis son décor ou sa musique.

Les vingt et une récompenses demandent donc au moins vingt et une parties réussies.

Les récompenses sont à publier dans la même version que le choix de la mascotte et du décor, absent de la version aujourd’hui en ligne : aucun joueur ne perd alors quelque chose qu’il avait déjà.

L’écran de score suit la même règle, trois étoiles pour une récompense. Les titres et l’humeur de la mascotte restent ceux d’aujourd’hui, seuls les seuils changent :

| Score | Étoiles | Titre | Aujourd’hui |
|---|---|---|---|
| 9 ou 10 | 3 | « Bravo ! » | À partir de 8 |
| 5 à 8 | 2 | « Bien joué ! » | De 4 à 7 |
| 0 à 4 | 1 | « Bien essayé ! » | De 0 à 3 |

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
