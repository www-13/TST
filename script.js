const words = [
    'problem','first','call','out','general','those','then','while','man','day',
    'leave','other','could','not','more','begin','without','some','feel','look',
    'mean','public','ask','help','they','than','another','home','school','world',
    'science','people','game','code','build','fast','just','know','want','thing',
    'life','best','idea','write','long','type','small','time','hard','open'
  ];
  
  const wordBox = document.getElementById('word-box');
  const hiddenInput = document.getElementById('hidden-input');
  const timeButtons = document.querySelectorAll('.time-options button');
  
  let fullText = [];
  let currentIndex = 0;
  let isStarted = false;
  let timer = null;
  let selectedTime = 15;
  let correctChars = 0;
  let totalChars = 0;
  let startTime;
  let npmResult = 0;
  let accuracyResult = 0;
  
  timeButtons.forEach(btn => {
    btn.onclick = () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = parseInt(btn.dataset.time);
      resetTest();
    }
  });
  
  function generateWords() {
    fullText = [];
    let total = 100;
    while (fullText.length < total) {
      fullText.push(words[Math.floor(Math.random() * words.length)]);
    }
    wordBox.innerHTML = '';
    fullText.forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      word.split('').forEach(letter => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = letter;
        wordSpan.appendChild(letterSpan);
      });
      const space = document.createElement('span');
      space.className = 'letter';
      space.textContent = ' ';
      wordSpan.appendChild(space);
      wordBox.appendChild(wordSpan);
    });
    updateCursor();
  }
  
  function updateCursor() {
    document.querySelectorAll('.letter').forEach(letter => {
      letter.classList.remove('current');
    });
    const current = document.querySelectorAll('.letter')[currentIndex];
    if (current) current.classList.add('current');
  }
  
  function startTimer() {
    let timeLeft = selectedTime;
    const display = document.getElementById('idk');
    startTime = Date.now(); // track when timer starts
  
    display.textContent = `Timer: ${timeLeft}`;
  
    const interval = setInterval(() => {
      timeLeft--;
      display.textContent = `Timer: ${timeLeft}`;
      
      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  
    timer = setTimeout(() => {
      hiddenInput.blur();
      calculateResults(); // ⬅️ call this when time is up
    }, selectedTime * 1000);
  }
  
  function calculateResults() {
    const timeTaken = (Date.now() - startTime) / 1000 / 60; // in minutes
    npmResult = Math.round((correctChars / 5) / timeTaken);
    accuracyResult = Math.round((correctChars / totalChars) * 100) || 0;
    document.getElementById('wpm-text').innerHTML = `WPM: ${npmResult}`;
    document.getElementById('acc-text').innerHTML = `ACC: ${accuracyResult}%`;
    console.log(`NPM: ${npmResult}`);
    console.log(`Accuracy: ${accuracyResult}%`);
  }
  
  hiddenInput.addEventListener('keydown', e => {
    if (!isStarted) {
      isStarted = true;
      startTimer();
    }
  
    const letters = document.querySelectorAll('.letter');
    const currentLetter = letters[currentIndex];
    if (!currentLetter) return;
  
    if (e.key.length === 1) {
      totalChars++;
      if (e.key === currentLetter.textContent) {
        correctChars++;
        currentLetter.classList.add('correct');
      } else {
        currentLetter.classList.add('incorrect');
      }
      currentIndex++;
      updateCursor();
    }
  
    if (e.key === 'Backspace' && currentIndex > 0) {
      currentIndex--;
      const prev = letters[currentIndex];
      if (prev.classList.contains('correct')) correctChars--;
      prev.classList.remove('correct', 'incorrect');
      updateCursor();
      e.preventDefault();
    }
  });
  
  function resetTest() {
    clearTimeout(timer);
    currentIndex = 0;
    isStarted = false;
    correctChars = 0;
    totalChars = 0;
    hiddenInput.value = '';
    generateWords();
    hiddenInput.focus();
  }
  
  generateWords();
  
  document.getElementById('res-btn').addEventListener('click', () =>{
      window.location.reload()
  })