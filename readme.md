# NOLICE

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