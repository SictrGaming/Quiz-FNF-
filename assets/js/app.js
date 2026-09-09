async function loadQuizzes(){
const list=document.getElementById('quiz-list');
try{
const response=await fetch('data/quizzes.json',{cache:'no-store'});
if(!response.ok)throw new Error();
const quizzes=await response.json();
if(!quizzes.length){list.innerHTML='<div class="empty">Belum ada quiz.</div>';return;}
list.innerHTML=quizzes.map(q=>`
<article class="card">
<h2>${escapeHtml(q.title)}</h2>
<p>${escapeHtml(q.description||'')}</p>
<div class="meta">${q.questions.length} soal</div>
<a class="button" href="quiz.html?id=${encodeURIComponent(q.id)}">Mulai Quiz</a>
</article>`).join('');
}catch{
list.innerHTML='<div class="alert">Gagal memuat data quiz.</div>';
}}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
loadQuizzes();
