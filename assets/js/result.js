const result = document.getElementById('result');
const data = JSON.parse(sessionStorage.getItem('quizResult') || 'null');

if (!data) {
  result.innerHTML = `
    <h1>Belum ada hasil</h1>
    <p>Kerjakan quiz terlebih dahulu.</p>
    <a class="button" href="index.html">Kembali</a>
  `;
} else {
  const score = data.total ? Math.round(data.correct / data.total * 100) : 0;
  result.innerHTML = `
    <p class="eyebrow">HASIL QUIZ</p>
    <h1>${escapeHtml(data.title)}</h1>
    <div class="score">${score}<small>/100</small></div>
    <p>Kamu menjawab <b>${data.correct}</b> dari <b>${data.total}</b> soal dengan benar.</p>
    <a class="button" href="index.html">Kembali ke Daftar Quiz</a>
  `;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}
