'use strict';

let TEEMO_SIZE = 170;
const TEEMO_COUNT = 15;
const TRAP_COUNT = 13;
const GAME_SEC = 7;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRedo = document.querySelector('.pop-up__redo');

const teemoSound = new Audio('./sound/teemo_click.mp3');
const trapSound = new Audio('./sound/teemo_trap.mp3');
const victorySound = new Audio('./sound/victory.mp3');
const timeOutSound = new Audio('./sound/teemo_timeout.mp3');
const bgSound = new Audio('./sound/bg.mp3');

let started = false;
let score = 0;
let timer = undefined;

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

field.addEventListener('click', onFieldClick);

popUpRedo.addEventListener('click', () => {
  returnToBegin();
  stopSound(bgSound);
});

function startGame() {
  started = true;
  initGame();
  changeToStop();
  showTimeNScore();
  startTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpText('TRY AGAIN?');
}

function finishGame(win) {
  started = false;
  score = 0;
  hideGameBtn();
  showPopUpText(win ? 'You got them all!🎉' : 'Waste...😭');
  stopGameTimer();
}

function showTimeNScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startTimer() {
  let remainingSec = GAME_SEC;
  updateTimerText(remainingSec);
  timer = setInterval(() => {
    if (remainingSec <= 0) {
      clearInterval(timer);
      finishGame(TEEMO_COUNT === score);
      return;
    }
    updateTimerText(--remainingSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
  playSound(trapSound);
}

function updateTimerText(time) {
  const seconds = time;
  gameTimer.innerText = seconds >= 10 ? `0:${seconds}` : `0:0${seconds}`;
}

function changeToStop() {
  const icon = gameBtn.querySelector('.fa-play');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
}

function changeToPlay() {
  const icon = gameBtn.querySelector('.fa-stop');
  icon.classList.add('fa-play');
  icon.classList.remove('fa-stop');
}

function hideGameBtn() {
  gameBtn.style.visibility = 'hidden';
}

function showGameBtn() {
  gameBtn.style.visibility = 'visible';
}

function showPopUpText(text) {
  popUp.classList.remove('pop-up--hide');
  popUpText.innerHTML = text;
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}

function returnToBegin() {
  hidePopUp();
  showGameBtn();
  changeToPlay();
  resetTimerNScore();
}

function resetTimerNScore() {
  updateTimerText(GAME_SEC);
  gameScore.innerText = TEEMO_COUNT;
}

function initGame() {
  field.innerHTML = '';
  gameScore.innerHTML = TEEMO_COUNT;
  addItem('trap', TRAP_COUNT, 'img/trap.png');
  addItem('teemo', TEEMO_COUNT, 'img/teemo.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.teemo')) {
    playSound(teemoSound);
    target.remove();
    score++;
    updateScore();
    if (score === TEEMO_COUNT) {
      finishGame(true);
      playSound(victorySound);
    }
  } else if (target.matches('.trap')) {
    playSound(trapSound);
    stopGameTimer();
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScore() {
  gameScore.innerText = TEEMO_COUNT - score;
}

function addItem(className, count, imgSrc) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - TEEMO_SIZE;
  const y2 = fieldRect.height - TEEMO_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgSrc);
    item.style.position = 'absolute';
    const x = rnd(x1, x2);
    const y = rnd(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    if (window.innerWidth <= 800) {
      item.style.width = '80px';
      TEEMO_SIZE = 80;
    }
    field.appendChild(item);
  }
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
