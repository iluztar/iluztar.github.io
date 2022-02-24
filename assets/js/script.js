// Design by Catalin V. (@hiskio https://twitter.com/hiskio) 
// https://dribbble.com/shots/3408986-Info-Card-Daily-UI-045

const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
let inProgress = false;

const goToSlide = (slideElements, index) => {
  if (!inProgress) {
    inProgress = true;

    $('.active').addClass('exit');
    $('.active').removeClass('active');
    slideElements.forEach(elem => {
      $(`${elem}:nth-child(${index})`).addClass('active');
    });

    const evenSlide = index % 2 === 0;
    if (evenSlide)
    $('.content__ping').addClass('content__ping--right');else

    $('.content__ping').removeClass('content__ping--right');
    $('.content__ping--noanimation').removeClass('content__ping--noanimation');

    setTimeout(() => $('.exit').removeClass('exit'), 1000);
    setTimeout(() => inProgress = false, 2000);
  }
};

$('.content__slide:nth-child(1) .button').on('click', () => goToSlide(slideElements, 2));
$('.content__slide:nth-child(2) .button').on('click', () => goToSlide(slideElements, 1));

setTimeout(() => goToSlide(slideElements, 2), 2000);
setTimeout(() => goToSlide(slideElements, 1), 6000);

// let amount = 0;

// let slide = 0;

// const progress = () => {
//   amount++
//   $('.active .progress').css('transform', `scaleX(${amount/400})`)
//   if (amount >= 400){
//     amount = 0;
//     $('.active .progress').css('transform', `scaleX(${amount/400})`)
//     slide = (slide + 1) % 2 ;
//     goToSlide(slideElements, slide + 1);
//     clearInterval(progressInterval);
//     setTimeout(()=>{ 
//       progressInterval = setInterval(progress,20); 
//       $('.back__slide:not(.active) .progress').css('transform', 'scaleX(0)')
//     }, 2000);
//   }
// }

// let progressInterval = setInterval(progress,20);

/**
   * Type effect
   */

 const typedTextSpan = document.querySelector(".typed-text");
 const cursorSpan = document.querySelector(".cursor");
 
 const textArray = ["Illustrator", "Designer", "Developer", "Freelancer", "Student"];

 const typingDelay = 100;
 const erasingDelay = 100;
 const newTextDelay = 1000; // Delay between current and next text
 let textArrayIndex = 0;
 let charIndex = 0;
 
 function type() {
   if (charIndex < textArray[textArrayIndex].length) {
     if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
     typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
     charIndex++;
     setTimeout(type, typingDelay);
   } 
   else {
     cursorSpan.classList.remove("typing");
     setTimeout(erase, newTextDelay);
   }
 }
 
 function erase() {
   if (charIndex > 0) {
     if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
     typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
     charIndex--;
     setTimeout(erase, erasingDelay);
   } 
   else {
     cursorSpan.classList.remove("typing");
     textArrayIndex++;
     if(textArrayIndex>=textArray.length) textArrayIndex=0;
     setTimeout(type, typingDelay + 1100);
   }
 }
 
 document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
   if(textArray.length) setTimeout(type, newTextDelay + 250);
 });
 