import main from "../../ui/main/main";

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
      main.drawGarage();
    },
  ],
  [
    "/winners",
    () => {
      main.drawWinners();
    },
  ],
]);

export default ROUTES;
