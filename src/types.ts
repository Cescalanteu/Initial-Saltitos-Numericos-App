export type Phase =
  | "SETUP"
  | "PRESENT_PROBLEM"
  | "SELECT_START"
  | "JUMPING"
  | "REVEAL_RESULT"
  | "PAUSE";

export type ScaffoldingLevel = "alto" | "medio" | "bajo" | "errorless_learning";

export type AttemptInputMode = "tap-node" | "jump-button" | "keyboard";
export type AppInputMode = "tap-node" | "jump-button" | "both";

export interface Problem {
  id: string;
  a: number;
  b: number;
  result: number;
  maxNumber: number;
  createdAt: string;
}

export interface AttemptLog {
  id: string;
  problemId: string;
  startedAt: string;
  completedAt?: string;
  selectedStartAttempts: number;
  jumpAttempts: number;
  hintsUsed: number;
  completed: boolean;
  inputMode: AttemptInputMode;
  scaffoldingLevel: ScaffoldingLevel;
  notes?: string;
  problem: string;
  durationMs?: number;
}

export interface AppSettings {
  language: "es";
  maxNumber: 10;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  calmMode: boolean;
  scaffoldingLevel: ScaffoldingLevel;
  problemsPerSession: number;
  inputMode: AppInputMode;
}

export interface ExerciseState {
  phase: Phase;
  problem: Problem | null;
  currentPosition: number | null;
  jumpsCompleted: number;
  jumpsRemaining: number;
  selectedStart: boolean;
  lastMessage: string;
}

export interface JumpSegment {
  from: number;
  to: number;
  index: number;
}
