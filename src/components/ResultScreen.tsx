import type { Problem } from "../types";

interface ResultScreenProps {
  problem: Problem;
  onRepeat: () => void;
  onNew: () => void;
  onDone: () => void;
}

export function ResultScreen({ problem, onRepeat, onNew, onDone }: ResultScreenProps) {
  return (
    <section className="result-screen" aria-label="Resultado">
      <p className="result-label">Llegaste</p>
      <div className="result-equation" aria-live="polite">
        {problem.a} + {problem.b} = {problem.result}
      </div>
      <div className="result-actions">
        <button type="button" onClick={onRepeat} aria-label="Repetir esta suma">
          Otra vez
        </button>
        <button type="button" onClick={onNew} aria-label="Crear nuevo problema">
          Nuevo
        </button>
        <button type="button" onClick={onDone} aria-label="Terminar sesión">
          Terminé
        </button>
      </div>
    </section>
  );
}
