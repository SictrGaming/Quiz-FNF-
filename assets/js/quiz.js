let currentQuiz=null;

async function loadQuiz(){
  const id=new URLSearchParams(location.search).get('id');
  const header=document.getElementById('quiz-header');
  const form=document.getElementById('quiz-form');
  const progressTrack=document.getElementById('progress-track');

  if(!id){
    header.innerHTML='<div class="alert">Tidak ada quiz yang dipilih. <a href="index.html">Kembali ke daftar quiz.</a></div>';
    return;
  }

  try{
    const response=await fetch('data/quizzes.json',{cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const quizzes=await response.json();
    currentQuiz=Array.isArray(quizzes)?quizzes.find(q=>q.id===id):null;

    if(!currentQuiz){
      header.innerHTML='<div class="alert">Quiz tidak ditemukan. <a href="index.html">Kembali ke daftar quiz.</a></div>';
      return;
    }
    if(!Array.isArray(currentQuiz.questions)||!currentQuiz.questions.length){
      header.innerHTML='<div class="alert">Quiz ini belum memiliki soal.</div>';
      return;
    }

    document.title=currentQuiz.title+' · Quiz Web';
    const maxPoints=currentQuiz.questions.reduce((sum,q)=>sum+(Number(q.points)||0),0);

    header.innerHTML=`
<h1>${escapeHtml(currentQuiz.title)}</h1>
<p>${escapeHtml(currentQuiz.description||'')}</p>
<div class="tag">Maksimum ${maxPoints} poin · ${currentQuiz.questions.length} soal</div>`;

    form.innerHTML=currentQuiz.questions.map((q,i)=>`
<article class="question card">
<div class="question-top">
<div class="question-number">Soal ${i+1} dari ${currentQuiz.questions.length}</div>
<div class="points">${Number(q.points)||0} poin</div>
</div>
<h2>${escapeHtml(q.question)}</h2>
${q.audio?`<audio class="audio" controls preload="metadata"><source src="audio/${encodeURIComponent(q.audio)}" type="audio/mpeg"></audio>`:''}
<div class="options">
${['A','B','C','D'].filter(k=>q.options&&q.options[k]!=null&&q.options[k]!=='').map(k=>`
<label class="option" data-question="${escapeHtml(q.id)}">
<input type="radio" name="q_${escapeHtml(q.id)}" value="${k}">
<span class="option-label">${k}. ${escapeHtml(q.options[k])}</span>
</label>`).join('')}
</div>
</article>`).join('')+'<button class="button full" type="submit">Kirim jawaban</button>';

    document.querySelectorAll('.option').forEach(option=>{
      option.addEventListener('click',()=>{
        const questionId=option.dataset.question;
        document.querySelectorAll(`.option[data-question="${CSS.escape(questionId)}"]`).forEach(x=>x.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input').checked=true;
        updateProgress();
      });
    });

    document.querySelectorAll('audio').forEach(audio=>{
      audio.addEventListener('play',()=>{
        document.querySelectorAll('audio').forEach(other=>{if(other!==audio)other.pause();});
      });
    });

    progressTrack.hidden=false;
    updateProgress();

    form.addEventListener('submit',submitQuiz);
  }catch(err){
    header.innerHTML='<div class="alert">Gagal memuat quiz. Periksa koneksi atau coba muat ulang halaman.</div>';
  }
}

function updateProgress(){
  if(!currentQuiz)return;
  const total=currentQuiz.questions.length;
  const answered=currentQuiz.questions.filter(q=>document.querySelector(`input[name="q_${CSS.escape(q.id)}"]:checked`)).length;
  const fill=document.getElementById('progress-fill');
  if(fill)fill.style.width=(total?Math.round(answered/total*100):0)+'%';
}

function submitQuiz(event){
  event.preventDefault();

  const unanswered=currentQuiz.questions.filter(q=>!document.querySelector(`input[name="q_${CSS.escape(q.id)}"]:checked`));
  if(unanswered.length){
    const proceed=confirm(`Masih ada ${unanswered.length} soal yang belum dijawab. Kirim jawaban sekarang?`);
    if(!proceed)return;
  }

  let earned=0,total=0;
  const breakdown=currentQuiz.questions.map(q=>{
    const selected=document.querySelector(`input[name="q_${CSS.escape(q.id)}"]:checked`);
    const answer=selected?selected.value:null;
    const points=Number(q.points)||0;
    const correct=answer===q.answer;
    total+=points;
    if(correct)earned+=points;
    return{
      id:q.id,
      question:q.question,
      points,
      earnedPoints:correct?points:0,
      selected:answer,
      correctAnswer:q.answer,
      correctOptionText:q.options?q.options[q.answer]:null,
      correct
    };
  });

  sessionStorage.setItem('quizResult',JSON.stringify({
    quizId:currentQuiz.id,
    title:currentQuiz.title,
    earned,
    total,
    breakdown
  }));
  location.href='result.html';
}

function escapeHtml(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

loadQuiz();
