import main from "../../ui/main/main";

const ROUTES: Map<string, () => void> = new Map([
  [
    "/",
    (): void => {
      window.location.href = "#/garage";
    },
  ],
  [
    "/garage",
    (): void => {
      main.drawGarage();
    },
  ],
  [
    "/winners",
    (): void => {
      main.drawWinners();
    },
  ],
]);

export default ROUTES;
