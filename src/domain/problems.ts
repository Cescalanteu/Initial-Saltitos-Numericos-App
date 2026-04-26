import type { ExerciseState, Problem } from "../types";
import { t } from "../i18n";

const DEFAULT_MAX_NUMBER = 10;

function makeId(prefix: string) {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomPart}`;
}

export function isValidProblem(a: number, b: number, maxNumber = DEFAULT_MAX_NUMBER) {
  return (
    Number.isInteger(a) &&
    Number.isInteger(b) &&
    a >= 1 &&
    a <= maxNumber &&
    b >= 1 &&
    b <= maxNumber - 1 &&
    a + b <= maxNumber
  );
}

export function createProblem(a: number, b: number, maxNumber = DEFAULT_MAX_NUMBER): Problem {
  if (!isValidProblem(a, b, maxNumber)) {
    throw new Error(`Invalid problem: ${a} + ${b} exceeds range 1-${maxNumber}`);
  }

  return {
    id: makeId("problem"),
    a,
    b,
    result: a + b,
    maxNumber,
    createdAt: new Date().toISOString()
  };
}

export function generateProblem(
  maxNumber = DEFAULT_MAX_NUMBER,
  random: () => number = Math.random
): Problem {
  const a = 1 + Math.floor(random() * (maxNumber - 1));
  const maxB = Math.max(1, maxNumber - a);
  const b = 1 + Math.floor(random() * maxB);
  return createProblem(a, b, maxNumber);
}

export function validateStartSelection(problem: Problem, selectedNumber: number) {
  return selectedNumber === problem.a;
}

export function validateJump(currentPosition: number, selectedNumber: number, maxNumber = DEFAULT_MAX_NUMBER) {
  return currentPosition < maxNumber && selectedNumber === currentPosition + 1;
}

export function createExerciseState(problem: Problem): ExerciseState {
  return {
    phase: "SELECT_START",
    problem,
    currentPosition: null,
    jumpsCompleted: 0,
    jumpsRemaining: problem.b,
    selectedStart: false,
    lastMessage: t("select_start", { a: problem.a })
  };
}

export function selectStart(state: ExerciseState, selectedNumber: number): ExerciseState {
  if (!state.problem || !validateStartSelection(state.problem, selectedNumber)) {
    return {
      ...state,
      lastMessage: state.problem ? t("select_start", { a: state.problem.a }) : state.lastMessage
    };
  }

  return {
    ...state,
    phase: "JUMPING",
    currentPosition: selectedNumber,
    selectedStart: true,
    lastMessage: t("make_jumps", { b: state.problem.b })
  };
}

export function advanceJump(state: ExerciseState, selectedNumber: number): ExerciseState {
  if (!state.problem || state.currentPosition === null) {
    return state;
  }

  if (!validateJump(state.currentPosition, selectedNumber, state.problem.maxNumber)) {
    return {
      ...state,
      lastMessage: t("one_step_right")
    };
  }

  const jumpsCompleted = state.jumpsCompleted + 1;
  const jumpsRemaining = Math.max(0, state.problem.b - jumpsCompleted);
  const isComplete = jumpsCompleted === state.problem.b;

  return {
    ...state,
    phase: isComplete ? "REVEAL_RESULT" : "JUMPING",
    currentPosition: selectedNumber,
    jumpsCompleted,
    jumpsRemaining,
    lastMessage: isComplete
      ? t("arrived", { result: state.problem.result })
      : t("jumps_remaining", { n: jumpsRemaining })
  };
}
