import {Question, useGameScoreStore} from './game';

const RUNS = 300;

type GameSetup = {
  name: string;
  maxAnswer: number;
  minAnswer: number;
  closeChoices: boolean;
};

const GAME_SETUPS: GameSetup[] = [
  {name: 'NumberGame', maxAnswer: 9, minAnswer: 1, closeChoices: true},
  {name: '8 items FindGame', maxAnswer: 7, minAnswer: 0, closeChoices: false},
  {name: '10 items FindGame', maxAnswer: 9, minAnswer: 0, closeChoices: false},
];

function generate(setup: Omit<GameSetup, 'name'>): Question[] {
  const {maxAnswer, minAnswer, closeChoices} = setup;
  useGameScoreStore.getState().init(10, maxAnswer, minAnswer, closeChoices);
  return useGameScoreStore.getState().questions;
}

function eachGame(setup: GameSetup, check: (questions: Question[]) => void) {
  for (let run = 0; run < RUNS; run++) {
    check(generate(setup));
  }
}

describe.each(GAME_SETUPS)('init for $name', (setup) => {
  const answerCount = setup.maxAnswer - setup.minAnswer + 1;

  it('creates 10 questions with 4 distinct choices and one good answer', () => {
    eachGame(setup, (questions) => {
      expect(questions).toHaveLength(10);
      questions.forEach((question) => {
        const values = question.possibilities.map((choice) => choice.value);
        const good = question.possibilities.filter((choice) => choice.isGood);

        expect(new Set(values).size).toBe(4);
        expect(good).toEqual([{value: question.answer, isGood: true}]);
        expect(question.success).toBe(false);
      });
    });
  });

  it('keeps every choice among the possible answers', () => {
    eachGame(setup, (questions) => {
      const values = questions.flatMap((question) =>
        question.possibilities.map((choice) => choice.value),
      );

      expect(Math.min(...values)).toBeGreaterThanOrEqual(setup.minAnswer);
      expect(Math.max(...values)).toBeLessThanOrEqual(setup.maxAnswer);
    });
  });

  it('never asks the same answer twice in a row', () => {
    eachGame(setup, (questions) => {
      questions.forEach((question, i) => {
        expect(question.answer).not.toBe(questions[i + 1]?.answer);
      });
    });
  });

  it('goes through every answer before repeating one', () => {
    eachGame(setup, (questions) => {
      const firstRound = questions.slice(0, answerCount);
      const answers = new Set(firstRound.map((question) => question.answer));

      expect(answers.size).toBe(firstRound.length);
    });
  });
});

describe('init choices', () => {
  it('keeps wrong choices within 3 of the answer when closeChoices is on', () => {
    eachGame(GAME_SETUPS[0], (questions) => {
      const gaps = questions.flatMap((question) =>
        question.possibilities.map((choice) =>
          Math.abs(choice.value - question.answer),
        ),
      );

      expect(Math.max(...gaps)).toBeLessThanOrEqual(3);
    });
  });

  it('draws wrong choices from the whole list when closeChoices is off', () => {
    const wrongChoicesOfFirstItem = new Set<number>();
    eachGame(GAME_SETUPS[2], (questions) => {
      questions
        .filter((question) => question.answer === 0)
        .flatMap((question) => question.possibilities)
        .filter((choice) => !choice.isGood)
        .forEach((choice) => wrongChoicesOfFirstItem.add(choice.value));
    });

    expect([...wrongChoicesOfFirstItem].sort()).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});

describe('init with a short list', () => {
  it.each([1, 2, 3])('still builds 10 questions out of %i items', (count) => {
    for (let run = 0; run < RUNS; run++) {
      const questions = generate({
        maxAnswer: count - 1,
        minAnswer: 0,
        closeChoices: false,
      });

      expect(questions).toHaveLength(10);
      questions.forEach((question, i) => {
        expect(question.possibilities).toHaveLength(count);
        if (count > 1) {
          expect(question.answer).not.toBe(questions[i + 1]?.answer);
        }
      });
    }
  });

  it('builds no question out of an empty list', () => {
    expect(
      generate({maxAnswer: -1, minAnswer: 0, closeChoices: false}),
    ).toEqual([]);
  });
});

describe('game progress', () => {
  const store = () => useGameScoreStore.getState();

  beforeEach(() => {
    generate(GAME_SETUPS[0]);
  });

  it('records the answer on the current question only', () => {
    store().answer(true);
    store().nextQuestion();
    store().answer(false);

    expect(store().questions.map((question) => question.success)).toEqual([
      true,
      ...Array(9).fill(false),
    ]);
  });

  it('counts the good answers', () => {
    for (let i = 0; i < 10; i++) {
      store().answer(i % 3 === 0);
      store().nextQuestion();
    }

    expect(store().getResults()).toBe(4);
  });

  it('has more questions until the last one', () => {
    for (let i = 0; i < 9; i++) {
      expect(store().hasMoreQuestion()).toBe(true);
      store().nextQuestion();
    }

    expect(store().hasMoreQuestion()).toBe(false);
  });

  it('starts a new game from scratch', () => {
    store().answer(true);
    store().nextQuestion();

    generate(GAME_SETUPS[0]);

    expect(store().currentIndex).toBe(0);
    expect(store().getResults()).toBe(0);
  });
});
