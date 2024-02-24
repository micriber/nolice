import { create } from 'zustand'

export type Possibility = {
  value: number,
  isGood: boolean
}

export type Question = {
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
export function newQuestion(): Question {
  let max = 9;
  let answer = getRandomInt(max);
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

  return {
    success: false,
    possibilities: possibilities.sort((a, b) => a.value - b.value)
  }
}

interface GameScoreState {
  currentIndex: number
  questions: Question[]
  initQuestions: () => void
  nextQuestion: (success: boolean) => void
  hasNextQuestion: () => boolean
}

export const useGameScoreStore = create<GameScoreState>((set, get) => ({
  currentIndex: 0,
  questions: [],
  initQuestions: () => {
    const questions: Question[] = []
    for (let i = 0; i < 10; i++) {
      questions.push(newQuestion())
    }
    set(() => ({ questions }))
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
    console.log(get().questions[get().currentIndex - 1])
    return get().currentIndex < 10
  }
}))
