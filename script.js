document.addEventListener('DOMContentLoaded', () => {
  let timerInterval;
  let remainingSeconds = 0;
  let isPaused = false;
  const timeInput = document.getElementById('timeInput');
  const display = document.getElementById('display');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const alarm = document.getElementById('alarmSound');

  function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (timerInterval) return;
    let inputVal = parseInt(timeInput.value);
    if (isNaN(inputVal) || inputVal <= 0) {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = 'Please enter a valid number of seconds.';
      errorMessage.style.color = 'red';
      errorMessage.style.fontSize = '16px';
      errorMessage.style.fontWeight = 'bold';
      errorMessage.style.marginBottom = '10px';
      timeInput.parentNode.appendChild(errorMessage);
      setTimeout(() => {
        errorMessage.remove();
      }, 2000);
      return;
    }
    if (!isPaused) remainingSeconds = inputVal;
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    updateDisplay(remainingSeconds);
    timerInterval = setInterval(() => {
      if (!isPaused) {
        remainingSeconds--;
        updateDisplay(remainingSeconds);
        if (remainingSeconds <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          updateDisplay(0);
          playSound();
          showPopup();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Play' : 'Pause';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    remainingSeconds = 0;
    timeInput.value = '';
    updateDisplay(0);
    stopSound();
  }

  function playSound() {
    alarm.currentTime = 0;
    alarm.play();
  }

  function stopSound() {
    alarm.pause();
    alarm.currentTime = 0;
  }

  function showPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
      <div style="background:#222; color:#fff; padding:20px; border-radius:10px; text-align:center; width:250px;">
        <p>⏰ Time’s up! What do you want to do?</p>
        <button id="snoozeBtn">Snooze 1 min</button>
        <button id="resetNowBtn">Reset</button>
      </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(0,0,0,0.8)';
    popup.style.zIndex = '1000';
    document.body.appendChild(popup);
    document.getElementById('snoozeBtn').onclick = () => {
      stopSound();
      document.querySelector('.popup-overlay').remove();
      clearInterval(timerInterval);
      timerInterval = null;
      remainingSeconds = 60;
      isPaused = false;
      pauseBtn.textContent = 'Pause';
      timerInterval = setInterval(() => {
        if (!isPaused) {
          remainingSeconds--;
          updateDisplay(remainingSeconds);
          if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            updateDisplay(0);
            playSound();
            showPopup();
          }
        }
      }, 1000);
    };
    document.getElementById('resetNowBtn').onclick = () => {
      document.querySelector('.popup-overlay').remove();
      resetTimer();
    };
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  updateDisplay(0);
});