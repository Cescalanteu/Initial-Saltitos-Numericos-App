import { useEffect, useMemo, useState } from "react";
import { AACBar } from "./components/AACBar";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { NumberLine } from "./components/NumberLine";
import { ParentSetup } from "./components/ParentSetup";
import { PauseScreen } from "./components/PauseScreen";
import { ProblemCard } from "./components/ProblemCard";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { ResultScreen } from "./components/ResultScreen";
import { StartScreen } from "./components/StartScreen";
import {
  advanceJump,
  createExerciseState,
  generateProblem,
  selectStart,
  validateJump,
  validateStartSelection
} from "./domain/problems";
import { t } from "./i18n";
import { playSoftChime, speakNumber, speakSuccessEquation } from "./sound";
import {
  appendAttemptLog,
  defaultSettings,
  loadAttemptLogs,
  loadSettings,
  saveSettings
} from "./storage/progress";
import type { AppSettings, AttemptInputMode, AttemptLog, ExerciseState, JumpSegment, Phase, Problem } from "./types";

const emptyExercise: ExerciseState = {
  phase: "SETUP",
  problem: null,
  currentPosition: null,
  jumpsCompleted: 0,
  jumpsRemaining: 0,
  selectedStart: false,
  lastMessage: "Elige una suma"
};

function makeAttempt(problem: Problem, settings: AppSettings, inputMode: AttemptInputMode): AttemptLog {
  return {
    id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    problemId: problem.id,
    startedAt: new Date().toISOString(),
    selectedStartAttempts: 0,
    jumpAttempts: 0,
    hintsUsed: 0,
    completed: false,
    inputMode,
    scaffoldingLevel: settings.scaffoldingLevel,
    problem: `${problem.a} + ${problem.b}`
  };
}

function shouldShowImmediateHint(settings: AppSettings) {
  return settings.scaffoldingLevel === "alto" || settings.scaffoldingLevel === "errorless_learning";
}

function getExpectedNext(exercise: ExerciseState) {
  if (!exercise.problem || exercise.phase !== "JUMPING" || exercise.currentPosition === null) return null;
  const next = exercise.currentPosition + 1;
  return next <= exercise.problem.maxNumber ? next : null;
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      return loadSettings();
    } catch {
      return defaultSettings;
    }
  });
  const [logs, setLogs] = useState<AttemptLog[]>(() => {
    try {
      return loadAttemptLogs();
    } catch {
      return [];
    }
  });
  const [exercise, setExercise] = useState<ExerciseState>(emptyExercise);
  const [attempt, setAttempt] = useState<AttemptLog | null>(null);
  const [hintNumber, setHintNumber] = useState<number | null>(null);
  const [previousPhase, setPreviousPhase] = useState<Phase>("SETUP");
  const [confirmDone, setConfirmDone] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [autoAdvanceEnabled] = useState(true);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const expectedNext = getExpectedNext(exercise);

  const jumps = useMemo<JumpSegment[]>(() => {
    if (!exercise.problem) return [];
    return Array.from({ length: exercise.jumpsCompleted }, (_, index) => ({
      from: exercise.problem!.a + index,
      to: exercise.problem!.a + index + 1,
      index: index + 1
    }));
  }, [exercise.jumpsCompleted, exercise.problem]);

  const updateAttempt = (updater: (current: AttemptLog) => AttemptLog) => {
    setAttempt((current) => (current ? updater(current) : current));
  };

  const finishAttempt = (completed: boolean, notes?: string) => {
    if (!attempt) return;
    const completedAt = new Date().toISOString();
    const durationMs = new Date(completedAt).getTime() - new Date(attempt.startedAt).getTime();
    const finished: AttemptLog = {
      ...attempt,
      completed,
      notes,
      completedAt,
      durationMs
    };
    setLogs(appendAttemptLog(finished));
    setAttempt(null);
  };

  const finishAttemptFrom = (sourceAttempt: AttemptLog, completed: boolean, notes?: string) => {
    const completedAt = new Date().toISOString();
    const durationMs = new Date(completedAt).getTime() - new Date(sourceAttempt.startedAt).getTime();
    const finished: AttemptLog = {
      ...sourceAttempt,
      completed,
      notes,
      completedAt,
      durationMs
    };
    setLogs(appendAttemptLog(finished));
  };

  const startProblem = (problem: Problem, mode: "practice" | "demo" = "practice") => {
    const nextState = createExerciseState(problem);
    setExercise(nextState);
    setAttempt(mode === "practice" ? makeAttempt(problem, settings, "tap-node") : null);
    setHintNumber(shouldShowImmediateHint(settings) ? problem.a : null);
    setConfirmDone(false);
    setDemoActive(mode === "demo");
  };

  const repeatProblem = () => {
    if (!exercise.problem) return;
    startProblem(exercise.problem, demoActive ? "demo" : "practice");
  };

  const startAutomatic = () => {
    startProblem(generateProblem(settings.maxNumber), "practice");
  };

  const handleSettingsChange = (nextSettings: AppSettings) => {
    setSettings(nextSettings);
    if (nextSettings.highContrast !== settings.highContrast) {
      document.documentElement.dataset.contrast = nextSettings.highContrast ? "high" : "default";
    }
  };

  const completeIfNeeded = (nextState: ExerciseState, nextAttempt: AttemptLog | null) => {
    if (nextState.phase === "REVEAL_RESULT") {
      if (nextState.problem) {
        speakSuccessEquation(
          settings.soundEnabled,
          nextState.problem.a,
          nextState.problem.b,
          nextState.problem.result
        );
      } else {
        playSoftChime(settings.soundEnabled);
      }
      if (nextAttempt) {
        finishAttemptFrom(nextAttempt, true);
        setAttempt(null);
      }
      setDemoActive(false);
    }
  };

  const handleNumberSelect = (selectedNumber: number, inputMode: AttemptInputMode) => {
    if (!exercise.problem || exercise.phase === "PAUSE" || exercise.phase === "REVEAL_RESULT") return;

    if (exercise.phase === "SELECT_START") {
      updateAttempt((current) => ({
        ...current,
        inputMode,
        selectedStartAttempts: current.selectedStartAttempts + 1
      }));

      if (!validateStartSelection(exercise.problem, selectedNumber)) {
        setExercise({
          ...exercise,
          lastMessage: "Busca este número"
        });
        setHintNumber(exercise.problem.a);
        return;
      }

      const nextState = selectStart(exercise, selectedNumber);
      setExercise(nextState);
      setHintNumber(shouldShowImmediateHint(settings) ? selectedNumber + 1 : null);
      speakNumber(settings.soundEnabled, selectedNumber);
      return;
    }

    if (exercise.phase === "JUMPING" && exercise.currentPosition !== null) {
      const countedAttempt = attempt
        ? {
            ...attempt,
            inputMode,
            jumpAttempts: attempt.jumpAttempts + 1
          }
        : null;
      setAttempt(countedAttempt);

      if (!validateJump(exercise.currentPosition, selectedNumber, exercise.problem.maxNumber)) {
        setExercise({
          ...exercise,
          lastMessage: t("one_step_right")
        });
        setHintNumber(exercise.currentPosition + 1);
        return;
      }

      const nextState = advanceJump(exercise, selectedNumber);
      setExercise(nextState);
      setHintNumber(
        shouldShowImmediateHint(settings) && nextState.phase === "JUMPING" && nextState.currentPosition !== null
          ? nextState.currentPosition + 1
          : null
      );
      playSoftChime(settings.soundEnabled);
      completeIfNeeded(nextState, countedAttempt);
    }
  };

  const showHint = () => {
    if (!exercise.problem) return;
    updateAttempt((current) => ({ ...current, hintsUsed: current.hintsUsed + 1 }));
    if (exercise.phase === "SELECT_START") {
      setHintNumber(exercise.problem.a);
      setExercise({ ...exercise, lastMessage: `Busca el ${exercise.problem.a}` });
      return;
    }
    if (exercise.phase === "JUMPING" && exercise.currentPosition !== null) {
      setHintNumber(exercise.currentPosition + 1);
      setExercise({ ...exercise, lastMessage: t("one_step_right") });
    }
  };

  const pause = () => {
    if (exercise.phase === "PAUSE") return;
    setPreviousPhase(exercise.phase);
    setExercise({ ...exercise, phase: "PAUSE", lastMessage: t("pause") });
  };

  const resume = () => {
    setExercise({ ...exercise, phase: previousPhase });
  };

  const endSession = () => {
    if (exercise.problem && attempt) {
      finishAttempt(false, "Sesion terminada por usuario");
    }
    setExercise(emptyExercise);
    setHintNumber(null);
    setConfirmDone(false);
    setDemoActive(false);
  };

  useEffect(() => {
    if (!demoActive || !exercise.problem) return;

    const delay = settings.reducedMotion ? 350 : 900;
    const timer = window.setTimeout(() => {
      if (exercise.phase === "SELECT_START") {
        handleNumberSelect(exercise.problem!.a, "tap-node");
      } else if (exercise.phase === "JUMPING" && exercise.currentPosition !== null) {
        handleNumberSelect(exercise.currentPosition + 1, "tap-node");
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [demoActive, exercise, settings.reducedMotion]);

  useEffect(() => {
    if (!autoAdvanceEnabled || demoActive || confirmDone || exercise.phase !== "REVEAL_RESULT") return;

    const delay = 10000;
    const timer = window.setTimeout(() => {
      startAutomatic();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [autoAdvanceEnabled, confirmDone, demoActive, exercise.phase, settings.reducedMotion]);

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  const appClassName = [
    "app",
    settings.highContrast ? "high-contrast" : "",
    settings.calmMode ? "calm-mode" : "",
    settings.reducedMotion || !settings.animationsEnabled ? "reduced-motion" : ""
  ].join(" ");

  return (
    <main className={appClassName} data-motion={settings.reducedMotion ? "reduced" : "normal"}>
      <ParentSetup
        settings={settings}
        hasActiveProblem={exercise.problem !== null}
        onSettingsChange={handleSettingsChange}
        onStartProblem={startProblem}
      />

      <section className="practice-layout" aria-label="Área de práctica">
        {confirmDone ? (
          <section className="confirm-card" aria-label="Confirmar terminar">
            <h2>¿Terminamos?</h2>
            <div className="result-actions">
              <button type="button" onClick={endSession} aria-label="Sí terminar">
                Sí
              </button>
              <button type="button" onClick={() => setConfirmDone(false)} aria-label="No continuar">
                No
              </button>
            </div>
          </section>
        ) : exercise.phase === "PAUSE" ? (
          <PauseScreen onResume={resume} onRepeat={repeatProblem} onFinish={endSession} />
        ) : (
          <>
            <ProblemCard exercise={exercise} demoActive={demoActive} />
            {exercise.problem ? (
              <>
                <NumberLine
                  maxNumber={exercise.problem.maxNumber}
                  currentPosition={exercise.currentPosition}
                  selectedStart={exercise.selectedStart}
                  hintNumber={hintNumber}
                  expectedNext={expectedNext}
                  jumps={jumps}
                  reducedMotion={settings.reducedMotion || !settings.animationsEnabled}
                  onSelectNumber={handleNumberSelect}
                />
                <FeedbackPanel
                  message={exercise.lastMessage}
                  hintText={hintNumber ? `Número señalado: ${hintNumber}` : undefined}
                />
                {settings.inputMode !== "tap-node" && exercise.phase === "JUMPING" && expectedNext !== null && (
                  <button
                    className="jump-button"
                    type="button"
                    onClick={() => handleNumberSelect(expectedNext, "jump-button")}
                    aria-label="Dar un saltito a la derecha"
                  >
                    Un saltito
                  </button>
                )}
                {exercise.phase === "REVEAL_RESULT" && (
                  <>
                    <p className="auto-next-note" aria-live="polite">
                      Nuevo ejercicio en unos segundos
                    </p>
                    <ResultScreen
                      problem={exercise.problem}
                      onRepeat={repeatProblem}
                      onNew={startAutomatic}
                      onDone={() => setConfirmDone(true)}
                    />
                  </>
                )}
              </>
            ) : (
              <section className="empty-practice" aria-label="Inicio de práctica">
                <p>Selecciona una suma en el panel adulto.</p>
              </section>
            )}
          </>
        )}
      </section>

      <details className="progress-shell">
        <summary>Progreso</summary>
        <ProgressDashboard logs={logs} />
      </details>

      {exercise.problem && !confirmDone && (
        <AACBar
          onHelp={showHint}
          onPause={pause}
          onRepeat={repeatProblem}
          onDone={() => setConfirmDone(true)}
          onYes={() => setConfirmDone(true)}
          onNo={() => setConfirmDone(false)}
        />
      )}
    </main>
  );
}
