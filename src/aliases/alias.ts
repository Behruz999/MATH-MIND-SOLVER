interface customProps {
  limitNumber: string | number;
  countExample: string | number;
  operation: string;
}

interface ExampleProps {
  num1: number;
  num2: number;
  userAnswer: number;
  operation: string;
}

interface exampleProps {
  num1: number | string;
  num2: number | string;
  operation: string;
  userAnswer: string | number | null;
}

interface timeProps {
  min: number | string;
  sec: number | string;
}

interface finishWorksProps {
  min: number | string;
  sec: number | string;
  userAnswers: exampleProps[];
}

interface Answer {
  num1: number;
  num2: number;
  userAnswer: number;
  operation: string;
  isCorrect: boolean;
  answer: number | null;
}

interface summaryProps {
  answer: number | string;
  isCorrect: boolean | string;
  num1: number | string;
  num2: number | string;
  operation: string;
  userAnswer: number | string;
}

interface Summary {
  summaries: Answer[];
  examplesCount: number;
  totalCorrect: number;
  percentCorrect: string;
  min: number;
  sec: number;
}

export type {
  customProps,
  exampleProps,
  ExampleProps,
  timeProps,
  finishWorksProps,
  Answer,
  summaryProps,
  Summary,
};
