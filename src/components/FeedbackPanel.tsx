interface FeedbackPanelProps {
  message: string;
  hintText?: string;
}

export function FeedbackPanel({ message, hintText }: FeedbackPanelProps) {
  return (
    <section className="feedback-panel" aria-live="polite" aria-label="Mensaje de apoyo">
      <p>{message}</p>
      {hintText && <span className="hint-pill">{hintText}</span>}
    </section>
  );
}
