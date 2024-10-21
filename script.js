let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedSubject = '';
let selectedWeek = '';
let totalQuestions = 0;  // Ukupan broj pitanja


window.onload = function() {
  document.getElementById('question-counter').style.display = 'none';  // Sakrij brojač kad se stranica učita
};



document.getElementById('subject-select').addEventListener('change', function () {
  selectedSubject = this.value;
  enableWeekSelection();
});

function enableWeekSelection() {
  const weekSelect = document.getElementById('week-select');
  weekSelect.disabled = false;
  weekSelect.innerHTML = '<option value="">-- Odaberi sedmicu --</option>';

  for (let i = 1; i <= 14; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Week ${i}`;
    weekSelect.appendChild(option);
  }

  weekSelect.addEventListener('change', function () {
    selectedWeek = this.value;
    document.getElementById('start-quiz').disabled = !selectedWeek;
  });
}

document.getElementById('start-quiz').addEventListener('click', function () {
  resetQuizState();
  hideSelection();
  document.getElementById('question-counter').style.display = 'block';  // Prikaži brojač kada počne kviz
  loadQuestions(selectedSubject, selectedWeek);
});


function resetQuizState() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById('next-question').style.display = 'none';
  document.getElementById('result-container').style.display = 'none';
}

function hideSelection() {
  document.getElementById('subject-select').style.display = 'none';
  document.getElementById('subject-title').style.display = 'none';
  document.getElementById('week-select').style.display = 'none';
  document.getElementById('week-title').style.display = 'none';
  document.getElementById('start-quiz').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
}




// Funkcija za učitavanje pitanja
function loadQuestions(subject, week) {
  const filePath = `questions/${subject}week${week}.json`;

  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Nije moguće učitati pitanja.');
      }
      return response.json();
    })
    .then(data => {
      questions = data[`week${week}_questions`] || [];
      totalQuestions = questions.length;  // Izbroji ukupan broj pitanja
      if (totalQuestions === 0) {
        throw new Error('Nema pitanja za odabrani predmet i sedmicu.');
      }
      currentQuestionIndex = 0;  // Resetuj indeks pitanja
      document.getElementById('question-counter').style.display = 'block';  // Prikaži brojač
      updateQuestionCounter();  // Ažuriraj prikaz brojača
      showQuestion();  // Prikaži prvo pitanje
    })
    .catch(error => {
      console.error('Greška prilikom učitavanja pitanja:', error);
      alert('Pitanja za odabrani predmet i sedmicu nisu dostupna.');
    });
}






// Funkcija za prikaz pitanja
function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';  // Očisti prethodne opcije

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => selectAnswer(index, button);
    optionsContainer.appendChild(button);
  });

  updateQuestionCounter();  // Ažuriraj prikaz broja pitanja svaki put kada se pitanje prikaže
}


// Funkcija za ažuriranje broja pitanja
function updateQuestionCounter() {
  // Ažuriraj prikaz trenutnog pitanja (npr. 1/30)
  document.getElementById('question-counter').textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
}



function resetQuiz() {
  currentQuestionIndex = 0;  // Resetuj trenutni indeks pitanja
  document.getElementById('question-counter').style.display = 'none';  // Sakrij brojač
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'none';
  document.getElementById('subject-select').style.display = 'block';  // Ponovo prikaži odabir predmeta
  document.getElementById('week-select').style.display = 'block';
  document.getElementById('start-quiz').style.display = 'block';  // Ponovo prikaži dugme za start kviza
}




function selectAnswer(selectedIndex, button) {
  const correctIndex = questions[currentQuestionIndex].answer;

  document.querySelectorAll('#options button').forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('wrong');
    document.querySelectorAll('#options button')[correctIndex].classList.add('correct');
  }

  document.getElementById('next-question').style.display = 'block';
}




// Event listener za dugme "Dalje"
document.getElementById('next-question').addEventListener('click', function () {
  currentQuestionIndex++;  // Povećaj indeks pitanja samo jednom
  if (currentQuestionIndex < totalQuestions) {
    showQuestion();  // Prikaži sledeće pitanje
    this.style.display = 'none';  // Sakrij dugme dok korisnik ne izabere odgovor
  } else {
    showResults();  // Kada završe sva pitanja, prikaži rezultate
  }
});




// Prikaz rezultata i sakrivanje brojača
function showResults() {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('question-counter').style.display = 'none';  // Sakrij brojač kada se prikaže rezultat
  document.getElementById('score-text').textContent = `Osvojili ste ${score} bod(ova).`;
}



document.getElementById('restart-quiz').addEventListener('click', function () {
  resetQuiz();
});

function resetQuiz() {
  document.getElementById('result-container').style.display = 'none';
  document.getElementById('subject-select').style.display = 'block';
  document.getElementById('subject-title').style.display = 'block';
  document.getElementById('week-select').style.display = 'block';
  document.getElementById('week-title').style.display = 'block';
  document.getElementById('start-quiz').style.display = 'block';
}

// Event listener za dugme "Prekini Kviz"
document.getElementById('cancel-quiz').addEventListener('click', function () {
  resetQuiz();  // Resetuj kviz kada korisnik pritisne "Prekini Kviz"
  
  // Sakrij brojač kada korisnik prekine kviz
  document.getElementById('question-counter').style.display = 'none'; 
  
  // Sakrij sadržaj kviza i prikaži izbor predmeta
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'none';
  document.getElementById('subject-select').style.display = 'block';  // Prikaži ponovo opciju za odabir predmeta
  document.getElementById('week-select').style.display = 'block';  // Prikaži ponovo opciju za odabir sedmice
  document.getElementById('start-quiz').style.display = 'block';  // Prikaži dugme za pokretanje kviza
});



function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
