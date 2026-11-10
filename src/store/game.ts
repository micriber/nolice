import {create} from 'zustand';

import {shuffle} from '../utils/array';
import {getRandomRangeIntUnique} from '../utils/random';

export type Possibility = {
  value: number;
  isGood: boolean;
};

export type Question = {
  answer: number;
  success: boolean;
  possibilities: Possibility[];
};

// Made with hate by @bersiroth
function newQuestion(
  answer: number,
  minAnswer: number,
  maxAnswer: number,
  closeChoices: boolean,
): Question {
  const answerCount = maxAnswer - minAnswer + 1;
  const range = closeChoices
    ? Math.max(Math.floor(answerCount / 3), 3)
    : answerCount;
  const randomRange = getRandomRangeIntUnique(
    Math.max(answer - range, minAnswer),
    Math.min(answer + range, maxAnswer),
    3,
    answer,
  );

  const possibilities: Possibility[] = [
    {value: answer, isGood: true},
    ...randomRange.map((value) => ({value, isGood: false})),
  ];

  return {
    answer,
    success: false,
    possibilities: shuffle(possibilities),
  };
}

interface GameScoreState {
  currentIndex: number;
  questions: Question[];
  init: (
    maxQuestion: number,
    maxAnswer: number,
    minAnswer: number,
    closeChoices: boolean,
  ) => void;
  answer: (isGood: boolean) => void;
  nextQuestion: () => void;
  hasMoreQuestion: () => boolean;
  getResults: () => number;
}

export const useGameScoreStore = create<GameScoreState>((set, get) => ({
  currentIndex: 0,
  questions: [],
  init: (maxQuestion, maxAnswer, minAnswer, closeChoices) => {
    const answerCount = maxAnswer - minAnswer + 1;
    const questions: Question[] = [];
    let round: number[] = [];
    for (let i = 0; i < maxQuestion && answerCount > 0; i++) {
      // Par tours complets : toutes les réponses sortent avant qu'une seule ne revienne.
      if (round.length === 0) {
        round = shuffle(
          Array.from({length: answerCount}, (_, n) => minAnswer + n),
        );
        // La réponse qui ferme un tour ne doit pas ouvrir le suivant.
        if (round[round.length - 1] === questions[i - 1]?.answer) {
          round.reverse();
        }
      }
      const answer = round.pop()!;
      questions.push(newQuestion(answer, minAnswer, maxAnswer, closeChoices));
    }

    set(() => ({questions, currentIndex: 0}));
  },
  answer: (isGood) => {
    set((state) => ({
      questions: state.questions.map((question, i) =>
        i === state.currentIndex ? {...question, success: isGood} : question,
      ),
    }));
  },
  nextQuestion: () => {
    set((state) => {
      return {currentIndex: state.currentIndex + 1};
    });
  },
  hasMoreQuestion: (): boolean => {
    return get().currentIndex < get().questions.length - 1;
  },
  getResults: (): number => {
    return get().questions.reduce(
      (acc, question) => (question.success ? acc + 1 : acc),
      0,
    );
  },
}));
