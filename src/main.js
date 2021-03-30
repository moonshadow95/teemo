'use strict';
import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .gameDuration(10)
  .teemoCount(3)
  .trapCount(3)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = 'Try again?';
      sound.playTimeOut();
      break;
    case Reason.win:
      message = 'GO NEXT LEVEL! 🎉';
      sound.playVictory();
      break;
    case Reason.lose:
      message = 'WHAT A WASTE!😫';
      sound.playTrap();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});
gameFinishBanner.setClickListener(() => {
  game.start();
});
