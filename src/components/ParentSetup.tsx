import { useMemo, useState } from "react";
import type { AppSettings, Problem } from "../types";
import { createProblem, generateProblem, isValidProblem } from "../domain/problems";
import { SettingsPanel } from "./SettingsPanel";

interface ParentSetupProps {
  settings: AppSettings;
  hasActiveProblem: boolean;
  onSettingsChange: (settings: AppSettings) => void;
  onStartProblem: (problem: Problem, mode: "practice" | "demo") => void;
}

export function ParentSetup({
  settings,
  hasActiveProblem,
  onSettingsChange,
  onStartProblem
}: ParentSetupProps) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const validManualProblem = isValidProblem(a, b, settings.maxNumber);

  const bOptions = useMemo(() => {
    return Array.from({ length: settings.maxNumber - 1 }, (_, index) => index + 1);
  }, [settings.maxNumber]);

  const startManual = () => {
    if (!validManualProblem) return;
    onStartProblem(createProblem(a, b, settings.maxNumber), "practice");
  };

  const startAutomatic = () => {
    onStartProblem(generateProblem(settings.maxNumber), "practice");
  };

  const startDemo = () => {
    onStartProblem(createProblem(3, 2, settings.maxNumber), "demo");
  };

  return (
    <details className="adult-panel" open={!hasActiveProblem}>
      <summary>Panel adulto</summary>
      <div className="adult-panel-content">
        <section aria-label="Elegir suma manual" className="manual-problem">
          <h2>Suma manual</h2>
          <div className="sum-picker">
            <label>
              Primer número
              <select value={a} onChange={(event) => setA(Number(event.target.value))} aria-label="Primer sumando">
                {Array.from({ length: settings.maxNumber }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <span className="operator" aria-hidden="true">
              +
            </span>
            <label>
              Saltos
              <select value={b} onChange={(event) => setB(Number(event.target.value))} aria-label="Segundo sumando">
                {bOptions.map((value) => (
                  <option key={value} value={value} disabled={a + value > settings.maxNumber}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!validManualProblem && <p className="soft-warning">El resultado debe llegar como máximo a 10.</p>}
          <div className="adult-actions">
            <button type="button" onClick={startManual} disabled={!validManualProblem} aria-label="Usar suma manual">
              Usar suma manual
            </button>
            <button type="button" onClick={startAutomatic} aria-label="Crear práctica automática">
              Práctica automática
            </button>
            <button type="button" onClick={startDemo} aria-label="Mostrar demostración de 3 más 2">
              Demostración 3 + 2
            </button>
          </div>
        </section>
        <SettingsPanel settings={settings} onChange={onSettingsChange} />
      </div>
    </details>
  );
}
