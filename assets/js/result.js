const result=document.getElementById('result');
const data=JSON.parse(sessionStorage.getItem('quizResult')||'null');

if(!data){
result.innerHTML='<h1>Belum ada hasil</h1><p class="result-info">Kerjakan quiz terlebih dahulu.</p><a class="button" href="index.html">Kembali</a>';
}else{
const percent=data.total?Math.round(data.earned/data.total*100):0;
result.innerHTML=`
<p class="eyebrow">HASIL QUIZ</p>
<h1>${escapeHtml(data.title)}</h1>
<div class="score">${data.earned}<small> / ${data.total}</small></div>
<p class="result-info">Kamu memperoleh <b>${data.earned}</b> daripada <b>${data.total}</b> poin (${percent}%).</p>
<a class="button" href="index.html">Kembali ke Daftar Quiz</a>`;
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
