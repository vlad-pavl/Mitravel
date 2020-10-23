import Swiper, { Navigation, EffectFade} from 'swiper';

const playButtonsFirst = document.querySelector('.main-slider__play');
const video = document.querySelector('video');

Swiper.use([Navigation, EffectFade]);
const swiperSlider2 = new Swiper('.main-slider__container', {
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