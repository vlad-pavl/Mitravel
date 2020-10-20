import Swiper, { Navigation, EffectFade} from 'swiper'
Swiper.use([Navigation, EffectFade]);

const swiper2 = new Swiper('.main-slider', {
  loop: true,
  slidesPerView: 'auto',
  loopedSlides: 1,
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
});