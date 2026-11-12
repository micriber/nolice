import {GameKey} from '../../utils/color';

export type FindGameKey = Exclude<GameKey, 'number'>;

export type QuestionConfig = {
  key: string;
  label: string;
};

export const QUESTION_CONFIGS: Record<FindGameKey, QuestionConfig[]> = {
  color: [
    {key: 'yellow', label: 'le jaune'},
    {key: 'red', label: 'le rouge'},
    {key: 'brown', label: 'le marron'},
    {key: 'blue', label: 'le bleu'},
    {key: 'pink', label: 'le rose'},
    {key: 'green', label: 'le vert'},
    {key: 'black', label: 'le noir'},
    {key: 'purple', label: 'le violet'},
    {key: 'orange', label: "l'orange"},
    {key: 'grey', label: 'le gris'},
  ],
  animal: [
    {key: 'bird', label: "l'oiseau"},
    {key: 'cat', label: 'le chat'},
    {key: 'cow', label: 'la vache'},
    {key: 'dog', label: 'le chien'},
    {key: 'duck', label: 'le canard'},
    {key: 'pig', label: 'le cochon'},
    {key: 'rabbit', label: 'le lapin'},
    {key: 'sheep', label: 'le mouton'},
    {key: 'owl', label: 'le hibou'},
    {key: 'frog', label: 'la grenouille'},
    {key: 'butterfly', label: 'le papillon'},
    {key: 'turtle', label: 'la tortue'},
    {key: 'ladybug', label: 'la coccinelle'},
    {key: 'crab', label: 'le crabe'},
    {key: 'whale', label: 'la baleine'},
  ],
  shape: [
    {key: 'circle', label: 'le cercle'},
    {key: 'cross', label: 'la croix'},
    {key: 'heart', label: 'le coeur'},
    {key: 'losange', label: 'le losange'},
    {key: 'oval', label: "l'ovale"},
    {key: 'rectangle', label: 'le rectangle'},
    {key: 'square', label: 'le carré'},
    {key: 'star', label: "l'étoile"},
    {key: 'triangle', label: 'le triangle'},
  ],
  letter: Array.from('abcdefghijklmnopqrstuvwxyz', (key) => ({
    key,
    // Espace insécable : la lettre ne part pas seule à la ligne.
    label: `la lettre\u00A0${key.toUpperCase()}`,
  })),
};
