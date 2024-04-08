const LABELS = {
  garage: "in garage",
  move: "moving",
  broken: "broken",
  finished: "finished",
  winner: "winner",
  error: "Too many requests. Please, reset car and try again.",
} as const;

export type LabelType = typeof LABELS;

export default LABELS;
