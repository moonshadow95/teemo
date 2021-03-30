'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRedo = document.querySelector('.pop-up__redo');
    this.popUpRedo.addEventListener('click', () => {
      this.onClick && this.onClick();
      this._hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUpText.innerHTML = text;
    this.popUp.classList.remove('pop-up--hide');
  }

  _hide() {
    this.popUp.classList.add('pop-up--hide');
  }
}
