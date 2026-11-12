import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {parseArgs} from 'node:util';

const voiceId = 'txtf1EDouKke753vN8SL';
const generationSettings = {
  modelId: 'eleven_v4',
  languageCode: 'fr',
  outputFormat: 'mp3_44100_128',
  voiceSettings: {stability: 0.5, similarityBoost: 0.75},
};
const {values: options} = parseArgs({
  options: {
    all: {type: 'boolean'},
    colors: {type: 'boolean'},
    feedback: {type: 'boolean'},
    responses: {type: 'boolean'},
    unlocks: {type: 'boolean'},
    welcome: {type: 'boolean'},
    rewards: {type: 'boolean'},
    letters: {type: 'boolean'},
    file: {type: 'string'},
    generate: {type: 'boolean'},
  },
});
if (
  [
    options.all,
    options.colors,
    options.feedback,
    options.responses,
    options.unlocks,
    options.welcome,
    options.rewards,
    options.letters,
    options.file !== undefined,
  ].filter(Boolean).length > 1
) {
  throw new Error(
    'Choisir un seul filtre : --all, --colors, --feedback, --responses, --unlocks, --welcome, --rewards, --letters ou --file.',
  );
}
if (options.file !== undefined && !/^[a-z-]+(?:\.mp3)?$/.test(options.file)) {
  throw new Error(
    '--file attend un nom de dialogue, par exemple response-losange.mp3.',
  );
}
const dialogueFile = await readFile('assets/audio/dialogues.fr.txt', 'utf8');
let section = '';
const dialogues = [];
for (const line of dialogueFile.split('\n')) {
  if (line.startsWith('[')) section = line;
  const match = line.match(/^([a-z-]+)\.mp3 \| (.+)$/);
  if (match) dialogues.push({name: match[1], text: match[2], section});
}
if (new Set(dialogues.map(({name}) => name)).size !== dialogues.length) {
  throw new Error('Noms de fichiers audio dupliqués.');
}
// Les balises de douceur ont produit du chuchotement lors d’un essai écarté par l'utilisateur.
if (dialogues.some(({text}) => /[\[\]<>]/.test(text))) {
  throw new Error(
    'Les dialogues doivent contenir uniquement le texte à prononcer, sans balise vocale ou SSML.',
  );
}
const selected = options.file
  ? dialogues.filter(({name}) => name === options.file.replace(/\.mp3$/, ''))
  : options.responses
    ? dialogues.filter(
        ({name, section}) =>
          name.startsWith('response-') &&
          ['[COULEURS]', '[ANIMAUX]', '[FORMES]'].includes(section),
      )
    : options.all
      ? dialogues
      : options.colors
        ? dialogues.filter(({section}) => section === '[COULEURS]')
        : options.feedback
          ? dialogues.filter(({section}) => section === '[RETOURS ET SCORE]')
          : options.unlocks
            ? dialogues.filter(
                ({section}) => section === '[RÉCOMPENSES À DÉBLOQUER]',
              )
            : options.welcome
              ? dialogues.filter(
                  ({section}) => section === '[PARCOURS DE BIENVENUE]',
                )
              : options.rewards
                ? dialogues.filter(
                    ({section}) => section === '[RÉCOMPENSES GAGNÉES]',
                  )
                : options.letters
                  ? dialogues.filter(({section}) => section === '[LETTRES]')
                  : dialogues.filter(({name}) =>
                      [
                        'bird',
                        'count-rabbit',
                        'shape-rectangle',
                        'bravo',
                        'response-black',
                      ].includes(name),
                    );
if (!selected.length) throw new Error('Aucun dialogue sélectionné.');
const samples = selected.map(({name, text}) => [name, text]);
const characters = samples.reduce((total, [, text]) => total + text.length, 0);
const manifest = {voiceId, ...generationSettings, characters, samples};
console.log(JSON.stringify(manifest, null, 2));

if (!options.generate) {
  console.log('Aucun appel API. Ajouter --generate pour générer les extraits.');
} else {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY manquante : charger .env.local.');
  }

  const client = new ElevenLabsClient();
  const directory = join('output', 'audio', `jeanne-${Date.now()}`);
  await mkdir(directory, {recursive: true});
  await writeFile(
    join(directory, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );

  for (const [name, text] of samples) {
    const audio = await client.textToSpeech.convert(
      voiceId,
      {
        text,
        ...generationSettings,
      },
      {maxRetries: 0},
    );
    const bytes = new Uint8Array(await new Response(audio).arrayBuffer());
    const path = join(directory, `${name}.mp3`);
    await writeFile(path, bytes, {flag: 'wx'});
    console.log(path);
  }
}
