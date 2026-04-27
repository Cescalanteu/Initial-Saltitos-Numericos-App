export function playSoftChime(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;

  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 660;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.addEventListener("ended", () => void context.close());
  } catch {
    // El sonido es apoyo opcional; si el navegador lo bloquea, la app sigue visual.
  }
}

const numberWordsEs: Record<number, string> = {
  1: "uno",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
  6: "seis",
  7: "siete",
  8: "ocho",
  9: "nueve",
  10: "diez"
};

export function speakNumber(enabled: boolean, number: number) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const text = numberWordsEs[number];
  if (!text) return;

  speakText(text);
}

export function speakSuccessEquation(enabled: boolean, a: number, b: number, result: number) {
  if (!enabled) return;

  const first = numberWordsEs[a];
  const second = numberWordsEs[b];
  const answer = numberWordsEs[result];
  if (!first || !second || !answer) return;

  speakText(`Bien, ${first} más ${second} es igual a ${answer}`);
}

function speakText(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.volume = 0.85;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
