import type { JumpSegment } from "../types";

interface NumberLineProps {
  maxNumber: number;
  currentPosition: number | null;
  selectedStart: boolean;
  hintNumber: number | null;
  expectedNext: number | null;
  jumps: JumpSegment[];
  reducedMotion: boolean;
  onSelectNumber: (number: number, inputMode: "tap-node" | "keyboard") => void;
}

function getPercent(value: number, maxNumber: number) {
  return ((value - 1) / (maxNumber - 1)) * 100;
}

export function NumberLine({
  maxNumber,
  currentPosition,
  selectedStart,
  hintNumber,
  expectedNext,
  jumps,
  reducedMotion,
  onSelectNumber
}: NumberLineProps) {
  const numbers = Array.from({ length: maxNumber }, (_, index) => index + 1);

  return (
    <section
      className="number-line-wrap"
      aria-label="Recta numérica del 1 al 10"
      role="group"
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <svg className="jump-layer" viewBox="0 0 1000 180" aria-hidden="true" focusable="false">
        {jumps.map((jump) => {
          const x1 = getPercent(jump.from, maxNumber) * 10;
          const x2 = getPercent(jump.to, maxNumber) * 10;
          const mid = (x1 + x2) / 2;
          const path = `M ${x1} 130 Q ${mid} 35 ${x2} 130`;
          return <path key={`${jump.from}-${jump.to}-${jump.index}`} className="jump-arc" d={path} />;
        })}
      </svg>
      <div className="number-track" aria-hidden="true" />
      {currentPosition !== null && (
        <div
          className={selectedStart ? "marker visible" : "marker"}
          style={{ left: `${getPercent(currentPosition, maxNumber)}%` }}
          aria-hidden="true"
        >
          <span>rana</span>
        </div>
      )}
      <div className="number-nodes">
        {numbers.map((value) => {
          const isHint = hintNumber === value;
          const isCurrent = currentPosition === value;
          const isExpectedNext = expectedNext === value;
          const accessibleHint = isExpectedNext ? ", siguiente salto" : isHint ? ", número señalado" : "";
          return (
            <button
              key={value}
              type="button"
              className={[
                "number-node",
                isCurrent ? "current" : "",
                isHint ? "hinted" : "",
                isExpectedNext ? "expected" : ""
              ].join(" ")}
              aria-label={`Número ${value}${accessibleHint}`}
              data-hint={isHint || isExpectedNext ? "true" : "false"}
              onClick={() => onSelectNumber(value, "tap-node")}
            >
              <span className="node-number">{value}</span>
              {(isHint || isExpectedNext) && <span className="node-cue">toca</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
