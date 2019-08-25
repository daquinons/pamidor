const app = () => {
  let workPeriod = true;
  let timerStarted = false;
  let timerPaused = false;

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
        setGreenElementHeight(timerDuration, timerDuration, workPeriod);
      }

      updateUI();
    });

    rightButton.addEventListener('click', e => {
      if (!timerStarted) {
        intervalObject = startTimer(
          timerDuration - 1,
          timerElement,
          workPeriod
        );
        timerStarted = true;
      } else if (timerStarted && !timerPaused) {
        timerPaused = true;
      } else if (timerStarted && timerPaused) {
        timerPaused = false;
      }
      updateUI();
    });
  }

  function startTimer(workPeriod) {
    let timer = timerDuration - 1;
    let interval = setInterval(function() {
      if (!timerPaused) {
        setGreenElementHeight(timerDuration, timer, workPeriod);
        timerElement.textContent = getTimerTextForTime(timer);

        --timer;

        if (timer < 0) {
          clearInterval(interval);
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
    const duration = workPeriod ? 1500 : 300;
    timerElement.textContent = getTimerTextForTime(duration);
    return duration;
  }
};

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

module.exports = app;
