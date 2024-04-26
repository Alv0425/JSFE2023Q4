const RACE_STATES = {
  "all-cars-in-garage": {
    "start-race": {
      toState: "cars-ready",
      callbacks: ["prepare-cars"],
    },
    "reset-race": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
    "race-finish": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
    "cars-prepared": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
  },
  "cars-ready": {
    "cars-prepared": {
      toState: "cars-moving",
      callbacks: ["on-engines"],
    },
    "start-race": {
      toState: "all-cars-in-garage",
      callbacks: ["restart-race"],
    },
    "reset-race": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
  },
  "cars-moving": {
    "race-finish": {
      toState: "cars-finished",
      callbacks: ["race-end"],
    },
    "start-race": {
      toState: "all-cars-in-garage",
      callbacks: ["restart-race"],
    },
    "reset-race": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
    "cars-prepared": {
      toState: "all-cars-in-garage",
      callbacks: ["restart-race"],
    },
  },
  "cars-finished": {
    "start-race": {
      toState: "all-cars-in-garage",
      callbacks: ["restart"],
    },
    "reset-race": {
      toState: "all-cars-in-garage",
      callbacks: ["reset"],
    },
  },
};

export default RACE_STATES;