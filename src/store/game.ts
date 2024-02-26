import { create } from 'zustand'

export const MAX_QUESTION = 10

export type Possibility = {
  value: number,
  isGood: boolean
}
enum Animal {
  duck,
  rabbit,
  dog,
  pig,
  cow,
  cat,
  bird,
  sheep,
}

type AnimalType = keyof typeof Animal;

export type Question = {
  animal: AnimalType,
  success: boolean,
  possibilities: Possibility[],
}

function getRandomInt(max: number) {
  // On ajoute +1 parce que le max, n'est pas le max
  // maintenant le max est le vrai.
  // toi meme tu sais
  return Math.floor(Math.random() * max) + 1;
}

// Made with hate by @bersiroth
export function newQuestion(previousAnimal: AnimalType|undefined): Question {
  let max = 9;
  let answer = getRandomInt(max);
  let animal = Animal[getRandomInt(8) - 1];
  if (previousAnimal !== undefined) {
    while (animal === previousAnimal) {
      animal = Animal[getRandomInt(8) - 1];
    }
  }
  let delta = getRandomInt(2);
  let possibilities: Possibility[] = [
    {
      value: answer,
      isGood: true
    }
  ];
  let secondLabel;
  if (answer - delta > 0) {
    possibilities.push({
      value: (secondLabel = answer - delta),
      isGood: false
    });
  } else {
    possibilities.push({
      value: (secondLabel = answer + delta + delta),
      isGood: false
    });
  }
  if (answer + delta <= max) {
    possibilities.push({
      value: (answer + delta),
      isGood: false
    });
  } else {
    possibilities.push({
      value: (secondLabel - delta),
      isGood: false
    });
  }

  return <Question>{
    animal: animal,
    success: false,
    possibilities: possibilities.sort((a, b) => 0.5 - Math.random())
  }
}

interface GameScoreState {
  currentIndex: number
  questions: Question[]
  init: () => void
  nextQuestion: (success: boolean) => void
  hasNextQuestion: () => boolean
  getResults: () => number
}

export const useGameScoreStore = create<GameScoreState>((set, get) => ({
  currentIndex: 0,
  questions: [],
  init: () => {
    const questions: Question[] = []
    let previousAnimal;
    for (let i = 0; i < 10; i++) {
      const question = newQuestion(previousAnimal);
      previousAnimal = question.animal;
      questions.push(question)
    }
    set(() => ({ questions, currentIndex: 0 }))
  },
  nextQuestion: (success: boolean) => {
    set((state) => {
      const newQuestions = [...state.questions]
      newQuestions[state.currentIndex].success = success
      return { questions: newQuestions }
    })
    set((state) => ({ currentIndex: state.currentIndex + 1 }))
  },
  hasNextQuestion: (): boolean => {
    return get().currentIndex < MAX_QUESTION
  },
  getResults: (): number => {
    return get().questions.reduce((acc, question) => (question.success ? acc + 1 : acc), 0)
  }
}))
