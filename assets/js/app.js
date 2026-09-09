async function loadQuizzes(){
  const list=document.getElementById('quiz-list');
  const count=document.getElementById('quiz-count');
  try{
    const response=await fetch('data/quizzes.json',{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const quizzes=await response.json();
    if(!Array.isArray(quizzes)||!quizzes.length){
      list.innerHTML='<div class="empty">Belum ada quiz. Tambahkan data di <code>data/quizzes.json</code>.</div>';
      return;
    }
    count.textContent=quizzes.length===1?'1 quiz tersedia':quizzes.length+' quiz tersedia';
    list.innerHTML=quizzes.map(q=>{
      const totalPoints=(q.questions||[]).reduce((sum,item)=>sum+(Number(item.points)||0),0);
      const questionCount=(q.questions||[]).length;
      return `
<article class="quiz-card">
<h2>${escapeHtml(q.title||'Quiz tanpa judul')}</h2>
<p>${escapeHtml(q.description||'')}</p>
<div class="meta">
<span>${questionCount} soal</span>
<span>${totalPoints} poin</span>
</div>
<a class="button" href="quiz.html?id=${encodeURIComponent(q.id)}">Mulai quiz</a>
</article>`;
    }).join('');
  }catch(err){
    list.innerHTML='<div class="alert">Gagal memuat data quiz. Pastikan file <code>data/quizzes.json</code> ada dan formatnya benar.</div>';
  }
}

function escapeHtml(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

loadQuizzes();
