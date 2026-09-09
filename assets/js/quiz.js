let currentQuiz = null;

async function loadQuiz() {
  const id = new URLSearchParams(location.search).get('id');
  const header = document.getElementById('quiz-header');
  const form = document.getElementById('quiz-form');

  try {
    const response = await fetch('data/quizzes.json', { cache: 'no-store' });
    const quizzes = await response.json();
    currentQuiz = quizzes.find(q => q.id === id);

    if (!currentQuiz) {
      header.innerHTML = '<div class="alert">Quiz tidak ditemukan.</div>';
      return;
    }

    document.title = `${currentQuiz.title} · Quiz Web`;
    header.innerHTML = `
      <p class="eyebrow">QUIZ</p>
      <h1>${escapeHtml(currentQuiz.title)}</h1>
      <p>${escapeHtml(currentQuiz.description || '')}</p>
    `;

    form.innerHTML = currentQuiz.questions.map((q, index) => `
      <article class="question card">
        <div class="question-number">Soal ${index + 1}</div>
        <h2>${escapeHtml(q.question)}</h2>
        ${q.audio ? `
          <audio class="audio" controls preload="metadata">
            <source src="audio/${encodeURIComponent(q.audio)}" type="audio/mpeg">
          </audio>
        ` : ''}
        <div class="options">
          ${['A','B','C','D'].map(key => `
            <label class="option">
              <input type="radio" name="q_${escapeHtml(q.id)}" value="${key}" required>
              <span><b>${key}.</b> ${escapeHtml(q.options?.[key] || '')}</span>
            </label>
          `).join('')}
        </div>
      </article>
    `).join('') + '<button class="button full" type="submit">Kirim Jawaban</button>';

    form.addEventListener('submit', submitQuiz);
    document.querySelectorAll('audio').forEach(audio => {
      audio.addEventListener('play', () => {
        document.querySelectorAll('audio').forEach(other => {
          if (other !== audio) other.pause();
        });
      });
    });
  } catch {
    header.innerHTML = '<div class="alert">Gagal memuat quiz.</div>';
  }
}

function submitQuiz(event) {
  event.preventDefault();
  const answers = {};

  currentQuiz.questions.forEach(q => {
    const selected = document.querySelector(`input[name="q_${CSS.escape(q.id)}"]:checked`);
    answers[q.id] = selected ? selected.value : null;
  });

  const correct = currentQuiz.questions.reduce((count, q) =>
    count + (answers[q.id] === q.answer ? 1 : 0), 0);

  sessionStorage.setItem('quizResult', JSON.stringify({
    quizId: currentQuiz.id,
    title: currentQuiz.title,
    total: currentQuiz.questions.length,
    correct
  }));

  location.href = 'result.html';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}

loadQuiz();
