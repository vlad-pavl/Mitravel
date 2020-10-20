const burger = document.querySelector('.burger');
const close = document.querySelector('.menu__close');
const menu = document.querySelector('.menu');

burger.addEventListener('click', () => {
  menu.classList.add('menu_visible')
});

// burger.addEventListener('click', () => {
//   menu.classList.remove('menu_visible')
// })

close.addEventListener('click', () => {
  menu.classList.remove('menu_visible')
});