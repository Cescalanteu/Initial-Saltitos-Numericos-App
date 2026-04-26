interface PauseScreenProps {
  onResume: () => void;
  onRepeat: () => void;
  onFinish: () => void;
}

export function PauseScreen({ onResume, onRepeat, onFinish }: PauseScreenProps) {
  return (
    <section className="pause-screen" aria-label="Pausa sensorial">
      <div className="breathing-dot" aria-hidden="true" />
      <h2>Pausa tranquila</h2>
      <div className="pause-actions">
        <button type="button" onClick={onResume} aria-label="Volver a la actividad">
          Volver
        </button>
        <button type="button" onClick={onRepeat} aria-label="Repetir la misma suma">
          Otra vez
        </button>
        <button type="button" onClick={onFinish} aria-label="Terminar la práctica">
          Terminar
        </button>
      </div>
    </section>
  );
}
