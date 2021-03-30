'use strict';

import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  teemoCount(num) {
    this.teemoCount = num;
    return this;
  }

  trapCount(num) {
    this.trapCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.teemoCount,
      this.trapCount
    );
  }
}

class Game {
  constructor(gameDuration, teemoCount, trapCount) {
    this.gameDuration = gameDuration;
    this.teemoCount = teemoCount;
    this.trapCount = trapCount;

    this.gameBtn = document.querySelector('.game__button');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameLevelBoard = document.querySelector('.game__level');

    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.level = 1;

    this.gameField = new Field(
      this.teemoCount,
      this.trapCount,
      () => this.started,
      () => this.level
    );
    this.gameField.setClickListener(this.onItemClick);
  }

  onItemClick = (item) => {
    if (item === ItemType.teemo) {
      this.score++;
      this.updateScore();
      if (this.score === this.teemoCount * this.level) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.trap) {
      this.stop(Reason.lose);
    }
  };

  getGameStatus() {
    return this.started;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.changeToStop();
    this.showTimeNScore();
    this.startGameTimer();
    this.showGameBtn();
    this.gameField.teemoMoving();
    sound.playBg();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameBtn();
    this.onGameStop && this.onGameStop(reason);
    this.changeToPlay();
    this.resetTimerNScore();
    this.gameField.teemoStop();
    sound.stopBg();
    if (reason === Reason.win) {
      this.level++;
      sound.playVictory();
    } else if (reason === Reason.lose) {
      sound.playTimeOut();
      this.level = 1;
    }
  }

  initGame() {
    this.levelUp();
    this.score = 0;
    this.gameScore.innerHTML = `SCORE: ${this.teemoCount * this.level}`;
    this.gameField.init();
  }

  showTimeNScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);

    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        sound.stopBg();
        sound.playTimeOut();
        if (this.started) {
          this.stop(
            this.score === this.teemoCount * this.level
              ? Reason.win
              : Reason.lose
          );
        }
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const seconds = time;
    this.gameTimer.innerText = seconds >= 10 ? `0:${seconds}` : `0:0${seconds}`;
  }

  changeToStop() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
  }

  changeToPlay() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-play');
    icon.classList.remove('fa-stop');
  }

  hideGameBtn() {
    this.gameBtn.style.visibility = 'hidden';
  }

  showGameBtn() {
    this.gameBtn.style.visibility = 'visible';
  }

  resetTimerNScore() {
    this.updateTimerText(this.gameDuration);
    this.gameScore.innerText = `SCORE: ${this.teemoCount * this.level}`;
  }

  updateScore() {
    this.gameScore.innerText = `SCORE: ${
      this.teemoCount * this.level - this.score
    }`;
  }

  levelUp() {
    this.gameLevelBoard.innerText = `LEVEL ${this.level}`;
  }
}
