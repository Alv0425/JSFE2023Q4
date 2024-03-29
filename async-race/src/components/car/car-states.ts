const CAR_STATES = {
  "in-garage": {
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
    finish: {
      toState: "in-garage",
      callbacks: [],
    },
    broke: {
      toState: "in-garage",
      callbacks: [],
    },
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    "move-car": {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
  ready: {
    "move-car": {
      toState: "moving",
      callbacks: ["move-car"],
    },
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
  },
  moving: {
    broke: {
      toState: "broken",
      callbacks: ["stop-car-animation"],
    },
    pause: {
      toState: "paused",
      callbacks: ["stop-car-animation"],
    },
    finish: {
      toState: "finished",
      callbacks: ["stop-car-animation"],
    },
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
  },
  broken: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
  },
  paused: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
  finished: {
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
};
export default CAR_STATES;
