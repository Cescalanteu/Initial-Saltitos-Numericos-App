import type { AppSettings, AttemptLog } from "../types";

const SETTINGS_KEY = "saltitos.settings.v1";
const LOGS_KEY = "saltitos.progress.v1";

export const defaultSettings: AppSettings = {
  language: "es",
  maxNumber: 10,
  soundEnabled: false,
  animationsEnabled: true,
  reducedMotion: false,
  highContrast: false,
  calmMode: true,
  scaffoldingLevel: "alto",
  problemsPerSession: 5,
  inputMode: "both"
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSettings(): AppSettings {
  return { ...defaultSettings, ...readJson<Partial<AppSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: AppSettings) {
  writeJson(SETTINGS_KEY, settings);
}

export function loadAttemptLogs(): AttemptLog[] {
  return readJson<AttemptLog[]>(LOGS_KEY, []);
}

export function saveAttemptLogs(logs: AttemptLog[]) {
  writeJson(LOGS_KEY, logs);
}

export function appendAttemptLog(log: AttemptLog) {
  const logs = loadAttemptLogs();
  const nextLogs = [log, ...logs].slice(0, 200);
  saveAttemptLogs(nextLogs);
  return nextLogs;
}

export function toProgressCsv(logs: AttemptLog[]) {
  const headers = [
    "fecha",
    "problema",
    "completado",
    "intentos_inicio",
    "intentos_salto",
    "ayudas",
    "tiempo_segundos",
    "nivel_ayuda",
    "modo_input",
    "notas"
  ];

  const rows = logs.map((log) => [
    log.completedAt ?? log.startedAt,
    log.problem,
    log.completed ? "si" : "no",
    String(log.selectedStartAttempts),
    String(log.jumpAttempts),
    String(log.hintsUsed),
    log.durationMs ? String(Math.round(log.durationMs / 1000)) : "",
    log.scaffoldingLevel,
    log.inputMode,
    log.notes ?? ""
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function downloadTextFile(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
