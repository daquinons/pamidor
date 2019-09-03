const { updateTray, setMenuCompletedPomodoros } = require('./utils/updateTray');
const path = require('path');
const audioFile = path.join(__dirname, '..', '/assets/audio/audio.mp3');

const main = () => {
  // App State
  let workPeriod = true;
  let timerStarted = false;
  let timerPaused = false;
  let completedTimer = 0;

  let intervalObject;
  let timerElement = document.getElementById('timer');
  let timerDuration = setTimerDuration();

  const leftButton = document.getElementById('button-left');
  const rightButton = document.getElementById('button-right');
  addEvents();

  function addEvents() {
    leftButton.addEventListener('click', e => {
      if (timerStarted) {
        clearInterval(intervalObject);
        workPeriod = true;
        timerStarted = false;
        timerPaused = false;
        timerDuration = setTimerDuration();
        completedTimer = 0;
        setGreenElementHeight(timerDuration, timerDuration, workPeriod);
        updateTray(
          workPeriod,
          getTimerTextForTime(timerDuration)
        );
        setMenuCompletedPomodoros(completedTimer);
      }

      updateUI();
    });

    rightButton.addEventListener('click', e => {
      if (!timerStarted) {
        intervalObject = startTimer(workPeriod);
        timerStarted = true;
      } else if (timerStarted && !timerPaused) {
        timerPaused = true;
      } else if (timerStarted && timerPaused) {
        timerPaused = false;
      }
      updateUI();
    });
  }

  function startTimer(isWorkPeriod) {
    sendNotification(isWorkPeriod);
    setMenuCompletedPomodoros(completedTimer);
    let timer = timerDuration - 1;
    let interval = setInterval(function() {
      if (!timerPaused) {
        setGreenElementHeight(timerDuration, timer, workPeriod);
        const timerText = getTimerTextForTime(timer);
        timerElement.textContent = timerText;
        updateTray(workPeriod, timerText);

        --timer;

        if (timer < 0) {
          clearInterval(interval);
          completedTimer++;
          workPeriod = !isWorkPeriod;
          timerStarted = false;
          timerPaused = false;
          timerDuration = setTimerDuration();
          rightButton.click();
        }
      }
    }, 1000);

    return interval;
  }

  function updateUI() {
    if (!timerStarted) {
      leftButton.style.visibility = 'hidden';
      rightButton.src = './assets/images/play.svg';
    } else if (timerStarted && !timerPaused) {
      leftButton.style.visibility = 'visible';
      leftButton.src = './assets/images/stop.svg';
      rightButton.src = './assets/images/pause.svg';
    } else if (timerStarted && timerPaused) {
      rightButton.src = './assets/images/play.svg';
    }
  }

  function setTimerDuration() {
    let duration = workPeriod ? 10 : 5; /* 1500 : 300 */
    if (!workPeriod && completedTimer % 7 === 0) {
      duration *= 3;
    }
    timerElement.textContent = getTimerTextForTime(duration);
    return duration;
  }

  function getTimerTextForTime(time) {
    minutes = parseInt(time / 60, 10);
    seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
  }

  function setGreenElementHeight(duration, timer, isInverse) {
    const greenElement = document.getElementById('green');
    const percentage = (timer / duration) * 100;
    greenElement.style.height = `${isInverse ? 100 - percentage : percentage}%`;
  }

  function sendNotification(isWorkPeriod) {
    const audio = new Audio(audioFile);
    audio.play();
    const title = isWorkPeriod ? 'Time to work' : 'Time to rest';
    const body = isWorkPeriod
      ? 'Focus during the next minutes until the end of the timer'
      : 'Take a breath before continuing to work';
    const icon = isWorkPeriod
      ? './assets/images/red_circle.png'
      : './assets/images/green_circle.png';
    new Notification(title, {
      body: body,
      icon: icon,
      silent: true
    });
  }
};

module.exports = main;
