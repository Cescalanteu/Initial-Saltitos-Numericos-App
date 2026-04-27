const messages = {
  select_start: "Busca el {a}",
  start_selected: "Empezamos en {a}",
  make_jumps: "Da {b} saltitos",
  one_step_right: "Un saltito a la derecha",
  jumps_remaining: "Faltan {n}",
  arrived: "Llegaste al {result}",
  equation: "{a} + {b} = {result}",
  try_again_calm: "Probemos otra vez",
  pause: "Pausa",
  help: "Ayuda",
  done: "Terminé"
} as const;

type MessageKey = keyof typeof messages;
type Vars = Record<string, string | number>;

export function t(key: MessageKey, vars: Vars = {}): string {
  let text: string = messages[key];

  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }

  return text;
}
