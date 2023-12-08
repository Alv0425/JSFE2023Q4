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
  
  function nextSlide() {
      previousStatus = currentStatus;
      let nextSlide = currentStatus < 3 ? currentStatus + 1 : 1;
      currentStatus = nextSlide;
      slider.classList.remove(`slide-${previousStatus}`);
      setSliderState();
  }
  function prevSlide() {
      previousStatus = currentStatus;
      currentStatus = currentStatus > 1 ? currentStatus - 1 : 3;
      slider.classList.remove(`slide-${previousStatus}`);
      setSliderState();
  }
  
  sliderButtonLeft.onclick = () => { prevSlide(); }
  sliderButtonRight.onclick = () => { nextSlide(); }
  
  function setSliderState(){
      const sliderBars = document.querySelectorAll('.slider__pagination-progress');
      slider.classList.add(`slide-${currentStatus}`);
      sliderBars.forEach(bar => {
          bar.className = 'slider__pagination-progress';
      });   
      // sliderBars[previousStatus - 1].style.width = `${fillState}%`;
      setTimeout(() => {
          sliderBars[previousStatus - 1].style.width = 0;
      }, 5);
      setTimeout(()=>{
          clearInterval(timer);
          fillState = 0;
          let curBar = sliderBars[currentStatus - 1];  
          let modBar = curBar.cloneNode(true);
          modBar.classList.add('slider__pagination-progress-selected');
          modBar.addEventListener('animationend', () => {nextSlide(); console.log('animation');},{
              passive: true,
              capture: false,
              once: true
          });    
          currentBar = modBar;
          timer = setInterval(() => {
            if (window.getComputedStyle(modBar, null).getPropertyValue("animation-play-state") == "running") {
                fillState += 10;
                currentBar.style.width = `${fillState}%`
            }
          }, 500);
          curBar.replaceWith(modBar);
      },10);
  }
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
    setTimeout(()=>{
      touchesType();
    },150);
  }, false); 
  
  function touchesType() {
    if (touchstart - touchend > 70) { nextSlide(); }  
    if (touchend - touchstart > 70) { prevSlide(); }
  }

  setSliderState();
}

