import { useEffect, useRef, useState } from "react";
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
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef(new Map<number, HTMLButtonElement>());
  const [anchors, setAnchors] = useState<Record<number, { x: number; top: number }>>({});
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const nextAnchors: Record<number, { x: number; top: number }> = {};

      for (const value of numbers) {
        const node = nodeRefs.current.get(value);
        if (!node) continue;

        const nodeRect = node.getBoundingClientRect();
        nextAnchors[value] = {
          x: nodeRect.left - stageRect.left + nodeRect.width / 2,
          top: nodeRect.top - stageRect.top
        };
      }

      setAnchors(nextAnchors);
      setStageSize({ width: stageRect.width, height: stageRect.height });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [maxNumber]);

  const hasMeasuredLayout = stageSize.width > 0 && Object.keys(anchors).length === maxNumber;

  return (
    <section
      className="number-line-wrap"
      aria-label="Recta numérica del 1 al 10"
      role="group"
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div className="line-stage" ref={stageRef}>
        <svg
          className="jump-layer"
          width={stageSize.width}
          height={stageSize.height}
          viewBox={`0 0 ${stageSize.width || 1} ${stageSize.height || 1}`}
          aria-hidden="true"
          focusable="false"
        >
          {hasMeasuredLayout &&
            jumps.map((jump) => {
              const from = anchors[jump.from];
              const to = anchors[jump.to];
              if (!from || !to) return null;

              const y = Math.min(from.top, to.top) - 14;
              const arcHeight = 64;
              const path = `M ${from.x} ${y} C ${from.x + 18} ${y - arcHeight}, ${to.x - 18} ${
                y - arcHeight
              }, ${to.x} ${y}`;

              return (
                <g key={`${jump.from}-${jump.to}-${jump.index}`} className="jump-segment">
                  <path className="jump-arc-base" d={path} />
                  <path className="jump-arc" d={path} />
                </g>
              );
            })}
        </svg>
        <div className="number-track" aria-hidden="true" />
        <div className="number-nodes">
          {numbers.map((value) => {
            const isHint = hintNumber === value;
            const isCurrent = currentPosition === value;
            const isExpectedNext = expectedNext === value;
            const accessibleHint = isExpectedNext ? ", siguiente salto" : isHint ? ", número señalado" : "";
            return (
              <button
                key={value}
                ref={(node) => {
                  if (node) {
                    nodeRefs.current.set(value, node);
                  } else {
                    nodeRefs.current.delete(value);
                  }
                }}
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
                {selectedStart && isCurrent && (
                  <span className="marker" aria-hidden="true">
                    <span className="worm-antenna worm-antenna-left" />
                    <span className="worm-antenna worm-antenna-right" />
                    <span className="worm-eye worm-eye-left" />
                    <span className="worm-eye worm-eye-right" />
                    <span className="worm-nose" />
                    <span className="worm-smile" />
                    <span className="marker-label">gusano</span>
                  </span>
                )}
                <span className="node-number">{value}</span>
                {(isHint || isExpectedNext) && <span className="node-cue">toca</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
