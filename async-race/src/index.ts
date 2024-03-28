import raceManager from "./components/race-engine/race-manager";
import createCar from "./services/api/create-car";
import ENDPOINTS from "./services/api/endpoints";

createCar();
(async () => {
  const res = await fetch(ENDPOINTS.GARAGE);
  const garage = await res.json();
  console.log(garage);
})();

const button: HTMLButtonElement = document.createElement("button");
button.classList.add("start");
button.innerText = "START";
document.body.append(button);

button.onclick = async () => {
  raceManager.emit("start-race");
};
