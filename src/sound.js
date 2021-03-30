'use strict';

const victorySound = new Audio('./sound/victory.mp3');
const timeOutSound = new Audio('./sound/teemo_timeout.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const teemoSound = new Audio('./sound/teemo_click.mp3');
const trapSound = new Audio('./sound/teemo_trap.mp3');

export function playTeemo() {
  playSound(teemoSound);
}
export function playTrap() {
  playSound(trapSound);
}
export function playTimeOut() {
  playSound(timeOutSound);
}
export function playVictory() {
  playSound(victorySound);
}
export function playBg() {
  playSound(bgSound);
}
export function stopBg() {
  stopSound(bgSound);
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
