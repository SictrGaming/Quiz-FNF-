let currentQuiz=null;

async function loadQuiz(){
const id=new URLSearchParams(location.search).get('id');
const header=document.getElementById('quiz-header');
const form=document.getElementById('quiz-form');
try{
const response=await fetch('data/quizzes.json',{cache:'no-store'});
if(!response.ok)throw new Error();
const quizzes=await response.json();
currentQuiz=quizzes.find(q=>q.id===id);
if(!currentQuiz){header.innerHTML='<div class="alert">Quiz tidak ditemukan.</div>';return;}
document.title=currentQuiz.title+' · Quiz Web';
const maxPoints=currentQuiz.questions.reduce((sum,q)=>sum+(Number(q.points)||0),0);
header.innerHTML=`
<p class="eyebrow">QUIZ</p>
<h1>${escapeHtml(currentQuiz.title)}</h1>
<p>${escapeHtml(currentQuiz.description||'')}</p>
<div class="meta">Maksimum ${maxPoints} poin</div>`;
form.innerHTML=currentQuiz.questions.map((q,i)=>`
<article class="question card">
<div class="question-top">
<div class="question-number">Soal ${i+1}</div>
<div class="points">${Number(q.points)||0} poin</div>
</div>
<h2>${escapeHtml(q.question)}</h2>
${q.audio?`<audio class="audio" controls preload="metadata"><source src="audio/${encodeURIComponent(q.audio)}" type="audio/mpeg"></audio>`:''}
<div class="options">
${['A','B','C','D'].map(k=>`
<label class="option" data-question="${escapeHtml(q.id)}">
<input type="radio" name="q_${escapeHtml(q.id)}" value="${k}">
<span class="option-label">${k}. ${escapeHtml(q.options?.[k]||'')}</span>
</label>`).join('')}
</div>
</article>`).join('')+'<button class="button full" type="submit">Kirim Jawaban</button>';

document.querySelectorAll('.option').forEach(option=>{
option.addEventListener('click',()=>{
const questionId=option.dataset.question;
document.querySelectorAll(`.option[data-question="${CSS.escape(questionId)}"]`).forEach(x=>x.classList.remove('selected'));
option.classList.add('selected');
option.querySelector('input').checked=true;
});
});
document.querySelectorAll('audio').forEach(audio=>audio.addEventListener('play',()=>{
document.querySelectorAll('audio').forEach(other=>{if(other!==audio)other.pause();});
}));
form.addEventListener('submit',submitQuiz);
}catch{
header.innerHTML='<div class="alert">Gagal memuat quiz.</div>';
}}

function submitQuiz(event){
event.preventDefault();
const answers={};
let earned=0,total=0;
currentQuiz.questions.forEach(q=>{
const selected=document.querySelector(`input[name="q_${CSS.escape(q.id)}"]:checked`);
const answer=selected?selected.value:null;
const points=Number(q.points)||0;
answers[q.id]=answer;
total+=points;
if(answer===q.answer)earned+=points;
});
sessionStorage.setItem('quizResult',JSON.stringify({
quizId:currentQuiz.id,title:currentQuiz.title,earned,total,answers
}));
location.href='result.html';
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
loadQuiz();
