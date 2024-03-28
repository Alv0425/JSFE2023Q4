const CAR_STATES = {
  "in-garage": {
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
  },
  ready: {
    "move-car": {
      toState: "moving",
      callbacks: ["move-car"],
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
  },
  broken: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
  paused: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
  finished: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
  },
};
export default CAR_STATES;
