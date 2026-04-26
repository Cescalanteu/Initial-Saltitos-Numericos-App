import { describe, expect, it } from "vitest";
import {
  advanceJump,
  createExerciseState,
  createProblem,
  generateProblem,
  validateJump,
  validateStartSelection
} from "./problems";

describe("lógica de problemas", () => {
  it("generateProblem nunca genera a + b > 10 por defecto", () => {
    for (let index = 0; index < 200; index += 1) {
      const problem = generateProblem(10);
      expect(problem.a + problem.b).toBeLessThanOrEqual(10);
      expect(problem.a).toBeGreaterThanOrEqual(1);
      expect(problem.b).toBeGreaterThanOrEqual(1);
    }
  });

  it("validateStartSelection devuelve true solo cuando selectedNumber === a", () => {
    const problem = createProblem(3, 2);
    expect(validateStartSelection(problem, 3)).toBe(true);
    expect(validateStartSelection(problem, 2)).toBe(false);
    expect(validateStartSelection(problem, 4)).toBe(false);
  });

  it("validateJump acepta solo currentPosition + 1 durante suma", () => {
    expect(validateJump(3, 4)).toBe(true);
    expect(validateJump(3, 5)).toBe(false);
    expect(validateJump(3, 3)).toBe(false);
  });

  it("advanceJump actualiza currentPosition, jumpsCompleted y jumpsRemaining correctamente", () => {
    const problem = createProblem(3, 2);
    const state = {
      ...createExerciseState(problem),
      phase: "JUMPING" as const,
      currentPosition: 3,
      selectedStart: true
    };

    const nextState = advanceJump(state, 4);
    expect(nextState.currentPosition).toBe(4);
    expect(nextState.jumpsCompleted).toBe(1);
    expect(nextState.jumpsRemaining).toBe(1);
    expect(nextState.phase).toBe("JUMPING");
  });

  it("cuando jumpsCompleted == b, phase pasa a REVEAL_RESULT", () => {
    const problem = createProblem(3, 2);
    const state = {
      ...createExerciseState(problem),
      phase: "JUMPING" as const,
      currentPosition: 4,
      selectedStart: true,
      jumpsCompleted: 1,
      jumpsRemaining: 1
    };

    const nextState = advanceJump(state, 5);
    expect(nextState.phase).toBe("REVEAL_RESULT");
    expect(nextState.currentPosition).toBe(5);
    expect(nextState.jumpsCompleted).toBe(2);
    expect(nextState.jumpsRemaining).toBe(0);
  });
});
