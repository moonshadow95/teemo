'use strict';

import * as sound from './sound.js';

let TEEMO_SIZE = 90;
const MOVING_DURATION = 400;

export const ItemType = Object.freeze({
  teemo: 'teemo',
  trap: 'trap',
});
export class Field {
  constructor(teemoCount, trapCount, gameStatus, gameLevel) {
    this.teemoCount = teemoCount;
    this.trapCount = trapCount;
    this.gameStatus = gameStatus;
    this.gameLevel = gameLevel;

    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();

    this.x1 = 0;
    this.y1 = 0;
    this.x2 = this.fieldRect.width - TEEMO_SIZE;
    this.y2 = this.fieldRect.height - TEEMO_SIZE;

    this.timer = undefined;

    this.field.addEventListener('click', this.onFieldClickListener);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgSrc) {
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgSrc);
      item.style.position = 'absolute';
      const x = getRandomNum(this.x1, this.x2);
      const y = getRandomNum(this.y1, this.y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      if (window.innerWidth <= 768) {
        item.style.width = '50px';
        TEEMO_SIZE = 50;
      }
      this.field.appendChild(item);
    }
  }

  teemoMoving() {
    const teemos = document.querySelectorAll('.teemo');
    const teemoSpeed = 2200 - this.gameLevel() * 50;
    this.timer = setInterval(() => {
      teemos.forEach((teemo) => {
        const x = getRandomNum(-500, 500);
        const y = getRandomNum(-500, 500);
        teemo.style.transition = `all ${teemoSpeed}ms ease-in-out`;

        let moveX = parseFloat(teemo.style.left);
        moveX += x;
        if (moveX > 0 && moveX < this.x2) {
          teemo.style.left = `${moveX}px`;
        }
        let moveY = parseFloat(teemo.style.top);
        moveY += y;
        if (moveY > 0 && moveY < this.y2) {
          teemo.style.top = `${moveY}px`;
        }
      });
    }, MOVING_DURATION);
  }

  teemoStop() {
    clearInterval(this.timer);
  }

  onFieldClickListener = (event) => {
    if (!this.gameStatus()) return;
    const target = event.target;
    if (target.matches('.teemo')) {
      target.remove();
      sound.playTeemo();
      this.onItemClick && this.onItemClick(ItemType.teemo);
    } else if (target.matches('.trap')) {
      this.onItemClick && this.onItemClick(ItemType.trap);
      sound.playTrap();
    }
  };

  init() {
    this.field.innerHTML = '';
    this._addItem(
      ItemType.trap,
      this.trapCount * this.gameLevel(),
      'img/trap.png'
    );
    this._addItem(
      ItemType.teemo,
      this.teemoCount * this.gameLevel(),
      'img/teemo.png'
    );
  }
}

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
