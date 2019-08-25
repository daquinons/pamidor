const app = () => {
  const timerDuration = 300;
  const timerElement = document.getElementById('timer');
  startTimer(timerDuration, timerElement);
};

function startTimer(duration, display) {
  let timer = duration,
    minutes,
    seconds;
  let interval = setInterval(function() {
    setGreenElementHeight(duration, timer, false);

    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.textContent = minutes + ':' + seconds;

    --timer;

    if (timer < 0) {
      clearInterval(interval);
    }
  }, 1000);
}

function setGreenElementHeight(duration, timer, isInverse) {
  const greenElement = document.getElementById('green');
  const percentage = (timer / duration) * 100;
  greenElement.style.height = `${isInverse ? 100 - percentage : percentage}%`;
}

module.exports = app;
