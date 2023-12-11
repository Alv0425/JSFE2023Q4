export function initSlider() {
  let currentStatus = 1;
  let previousStatus = 3;
  let currentBar;
  let fillState = 0;
  let timer = setInterval(() => {}, 100);
  const slider = document.querySelector(".slider");
  const sliderButtonLeft = document.getElementById('button-left');
  const sliderButtonRight = document.getElementById('button-right');
  const imagesLine = document.querySelector('.slider__items-container');
  let isClicked = false;

  const resetDelay = (sliderButton) => {
    isClicked = true;
    sliderButton.disabled = true;
    setTimeout(() => { isClicked = false; sliderButton.disabled = false; }, 400);
  }

  function nextSlide() {
    if (!isClicked){
      previousStatus = currentStatus;
      let nextSlide = currentStatus < 3 ? currentStatus + 1 : 1;
      currentStatus = nextSlide;
      slider.classList.remove(`slide-${previousStatus}`);
      setSliderState();
      resetDelay(sliderButtonRight);
    }
  }
  function prevSlide() {
    if (!isClicked){
      previousStatus = currentStatus;
      currentStatus = currentStatus > 1 ? currentStatus - 1 : 3;
      slider.classList.remove(`slide-${previousStatus}`);
      setSliderState();
      resetDelay(sliderButtonLeft);
    }  
  }

  sliderButtonLeft.onclick = () => { prevSlide(); }
  sliderButtonRight.onclick = () => { nextSlide(); }
  
  function setSliderState(){
      const sliderBars = document.querySelectorAll('.slider__pagination-progress');
      slider.classList.add(`slide-${currentStatus}`);
      setTimeout(()=>{
          sliderBars.forEach(bar => {
            bar.className = 'slider__pagination-progress';
            bar.style.width = 0;
          });  
          clearInterval(timer);
          fillState = 0;
          let curBar = sliderBars[currentStatus - 1];  
          let modBar = curBar.cloneNode(true);
          modBar.classList.add('slider__pagination-progress-selected');
          modBar.addEventListener('animationend', () => { nextSlide(); },{ passive: true, capture: false, once: true });    
          currentBar = modBar;
          modBar.addEventListener('animationstart', () => { 
            let animDuration = window.getComputedStyle(modBar, null).getPropertyValue("animation-duration");
            let interval = 100;
            if (animDuration.endsWith('ms')) { animDuration = animDuration.replace('ms','') * 1; }
            else if (animDuration.endsWith('s')) { animDuration = animDuration.replace('s','') * 1000; }
            interval = Math.round(animDuration * 2 / 100);
            timer = setInterval(() => {
              if (window.getComputedStyle(modBar, null).getPropertyValue("animation-play-state") == "running") {
                  fillState += 2;
                  currentBar.style.width = `${fillState}%`
              }
            }, interval);
           }); 
          curBar.replaceWith(modBar);
      },10);
  }

  //Handle touches events
  let touchstart = 0;
  let touchend = 0;
  
  slider.addEventListener('touchstart', (event) => {
    currentBar.classList.add('paused');
    touchstart = event.changedTouches[0].screenX;
  }, false);
  
  slider.addEventListener('touchmove', (event) => {
      let currentPosition = window.getComputedStyle(imagesLine, null).getPropertyValue("transform");
      let xPosition = Number(currentPosition.replace(/^matrix\(1, 0, 0, 1,/, '').replace(/, 0\)$/, ''));
      imagesLine.style.transform = `translateX(${xPosition - touchstart + event.changedTouches[0].screenX}px)`;
  }, false);
  
  slider.addEventListener('touchend', (event) => {
    imagesLine.style.removeProperty('transform');
    currentBar.classList.remove('paused');
    touchend = event.changedTouches[0].screenX;
    touchesType();
  }, false); 
  
  function touchesType() {
    if (touchstart - touchend > 70) { nextSlide(); }  
    if (touchend - touchstart > 70) { prevSlide(); }
  }

  setSliderState();
}

