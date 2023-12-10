import { initBurger } from "./burger.js"
import { initSlider } from "./slider.js";

window.onload = () => {
 initBurger();
 initSlider();

 const menuButton = document.querySelector(".menu-button");
 const body = document.querySelector('body');
 menuButton.onclick = (e) => {
  e.preventDefault();
  body.classList.remove('fade-in');
  body.classList.add('fade-out');
  setTimeout(() => {
    window.location = menuButton.href;
  }, 700);
 }
}