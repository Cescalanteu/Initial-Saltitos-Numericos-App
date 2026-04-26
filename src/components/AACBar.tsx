interface AACBarProps {
  onHelp: () => void;
  onPause: () => void;
  onRepeat: () => void;
  onDone: () => void;
  onYes: () => void;
  onNo: () => void;
}

const buttons = [
  { key: "help", label: "Ayuda", icon: "?", action: "onHelp" },
  { key: "pause", label: "Pausa", icon: "II", action: "onPause" },
  { key: "repeat", label: "Otra vez", icon: "↺", action: "onRepeat" },
  { key: "done", label: "Terminé", icon: "✓", action: "onDone" },
  { key: "yes", label: "Sí", icon: "+", action: "onYes" },
  { key: "no", label: "No", icon: "-", action: "onNo" }
] as const;

export function AACBar({ onHelp, onPause, onRepeat, onDone, onYes, onNo }: AACBarProps) {
  const handlers = { onHelp, onPause, onRepeat, onDone, onYes, onNo };

  return (
    <nav className="aac-bar" aria-label="Comunicación rápida">
      {buttons.map((button) => (
        <button
          key={button.key}
          type="button"
          className="aac-button"
          onClick={handlers[button.action]}
          aria-label={button.label}
        >
          <span aria-hidden="true" className="aac-icon">
            {button.icon}
          </span>
          <span>{button.label}</span>
        </button>
      ))}
    </nav>
  );
}
