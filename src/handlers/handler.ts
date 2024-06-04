import { Summary, ExampleProps, Answer } from "../aliases/alias";

function generation(
  limitNumber: number,
  countExample: number,
  operation: string
) {
  const result = rootExecution(limitNumber, countExample, operation);

  return result;
}

function rootExecution(
  limitNumber: number,
  countExample: number,
  operation: string
) {
  switch (operation) {
    case "addition":
      return addition(limitNumber, countExample);
    case "subtraction":
      return subtraction(limitNumber, countExample);
    case "multiplication":
      return multiplication(limitNumber, countExample);
    default:
      return division(limitNumber, countExample);
  }
}

function addition(limitNumber: number, countExample: number) {
  let result = [];
  for (let i = 0; i < countExample; i++) {
    const randomNumber1 = Math.floor(Math.random() * limitNumber) + 1;
    const randomNumber2 = Math.floor(Math.random() * limitNumber) + 1;
    const eachQuestion = {
      num1: randomNumber1,
      num2: randomNumber2,
      userAnswer: null,
      operation: "addition",
    };
    result.push(eachQuestion);
  }
  return result;
}

function subtraction(limitNumber: number, countExample: number) {
  let result = [];
  for (let i = 0; i < countExample; i++) {
    const randomNumber1 = Math.floor(Math.random() * limitNumber) + 1;
    const randomNumber2 = Math.floor(Math.random() * randomNumber1) + 1;
    const eachQuestion = {
      num1: randomNumber1,
      num2: randomNumber2,
      userAnswer: null,
      operation: "subtraction",
    };
    result.push(eachQuestion); // Fixed: Push eachQuestion object
  }

  return result;
}

function multiplication(limitNumber: number, countExample: number) {
  let result = [];
  for (let i = 0; i < countExample; i++) {
    const randomNumber1 = Math.floor(Math.random() * limitNumber) + 1;
    const randomNumber2 = Math.floor(Math.random() * limitNumber) + 1;
    const eachQuestion = {
      num1: randomNumber1,
      num2: randomNumber2,
      userAnswer: null,
      operation: "multiplication",
    };
    result.push(eachQuestion);
  }

  return result;
}

function division(limitNumber: number, countExample: number) {
  let result = [];
  let generated = 0;

  // carrying on generating till we reach limitation - "countExample"
  while (generated < countExample) {
    // Generate random numbers
    const randomNumber1 = Math.floor(Math.random() * limitNumber) + 1;
    // and below randomNumber2 will be generated based on randomNumber1,
    // cause num2 should be less than num1
    const randomNumber2 = Math.floor(Math.random() * randomNumber1) + 1;

    // Check if division result is a whole number
    const validDivision = randomNumber1 / randomNumber2;
    if (Number.isInteger(validDivision)) {
      const eachQuestion = {
        num1: randomNumber1,
        num2: randomNumber2,
        userAnswer: null,
        operation: "division",
      };
      result.push(eachQuestion);
      generated++;
    }
  }

  return result;
}

function check(userAnswers: any, min: number, sec: number): Summary {
  const result = inspect(userAnswers, min, sec);
  return result;
}

function inspect(
  userAnswers: ExampleProps[],
  min: number,
  sec: number
): Summary {
  let summary: Summary = {
    summaries: [],
    examplesCount: userAnswers.length,
    totalCorrect: 0,
    percentCorrect: "0%",
    min,
    sec,
  };

  function evaluateOperation(
    num1: number,
    num2: number,
    userAnswer: number,
    operation: string
  ): Answer {
    const answer: Answer = {
      num1,
      num2,
      userAnswer,
      operation,
      isCorrect: false,
      answer: null,
    };

    switch (operation) {
      case "addition":
        answer.answer = num1 + num2;
        break;
      case "subtraction":
        answer.answer = num1 - num2;
        break;
      case "multiplication":
        answer.answer = num1 * num2;
        break;
      case "division":
        answer.answer = num1 / num2;
        break;
      default:
        break;
    }

    answer.isCorrect = answer.answer === userAnswer;
    return answer;
  }

  summary.summaries = userAnswers.map(({ num1, num2, userAnswer, operation }) =>
    evaluateOperation(num1, num2, userAnswer, operation)
  );

  summary.totalCorrect = summary.summaries.reduce((acc, curr) => {
    if (curr.isCorrect) {
      acc++;
    }
    return acc;
  }, 0);

  summary.percentCorrect =
    ((summary.totalCorrect / summary.examplesCount) * 100).toFixed(2) + "%";

  return summary;
}

export {
  generation,
  rootExecution,
  addition,
  subtraction,
  multiplication,
  division,
  check,
};
