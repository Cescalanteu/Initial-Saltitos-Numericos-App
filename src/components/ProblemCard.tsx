import type { ExerciseState } from "../types";

interface ProblemCardProps {
  exercise: ExerciseState;
  demoActive: boolean;
}

export function ProblemCard({ exercise, demoActive }: ProblemCardProps) {
  const problem = exercise.problem;
  if (!problem) {
    return (
      <section className="problem-card empty-card" aria-label="Sin problema activo">
        <p>Elige una suma para empezar.</p>
      </section>
    );
  }

  const equation = exercise.phase === "REVEAL_RESULT" ? `${problem.a} + ${problem.b} = ${problem.result}` : `${problem.a} + ${problem.b}`;

  return (
    <section className="problem-card" aria-label="Problema actual">
      <div>
        <p className="eyebrow">{demoActive ? "Demostración" : "Práctica"}</p>
        <div className="equation-display" aria-live="polite">
          {equation}
        </div>
      </div>
      <div className="problem-steps" aria-label="Pasos de la suma">
        <div className={exercise.selectedStart ? "step-chip done" : "step-chip"}>
          <span aria-hidden="true">1</span>
          Empieza en {problem.a}
        </div>
        <div className={exercise.jumpsCompleted > 0 ? "step-chip done" : "step-chip"}>
          <span aria-hidden="true">2</span>
          {problem.b} saltitos
        </div>
        <div className={exercise.phase === "REVEAL_RESULT" ? "step-chip done" : "step-chip"}>
          <span aria-hidden="true">=</span>
          {exercise.phase === "REVEAL_RESULT" ? `Llegaste al ${problem.result}` : `Faltan ${exercise.jumpsRemaining}`}
        </div>
      </div>
    </section>
  );
}
