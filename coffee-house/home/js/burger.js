"use strict";

/* Navigation menu */
export function initBurger() {
  const navigationBar = document.querySelector(".header__nav");
  const navButton = document.getElementById('burger-button');
  const body = document.querySelector('body');
  const navLinks = document.querySelectorAll('.header__navlink a');
  const menuButton = document.querySelector('.header__button-menu');
  let navigationBarStatus = 0;

  function bodyLock() {
    body.classList.add("body-locked");
  }

  function bodyUnlock() {
    body.classList.remove("body-locked");
  }

  const handleCloseMenu = () => {
    navigationBar.classList.remove("header__nav-open");
    navButton.classList.remove("header__burger-button-active");
    bodyUnlock();
    navigationBarStatus = 0;
  }

  const handleClickOutsideMunu = (event) => {
    if (navigationBarStatus == 1){
      if (!navigationBar.contains(event.target) && !navButton.contains(event.target)) {
          handleCloseMenu();
      }
    }
  }

  navButton.addEventListener('click', () => {
      if (navigationBarStatus == 0){  
          navigationBar.classList.add("header__nav-open");
          navButton.classList.add("header__burger-button-active");
          bodyLock();
          navigationBarStatus = 1;
      } else {
        handleCloseMenu();
      }
  });

  document.addEventListener('touchend', handleClickOutsideMunu);
  document.addEventListener('click', handleClickOutsideMunu);

  [...navLinks, menuButton].forEach((link) => {
      link.addEventListener("click", (event) => {
          event.preventDefault();
          handleCloseMenu();
          setTimeout(()=>{
            if (menuButton.contains(event.target)) {
              body.classList.remove("fade-in");
              body.classList.add("fade-out");
            }
          },300);
          function waitAnimation() {
            window.location = link.href;  
          }
          setTimeout(waitAnimation, 600);
      });
  });
}
