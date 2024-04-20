const VIEW_STATES = {
  "not-authorized": {
    load: {
      toState: "not-authorized",
      callbacks: ["redirect-to-login-page"],
    },
    "not-found": {
      toState: "not-authorized",
      callbacks: ["render-notfound-page"],
    },
    logout: {
      toState: "not-authorized",
      callbacks: [],
    },
    about: {
      toState: "not-authorized",
      callbacks: ["render-about-page"],
    },
    "access-login-page": {
      toState: "not-authorized",
      callbacks: ["render-login-page"],
    },
    "access-main-page": {
      toState: "not-authorized",
      callbacks: ["redirect-to-login-page"],
    },
    login: {
      toState: "authorized",
      callbacks: ["manage-reload-when-authohized"],
    },
  },
  authorized: {
    load: {
      toState: "authorized",
      callbacks: ["redirect-to-main-page"],
    },
    "not-found": {
      toState: "authorized",
      callbacks: ["render-notfound-page"],
    },
    logout: {
      toState: "not-authorized",
      callbacks: ["redirect-to-login-page"],
    },
    about: {
      toState: "authorized",
      callbacks: ["render-about-page"],
    },
    "access-login-page": {
      toState: "authorized",
      callbacks: ["redirect-to-main-page"],
    },
    "access-main-page": {
      toState: "authorized",
      callbacks: ["render-main-page"],
    },
  },
};

export default VIEW_STATES;
