/* ============ EDIT THIS BLOCK ============
 Paste any Google Drive / Docs / Slides share link (Share > "Anyone with the link: Viewer").
 Local paths like "images/gallery1.jpg" also work. */
const CONFIG={
  profilePhoto:"images/profile.jpg",
  gallery:[
    "images/gallery1.jpg","images/gallery2.jpg","images/gallery3.jpg","images/gallery4.jpg","images/gallery5.jpg"
    // ,{url:"https://drive.google.com/file/d/FILE_ID/view",caption:"Conference 2026"}
  ],
  collaborations:[
    // {title:"Joint study with University X",desc:"Vocabulary and AI",url:"https://..."},
  ],
  library:[
    // {title:"Vlogging study slides",desc:"THAITESOL 2026",url:"https://docs.google.com/presentation/d/ID/edit"},
    // {title:"Course syllabus",desc:"Business English L&S II",url:"https://drive.google.com/file/d/ID/view"},
    // {title:"Teaching materials",desc:"Shared folder",url:"https://drive.google.com/drive/folders/ID"},
  ]
};
/* ========================================= */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get('lang')||'en';
const PAGES=[['index.html','Home','หน้าแรก'],['profile.html','Profile','ประวัติ'],['publications.html','Publications','ผลงาน'],['classes.html','Classes','การสอน'],['projects.html','Projects','โครงการและสื่อ']];
const here=location.pathname.split('/').pop()||'index.html';
document.body.insertAdjacentHTML('afterbegin',`<header class="top"><div class="wrap"><a class="brand" href="index.html"><b>Santhoshkanth Kamaraj</b><span data-th="งานวิชาการและงานวิจัย">Academic work &amp; research</span></a><nav aria-label="Main">${PAGES.map(([h,e,t])=>`<a href="${h}" data-th="${t}"${h===here?' aria-current="page"':''}>${e}</a>`).join('')}</nav><div class="ctl"><button id="lang" aria-label="Switch language">TH</button><button id="theme" aria-label="Toggle dark mode">Dark</button></div></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap">© 2026 Santhoshkanth Kamaraj · Roi Et Rajabhat University</div></footer><div class="toast" id="toast" role="status"></div>`);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1800)};
const copy=(x,m)=>navigator.clipboard.writeText(x).then(()=>toast(m)).catch(()=>toast(x));
/* theme + language */
function setTheme(t){document.documentElement.dataset.theme=t;store.set('theme',t);$('#theme').textContent=t==='dark'?'Light':'Dark'}
setTheme(store.get('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
$$('[data-th]').forEach(e=>e.dataset.en=e.textContent);
function setLang(l){lang=l;store.set('lang',l);document.documentElement.lang=l;$$('[data-th]').forEach(e=>e.textContent=l==='th'?e.dataset.th:e.dataset.en);$('#lang').textContent=l==='th'?'EN':'TH';window.renderLib&&renderLib(libF);window.renderCol&&renderCol()}
$('#lang').onclick=()=>setLang(lang==='th'?'en':'th');
/* citations + email copy */
$$('.copy').forEach(b=>b.onclick=()=>copy(b.dataset.cite,lang==='th'?'คัดลอกแล้ว':'Citation copied'));
$$('[data-mail]').forEach(b=>b.onclick=()=>copy('santhoshkanth88@reru.ac.th',lang==='th'?'คัดลอกอีเมลแล้ว':'Email copied'));
/* publication filter */
$('#pubTabs')&&($('#pubTabs').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;$$('#pubTabs .chip').forEach(x=>x.classList.toggle('on',x===b));$$('.pub').forEach(p=>p.hidden=!(b.dataset.f==='all'||p.dataset.tags.split(' ').includes(b.dataset.f)))});
/* counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const n=+e.target.dataset.n;let t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/900,1);e.target.textContent=Math.round(n*p);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}));
$$('[data-n]').forEach(e=>co.observe(e));
/* ---- Google Drive helpers ---- */
const idOf=u=>((u.match(/\/d\/([\w-]{10,})/)||u.match(/[?&]id=([\w-]{10,})/)||u.match(/folders\/([\w-]{10,})/)||[])[1]);
const isDrive=u=>/(drive|docs)\.google\.com/.test(u);
function norm(it,force){
  if(typeof it==='string')it={url:it};const u=it.url,d=isDrive(u),id=d?idOf(u):null;let k=force||it.type;
  if(!k)k=!d?(/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(u)?'image':'document'):/presentation\//.test(u)?'presentation':/folders\//.test(u)?'folder':'document';
  let embed=u,thumb=null,dl=null,alt=null;
  if(d&&id){
    embed=/presentation\//.test(u)?`https://docs.google.com/presentation/d/${id}/embed`:/spreadsheets\//.test(u)?`https://docs.google.com/spreadsheets/d/${id}/preview`:/document\//.test(u)?`https://docs.google.com/document/d/${id}/preview`:k==='folder'?`https://drive.google.com/embeddedfolderview?id=${id}#grid`:`https://drive.google.com/file/d/${id}/preview`;
    if(k!=='folder'){const w=k==='image'?1600:600;thumb=`https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;alt=`https://lh3.googleusercontent.com/d/${id}=w${w}`;dl=`https://drive.google.com/uc?export=download&id=${id}`}
  }else if(k==='image')thumb=u;
  return{...it,k,embed,thumb,alt,dl,open:u};
}
function img(src,alt,fb){const i=new Image();i.loading='lazy';i.alt=alt||'';i.src=src;i.onerror=()=>{if(fb&&i.src!==fb){i.src=fb;fb=null}else{i.remove();i.dispatchEvent(new Event('failed'))}};return i}
/* profile photo */
if($('#photo')){const p=norm({url:CONFIG.profilePhoto},'image'),im=img(p.thumb,'Portrait of Santhoshkanth Kamaraj',p.alt);im.loading='eager';im.onload=()=>{$('#photo').textContent='';$('#photo').append(im)}}
/* viewer + library + gallery (projects page) */
let libF='all';
if($('#libGrid')){
  document.body.insertAdjacentHTML('beforeend',`<dialog id="viewer" aria-labelledby="vt"><div class="vh"><h3 id="vt"></h3><a class="btn" id="vOpen" target="_blank" rel="noopener">Open in Drive</a><a class="btn" id="vDl" target="_blank" rel="noopener">Download</a><button class="btn" id="vClose">Close</button></div><div class="vb" id="vb"></div></dialog>`);
  const V=$('#viewer');let set=[],pos=0;
  const show=()=>{const it=set[pos],vb=$('#vb');vb.textContent='';$('#vt').textContent=it.title||it.caption||'';$('#vOpen').href=it.open;$('#vDl').href=it.dl||'#';$('#vDl').style.display=it.dl?'':'none';
    if(it.k==='image'){const i=img(it.thumb,it.title||it.caption,it.alt);i.loading='eager';vb.append(i)}else{const f=document.createElement('iframe');f.src=it.embed;f.title=it.title||'';f.allowFullscreen=true;vb.append(f)}
    if(set.length>1&&it.k==='image')[['p','‹',-1],['n','›',1]].forEach(([c,t,s])=>{const b=document.createElement('button');b.className='nv '+c;b.textContent=t;b.setAttribute('aria-label',s<0?'Previous':'Next');b.onclick=()=>{pos=(pos+s+set.length)%set.length;show()};vb.append(b)})};
  const open=(items,i)=>{set=items;pos=i;show();V.showModal()};
  $('#vClose').onclick=()=>V.close();V.onclose=()=>$('#vb').textContent='';V.onclick=e=>{if(e.target===V)V.close()};
  V.onkeydown=e=>{if(set[pos]?.k!=='image'||set.length<2)return;if(e.key==='ArrowRight'){pos=(pos+1)%set.length;show()}if(e.key==='ArrowLeft'){pos=(pos-1+set.length)%set.length;show()}};
  const L={presentation:['Presentation','สไลด์'],document:['Document','เอกสาร'],folder:['Folder','โฟลเดอร์']};
  const lib=CONFIG.library.map(l=>norm(l)),gal=CONFIG.gallery.map(g=>norm(g,'image'));
  window.renderLib=(f='all')=>{const g=$('#libGrid');g.textContent='';const list=lib.filter(l=>f==='all'||l.k===f),th=lang==='th'?1:0;
    if(!list.length){g.innerHTML='<div class="empty"></div>';$('.empty',g).textContent=th?'ยังไม่มีรายการในหมวดนี้':'Nothing here yet. Materials will appear as they are added.';return}
    list.forEach(l=>{const c=document.createElement('button');c.className='card';const t=document.createElement('div');t.className='thumb';t.textContent=L[l.k][th];
      if(l.thumb){const im=img(l.thumb,'',l.alt);im.onload=()=>{t.textContent='';t.append(im)}}
      const b=document.createElement('div');b.className='b';b.innerHTML='<span class="badge"></span><h3></h3><p></p>';$('.badge',b).textContent=L[l.k][th];$('h3',b).textContent=l.title||'Untitled';$('p',b).textContent=l.desc||'';
      c.append(t,b);c.onclick=()=>open(list,list.indexOf(l));g.append(c)})};
  const col=CONFIG.collaborations||[];
  window.renderCol=()=>{const g=$('#colGrid'),th=lang==='th'?1:0;g.textContent='';
    if(!col.length){const e=document.createElement('div');e.className='empty';e.textContent=th?'รายการความร่วมมือจะแสดงที่นี่':'Collaborations will be listed here.';g.append(e);return}
    col.forEach(c=>{const a=document.createElement(c.url?'a':'div');a.className='card';if(c.url){a.href=c.url;a.target='_blank';a.rel='noopener'}
      a.innerHTML='<div class="b"><h3></h3><p></p></div>';$('h3',a).textContent=c.title||'';$('p',a).textContent=c.desc||'';g.append(a)})};
  if(!lib.length)$('#libTabs').style.display='none';
  $('#libTabs').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;libF=b.dataset.f;$$('#libTabs .chip').forEach(x=>x.classList.toggle('on',x===b));renderLib(libF)};
  gal.forEach((g,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',g.caption||'Open photo '+(i+1));const im=img(g.thumb,g.caption||'Photo '+(i+1),g.alt);im.addEventListener('failed',()=>b.remove());b.append(im);b.onclick=()=>open(gal,i);$('#galGrid').append(b)});
  if(!gal.length)$('#galSec').remove();
}
setLang(lang);
