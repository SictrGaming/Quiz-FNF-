const resultEl=document.getElementById('result');
const reviewEl=document.getElementById('review');
const data=JSON.parse(sessionStorage.getItem('quizResult')||'null');

function scoreMessage(percent){
  if(percent>=90)return'Luar biasa! Hampir semua jawabanmu benar.';
  if(percent>=70)return'Kerja bagus, hasil yang solid.';
  if(percent>=50)return'Lumayan, masih ada ruang untuk ditingkatkan.';
  return'Jangan menyerah, coba lagi untuk hasil yang lebih baik.';
}

function renderRing(percent){
  const radius=74;
  const circumference=2*Math.PI*radius;
  const offset=circumference-(percent/100)*circumference;
  return `
<div class="score-ring">
<svg width="172" height="172" viewBox="0 0 172 172">
<circle class="track" cx="86" cy="86" r="${radius}"></circle>
<circle class="fill" cx="86" cy="86" r="${radius}"
  stroke-dasharray="${circumference}"
  stroke-dashoffset="${circumference}"
  data-target-offset="${offset}"></circle>
</svg>
<div class="ring-label">
<div class="ring-percent">${percent}%</div>
<div class="ring-points">${data.earned} / ${data.total} poin</div>
</div>
</div>`;
}

if(!data){
  resultEl.innerHTML=`
<h1>Belum ada hasil</h1>
<p class="result-message">Kerjakan quiz terlebih dahulu untuk melihat hasilnya di sini.</p>
<div class="button-row">
<a class="button" href="index.html">Lihat daftar quiz</a>
</div>`;
}else{
  const percent=data.total?Math.round(data.earned/data.total*100):0;

  resultEl.innerHTML=`
<span class="eyebrow-tag">Hasil quiz</span>
<h1>${escapeHtml(data.title)}</h1>
${renderRing(percent)}
<p class="result-message">${scoreMessage(percent)}</p>
<div class="button-row">
${data.quizId?`<a class="button ghost" href="quiz.html?id=${encodeURIComponent(data.quizId)}">Ulangi quiz</a>`:''}
<a class="button" href="index.html">Kembali ke daftar quiz</a>
</div>`;

  requestAnimationFrame(()=>{
    const ring=document.querySelector('.score-ring .fill');
    if(ring)ring.style.strokeDashoffset=ring.dataset.targetOffset;
  });

  if(Array.isArray(data.breakdown)&&data.breakdown.length){
    reviewEl.innerHTML=`
<div class="review-list">
${data.breakdown.map((item,i)=>`
<div class="review-item ${item.correct?'correct':'wrong'}">
<div class="status-dot">${item.correct?'✓':'✕'}</div>
<div class="review-item-body">
<div class="review-item-top">
<span class="rq-number">Soal ${i+1}</span>
<span class="rq-points">${item.earnedPoints} / ${item.points} poin</span>
</div>
<p>${escapeHtml(item.question)}</p>
</div>
</div>`).join('')}
</div>`;
  }
}

function escapeHtml(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
