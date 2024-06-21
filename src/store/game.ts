import { create } from 'zustand'
import {shuffle} from "../utils/array";
import {getRandomInt, getRandomRangeIntUnique} from "../utils/random";

export type Possibility = {
  value: number,
  isGood: boolean
}

export type Question = {
  answer: number,
  success: boolean,
  possibilities: Possibility[],
}

// Made with hate by @bersiroth
function newQuestion(answer: number, maxAnswer: number): Question {
  const range = Math.floor(maxAnswer / 3);
  const randomRange = getRandomRangeIntUnique(
    Math.max(answer - range, 1),
    Math.min(answer + range, maxAnswer),
    3, answer);

  const possibilities: Possibility[] = [
    { value: answer, isGood: true },
    ...(randomRange?.map(value => ({ value, isGood: false })) || [])
  ];

  return {
    answer,
    success: false,
    possibilities: shuffle(possibilities)
  }
}

interface GameScoreState {
  currentIndex: number
  questions: Question[]
  init: (maxQuestion :number, maxAnswer :number) => void
  nextQuestion: () => void
  getResults: () => number
}

export const useGameScoreStore = create<GameScoreState>((set, get) => ({
  currentIndex: 0,
  questions: [],
  init: (maxQuestion :number = 10, maxAnswer :number = 9) => {
    let questions: Question[] = []
    for (let i = 0; questions.length < maxQuestion; i++) {
      if (i == maxAnswer) {
        i = getRandomInt(maxAnswer - 1)
      }
      questions.push(newQuestion(i+1, maxAnswer))
    }

    do {
      questions = shuffle(questions);
    } while (questions.some((v, i, a) => v.answer === a[i + 1]?.answer));

    set(() => ({ questions, currentIndex: 0 }))
  },
  nextQuestion: () => {
    set((state) => {
      return { currentIndex: state.currentIndex + 1 };
    });
  },
  getResults: (): number => {
    return get().questions.reduce((acc, question) => (question.success ? acc + 1 : acc), 0)
  }
}))
