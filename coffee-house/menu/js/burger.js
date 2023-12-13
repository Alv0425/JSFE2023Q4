"use strict";

/* Navigation menu */
export function initBurger() {
  const navigationBar = document.querySelector(".header__nav");
  const navButton = document.getElementById('burger-button');
  const body = document.querySelector('body');
  const navLinks = document.querySelectorAll('.header__navlink a');
  const menuButton = document.querySelector('.header__button-menu');

  function bodyLock() {
    body.classList.add("body-locked");
  }

  function bodyUnlock() {
    body.classList.remove("body-locked");
  }

  function handleCloseMenu() {
    navigationBar.classList.remove("header__nav-open");
    navButton.classList.remove("header__burger-button-active");
    bodyUnlock();
  }

  // const handleClickOutsideMunu = (event) => {
  //   if (navigationBarStatus == 1){
  //     if (!navigationBar.contains(event.target) && !navButton.contains(event.target)) {
  //         handleCloseMenu();
  //     }
  //   }
  // }

  navButton.addEventListener('click', () => {
      if (!navigationBar.classList.contains('header__nav-open')){  
          navigationBar.classList.add("header__nav-open");
          navButton.classList.add("header__burger-button-active");
          bodyLock();
      } else {
        handleCloseMenu();
      }
  });

  // document.addEventListener('touchend', handleClickOutsideMunu);
  // document.addEventListener('click', handleClickOutsideMunu);

  [...navLinks, menuButton].forEach((link) => {
      link.addEventListener("click", (event) => {
          event.preventDefault();
          handleCloseMenu();
          setTimeout(()=>{
            if (event.target.textContent !== "Contact us" && !menuButton.contains(event.target)) {
              body.classList.remove('fade-in');
              body.classList.add('fade-out');
            }
          },300);
          function waitAnimation() {
            if (!menuButton.contains(event.target)) {              
              window.location = event.target.href; 
            }
          }
          setTimeout(waitAnimation, 700);
      });
  });
}
