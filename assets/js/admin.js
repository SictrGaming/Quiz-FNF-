const STORAGE_KEY = 'quiz-web-admin-data';
const list = document.getElementById('admin-list');
const editor = document.getElementById('editor');

let quizzes = [];

async function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      quizzes = JSON.parse(saved);
    } catch {
      quizzes = [];
    }
  }

  if (!quizzes.length) {
    try {
      const response = await fetch('../data/quizzes.json', { cache: 'no-store' });
      quizzes = await response.json();
    } catch {
      quizzes = [];
    }
  }

  renderList();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes, null, 2));
}

function renderList() {
  if (!quizzes.length) {
    list.innerHTML = '<div class="empty">Belum ada quiz.</div>';
    return;
  }

  list.innerHTML = quizzes.map(q => `
    <article class="card admin-row">
      <div>
        <h2>${escapeHtml(q.title)}</h2>
        <p>${escapeHtml(q.description || '')}</p>
        <div class="meta">${q.questions.length} soal · ID: ${escapeHtml(q.id)}</div>
      </div>
      <div class="actions">
        <button class="button secondary" data-edit="${escapeHtml(q.id)}">Edit</button>
        <button class="button danger" data-delete="${escapeHtml(q.id)}">Hapus</button>
      </div>
    </article>
  `).join('');

  list.querySelectorAll('[data-edit]').forEach(btn =>
    btn.addEventListener('click', () => editQuiz(btn.dataset.edit)));
  list.querySelectorAll('[data-delete]').forEach(btn =>
    btn.addEventListener('click', () => deleteQuiz(btn.dataset.delete)));
}

function editQuiz(id) {
  const quiz = quizzes.find(q => q.id === id);
  if (!quiz) return;

  editor.classList.remove('hidden');
  editor.innerHTML = `
    <h2>Edit Quiz</h2>
    <form id="edit-form">
      <label>Judul<input id="title" value="${escapeAttr(quiz.title)}" required></label>
      <label>Deskripsi<textarea id="description">${escapeHtml(quiz.description || '')}</textarea></label>
      <div id="question-builders"></div>
      <button type="button" class="button secondary" id="add-question">+ Tambah Soal</button>
      <button class="button full">Simpan</button>
    </form>
  `;

  const builders = document.getElementById('question-builders');
  quiz.questions.forEach((q, index) => builders.insertAdjacentHTML('beforeend', questionTemplate(q, index)));

  document.getElementById('add-question').addEventListener('click', () => {
    builders.insertAdjacentHTML('beforeend', questionTemplate(null, builders.children.length));
  });

  document.getElementById('edit-form').addEventListener('submit', event => {
    event.preventDefault();

    quiz.title = document.getElementById('title').value.trim();
    quiz.description = document.getElementById('description').value.trim();

    quiz.questions = [...builders.querySelectorAll('.builder')].map((box, index) => ({
      id: box.dataset.id || `q-${Date.now()}-${index}`,
      question: box.querySelector('.q-text').value.trim(),
      audio: box.querySelector('.q-audio').value.trim() || null,
      options: {
        A: box.querySelector('.opt-A').value.trim(),
        B: box.querySelector('.opt-B').value.trim(),
        C: box.querySelector('.opt-C').value.trim(),
        D: box.querySelector('.opt-D').value.trim()
      },
      answer: box.querySelector('.q-answer').value
    }));

    persist();
    renderList();
    editor.innerHTML = '<div class="success">Quiz berhasil disimpan di browser. Gunakan Export JSON untuk memasukkannya ke repository.</div>';
  });
}

function questionTemplate(q, index) {
  q ||= {
    id: '',
    question: '',
    audio: '',
    options: {A:'',B:'',C:'',D:''},
    answer: 'A'
  };

  return `
    <div class="builder" data-id="${escapeAttr(q.id)}">
      <h3>Soal ${index + 1}</h3>
      <label>Pertanyaan<textarea class="q-text" required>${escapeHtml(q.question)}</textarea></label>
      <label>Audio MP3<input class="q-audio" placeholder="contoh.mp3" value="${escapeAttr(q.audio || '')}"></label>
      <label>Jawaban benar
        <select class="q-answer">
          ${['A','B','C','D'].map(k => `<option ${q.answer === k ? 'selected' : ''}>${k}</option>`).join('')}
        </select>
      </label>
      <div class="option-grid">
        ${['A','B','C','D'].map(k => `
          <label>Opsi ${k}<input class="opt-${k}" value="${escapeAttr(q.options?.[k] || '')}" required></label>
        `).join('')}
      </div>
    </div>
  `;
}

function createQuiz() {
  const id = `quiz-${Date.now()}`;
  quizzes.unshift({
    id,
    title: 'Quiz Baru',
    description: '',
    questions: [{
      id: `q-${Date.now()}`,
      question: 'Pertanyaan baru',
      audio: null,
      options: {A:'',B:'',C:'',D:''},
      answer: 'A'
    }]
  });
  persist();
  renderList();
  editQuiz(id);
}

function deleteQuiz(id) {
  if (!confirm('Hapus quiz ini?')) return;
  quizzes = quizzes.filter(q => q.id !== id);
  persist();
  renderList();
  editor.classList.add('hidden');
}

function exportJson() {
  const blob = new Blob([JSON.stringify(quizzes, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quizzes.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('new-quiz').addEventListener('click', createQuiz);
document.getElementById('export-json').addEventListener('click', exportJson);

document.getElementById('import-file').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed)) throw new Error();
      quizzes = parsed;
      persist();
      renderList();
      alert('JSON berhasil diimport.');
    } catch {
      alert('JSON tidak valid.');
    }
  };
  reader.readAsText(file);
});

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

init();
