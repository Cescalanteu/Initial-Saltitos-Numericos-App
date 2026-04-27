import type { AppSettings, ScaffoldingLevel } from "../types";

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

const scaffoldingLevels: Array<{ value: ScaffoldingLevel; label: string }> = [
  { value: "alto", label: "Ayuda alta" },
  { value: "medio", label: "Ayuda media" },
  { value: "bajo", label: "Ayuda baja" },
  { value: "errorless_learning", label: "Guía fuerte" }
];

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <section className="settings-panel" aria-label="Configuración sensorial">
      <h2>Configuración</h2>
      <div className="setting-grid">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(event) => update("soundEnabled", event.target.checked)}
          />
          Voz y sonido suave
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={(event) => update("animationsEnabled", event.target.checked)}
          />
          Animaciones
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(event) => update("reducedMotion", event.target.checked)}
          />
          Reducir movimiento
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(event) => update("highContrast", event.target.checked)}
          />
          Alto contraste
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={settings.calmMode}
            onChange={(event) => update("calmMode", event.target.checked)}
          />
          Modo calmado
        </label>
      </div>

      <label className="field-row">
        Nivel de ayuda
        <select
          value={settings.scaffoldingLevel}
          onChange={(event) => update("scaffoldingLevel", event.target.value as ScaffoldingLevel)}
          aria-label="Nivel de ayuda visual"
        >
          {scaffoldingLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field-row">
        Entrada
        <select
          value={settings.inputMode}
          onChange={(event) => update("inputMode", event.target.value as AppSettings["inputMode"])}
          aria-label="Modo de entrada"
        >
          <option value="both">Tocar números y botón</option>
          <option value="tap-node">Tocar números</option>
          <option value="jump-button">Botón de salto</option>
        </select>
      </label>
    </section>
  );
}
