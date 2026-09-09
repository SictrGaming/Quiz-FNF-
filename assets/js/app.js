async function loadQuizzes() {
  const list = document.getElementById('quiz-list');
  try {
    const response = await fetch('data/quizzes.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Gagal memuat JSON.');
    const quizzes = await response.json();

    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      list.innerHTML = '<div class="empty">Belum ada quiz.</div>';
      return;
    }

    list.innerHTML = quizzes.map(quiz => `
      <article class="card">
        <h2>${escapeHtml(quiz.title)}</h2>
        <p>${escapeHtml(quiz.description || '')}</p>
        <div class="meta">${quiz.questions.length} soal</div>
        <a class="button" href="quiz.html?id=${encodeURIComponent(quiz.id)}">Mulai Quiz</a>
      </article>
    `).join('');
  } catch (error) {
    list.innerHTML = `<div class="alert">${escapeHtml(error.message)}</div>`;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}

loadQuizzes();
