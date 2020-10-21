import Swiper, { Navigation, EffectFade} from 'swiper';

const playButtonsFirst = document.querySelector('.main-slider__play');
const video = document.querySelector('video');

Swiper.use([Navigation, EffectFade]);
const swiperSlider2 = new Swiper('.main-slider', {
  loop: true,
  slidesPerView: 1,
  centeredSlides: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  fadeEffect: {
    crossFade: true
  },
  effect: 'fade',
  simulateTouch: false,
});

document.querySelector('.main-slider__play').addEventListener('click', function () {
  video.play();
});

// playButtonsFirst.forEach((el) => {
// 	el.addEventListener('click', (e) => {
// 		let video = e.currentTarget.closest('.main-slider__media').querySelector('video');
// 		video.play();
// 		e.currentTarget.style.display = 'none';
// 		setTimeout(() => {
// 			video.volume = 0.5;
// 		}, 1000);
// 	});
// });

// swiperSlider2.on('transitionEnd', function () {
// 	let videos = document.querySelectorAll('.preview__slider video');
// 	videos.forEach((el) => {
// 		el.pause();
// 		el.currentTime = 0;
// 	});
// 	playButtonsFirst.forEach((el) => {
// 		el.style.display = 'block';
// 	});
// });