const ROUTES = new Map([
  [
    "/",
    () => {
      window.location.href = "#/garage";
    },
  ],
  [
    "/garage",
    () => {
      console.log("render-garage");
    },
  ],
  [
    "/winners",
    () => {
      console.log("render-winners");
    },
  ],
]);

export default ROUTES;
