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
    "start-race": {
      toState: "in-race",
      callbacks: ["lock-control-buttons"],
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
    "start-race": {
      toState: "in-race",
      callbacks: [],
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
    "move-car": {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    "start-race": {
      toState: "in-race",
      callbacks: [],
    },
  },
  broken: {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    finish: {
      toState: "finished",
      callbacks: [],
    },
    "start-car": {
      toState: "ready",
      callbacks: ["prepare-car"],
    },
    "start-race": {
      toState: "in-race",
      callbacks: [],
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
    "start-race": {
      toState: "in-race",
      callbacks: [],
    },
  },
  "in-race": {
    reset: {
      toState: "in-garage",
      callbacks: ["reset"],
    },
    broke: {
      toState: "in-race",
      callbacks: [],
    },
    finish: {
      toState: "in-garage",
      callbacks: [],
    },
    "start-car": {
      toState: "in-race",
      callbacks: [],
    },
    "start-race": {
      toState: "in-garage",
      callbacks: [],
    },
  },
};
export default CAR_STATES;
