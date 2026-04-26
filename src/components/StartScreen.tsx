interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="start-screen" aria-labelledby="app-title">
      <div className="brand-mark" aria-hidden="true">
        1 2 3
      </div>
      <h1 id="app-title">Saltitos Numéricos</h1>
      <button className="primary-action" type="button" onClick={onStart} aria-label="Empezar práctica">
        Empezar
      </button>
      <p className="scope-note">Práctica familiar. Sin datos en la nube.</p>
    </main>
  );
}
