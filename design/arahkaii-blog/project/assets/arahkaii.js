/* ============================================================
   ARAHKAII — shared chrome + motion + features
   Injects nav / progress / search / footer, wires motion,
   save/reading-list, subscriber memory, client-side search.
   Per-page config via <body data-cat data-nofoot data-overhero data-nochrome>
   ============================================================ */
(function(){
  const body = document.body;
  const cfg = {
    cat: body.dataset.cat || '',
    overHero: body.hasAttribute('data-overhero'),
    noFoot: body.hasAttribute('data-nofoot'),
    noChrome: body.hasAttribute('data-nochrome'),
  };

  const CATS = ['Style','Dining','Travel','Culture','Living','People','Guides'];
  const HREF = {
    Style:'style.html', Dining:'index.html', Travel:'index.html', Culture:'index.html',
    Living:'index.html', People:'author-nadra-nichols.html', Guides:'guide-halal-fine-dining.html'
  };

  /* ---------- ARTICLE INDEX (drives search / latest / read-next / most-read) ---------- */
  const ARTICLES = [
    {t:'The quiet renaissance of Korean heritage brands', c:'Style', a:'Nadra Nichols', h:'article.html', tone:'tone-c', d:'2026-05-16', r:6, pop:1},
    {t:'The 10 best halal fine-dining rooms in Singapore', c:'Guides', a:'Farah Idris', h:'guide-halal-fine-dining.html', tone:'tone-d', d:'2026-06-02', r:11, pop:2},
    {t:'A slow morning in Kyoto\u2019s northern hills', c:'Travel', a:'Yusra Rahman', h:'article.html', tone:'tone-b', d:'2026-05-28', r:7, pop:3},
    {t:'Inside a collector\u2019s light-filled Jakarta home', c:'Living', a:'Daniyal Osman', h:'article.html', tone:'tone-d', d:'2026-05-24', r:8, pop:6},
    {t:'The calligrapher reviving a lost hand', c:'People', a:'Sana Mahmood', h:'author-nadra-nichols.html', tone:'tone-c', d:'2026-05-20', r:9, pop:7},
    {t:'Seoul\u2019s new guard of modest tailoring', c:'Style', a:'Nadra Nichols', h:'article.html', tone:'tone-c', d:'2026-04-28', r:6, pop:4},
    {t:'The house that was built around a single window', c:'Living', a:'Daniyal Osman', h:'article.html', tone:'tone-d', d:'2026-05-10', r:14, pop:5},
    {t:'The new grammar of covered dressing', c:'Style', a:'Sana Mahmood', h:'article.html', tone:'tone-b', d:'2026-02-26', r:7, pop:9},
    {t:'A weaver\u2019s archive, reopened in Kyoto', c:'Style', a:'Imran Yusof', h:'article.html', tone:'tone-d', d:'2026-04-12', r:5},
    {t:'An afternoon inside a single-origin tearoom', c:'Dining', a:'Hana Sulaiman', h:'article.html', tone:'tone-d', d:'2026-05-06', r:6, pop:8},
    {t:'The blue cities of Uzbekistan, off-season', c:'Travel', a:'Daniyal Osman', h:'article.html', tone:'tone-b', d:'2026-04-30', r:10},
    {t:'The mosque that learned to hold silence', c:'Culture', a:'Sana Mahmood', h:'article.html', tone:'tone-c', d:'2026-03-22', r:8},
    {t:'A coat to keep for twenty winters', c:'Style', a:'Farah Idris', h:'article.html', tone:'tone-c', d:'2026-03-30', r:5},
    {t:'The last indigo dyer of West Java', c:'Culture', a:'Hana Sulaiman', h:'article.html', tone:'tone-d', d:'2026-03-12', r:9},
  ];
  const fmtDate = (iso)=>{ const m=['January','February','March','April','May','June','July','August','September','October','November','December']; const p=iso.split('-'); return parseInt(p[2])+' '+m[parseInt(p[1])-1]+' '+p[0]; };
  window.ARAHKAII = window.ARAHKAII || {};
  window.ARAHKAII.articles = ARTICLES;
  window.ARAHKAII.fmtDate = fmtDate;

  /* ---------- SAVE / READING LIST ---------- */
  const SKEY='arahkaii:saved';
  const getSaved=()=>{ try{ return JSON.parse(localStorage.getItem(SKEY))||[]; }catch(e){ return []; } };
  const setSaved=(a)=>{ try{ localStorage.setItem(SKEY, JSON.stringify(a)); }catch(e){} updateSavedBadge(); };
  const isSaved=(title)=> getSaved().some(x=>x.title===title);
  const toggleSave=(item)=>{ const a=getSaved(); const i=a.findIndex(x=>x.title===item.title); let on; if(i>=0){ a.splice(i,1); on=false; } else { a.unshift(item); on=true; } setSaved(a); return on; };
  function updateSavedBadge(){ const b=document.querySelector('.js-saved-count'); if(b){ const n=getSaved().length; b.textContent=n; b.style.display=n?'flex':'none'; } }
  Object.assign(window.ARAHKAII, { getSaved, setSaved, isSaved, toggleSave });

  /* ---------- SUBSCRIBER MEMORY ---------- */
  const SUBKEY='arahkaii:subscribed';
  const isSubscribed=()=> { try{ return !!localStorage.getItem(SUBKEY); }catch(e){ return false; } };
  const subscribedMarkup='<span class="news-done"><span class="nd-tick">\u2713</span> You\u2019re subscribed. See you Sunday.</span>';
  function renderSubscribedForms(){ document.querySelectorAll('.js-news').forEach(form=>{ const field=form.querySelector('.field'); if(field && !field.dataset.locked){ field.dataset.locked='1'; field.classList.add('done'); field.innerHTML=subscribedMarkup; } const note=form.querySelector('.field-note'); if(note) note.textContent='Manage your preferences anytime.'; }); }

  const wordmark = (cls='') => `
    <a class="wordmark ${cls}" href="index.html" aria-label="Arahkaii — home">
      <svg viewBox="0 0 168 18" role="img" aria-label="ARAHKAII">
        <text x="0" y="14" font-family="Fraunces, Georgia, serif" font-size="17"
          font-weight="500" letter-spacing="3.4" fill="#1C1815"
          style="font-variation-settings:'opsz' 40">ARAHKAII</text>
      </svg>
    </a>`;

  const ICON = {
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 8h16M4 16h16"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg>'
  };

  /* ---- skip link ---- */
  if(!cfg.noChrome){
    const skip=document.createElement('a'); skip.className='skip-link'; skip.href='#main'; skip.textContent='Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
    const m=document.querySelector('main,article,.manifesto,.sub-wrap'); if(m && !m.id) m.id='main';
  }

  /* ---- inject chrome ---- */
  if(!cfg.noChrome){
    const prog = document.createElement('div'); prog.className='progress'; document.body.appendChild(prog);

    const nav = document.createElement('header');
    nav.className = 'nav' + (cfg.overHero ? ' over' : ' solid');
    nav.innerHTML = `
      <div class="nav-inner">
        ${wordmark()}
        <nav class="nav-links">
          ${CATS.map(c=>`<a href="${HREF[c]}" ${c===cfg.cat?'class="active"':''}>${c}</a>`).join('')}
        </nav>
        <div class="nav-tools">
          <button class="icon-btn js-search" aria-label="Search">${ICON.search}</button>
          <a class="icon-btn nav-saved" href="reading-list.html" aria-label="Reading list">${ICON.bookmark}<span class="js-saved-count saved-badge"></span></a>
          <a class="icon-btn nav-mail" href="subscribe.html" aria-label="Newsletter">${ICON.mail}</a>
          <button class="icon-btn nav-burger js-burger" aria-label="Menu">${ICON.menu}</button>
        </div>
      </div>
      <div class="mobile-menu">
        ${CATS.map(c=>`<a href="${HREF[c]}">${c}</a>`).join('')}
        <a href="latest.html">Latest</a><a href="reading-list.html">Reading list</a>
        <a href="about.html">About</a><a href="subscribe.html">Subscribe</a>
      </div>`;
    document.body.insertBefore(nav, document.body.firstChild);

    const ov = document.createElement('div');
    ov.className='search-overlay';
    ov.innerHTML = `
      <div class="search-top"><button class="icon-btn js-search-close" aria-label="Close">${ICON.x}</button></div>
      <div class="search-body">
        <span class="eyebrow">Search the archive</span>
        <label><input class="search-input" type="text" placeholder="What are you looking for?" autocomplete="off"></label>
        <div class="search-sugs">
          ${['K-Fashion','Heritage','Dining','Kyoto','Modest','Living','Culture','Travel'].map(s=>`<button class="chip">${s}</button>`).join('')}
        </div>
        <div class="search-results" hidden></div>
      </div>`;
    document.body.appendChild(ov);

    /* search behaviour */
    const input=ov.querySelector('.search-input');
    const results=ov.querySelector('.search-results');
    const sugs=ov.querySelector('.search-sugs');
    const open=()=>{ ov.classList.add('open'); setTimeout(()=>input.focus(),120); };
    const close=()=> ov.classList.remove('open');
    function runSearch(q){
      q=(q||'').trim().toLowerCase();
      if(!q){ results.hidden=true; sugs.hidden=false; results.innerHTML=''; return; }
      sugs.hidden=true; results.hidden=false;
      const hits=ARTICLES.filter(x=> (x.t+' '+x.c+' '+x.a).toLowerCase().includes(q)).slice(0,7);
      results.innerHTML = hits.length ? hits.map(x=>`
        <a class="sr-item" href="${x.h}">
          <span class="sr-cat">${x.c}</span>
          <span class="sr-title">${x.t}</span>
          <span class="sr-meta">${x.a} · ${fmtDate(x.d)}</span>
        </a>`).join('') : `<p class="sr-empty">No stories yet for \u201c${q}\u201d. Try a category, an author, or a place.</p>`;
    }
    nav.querySelector('.js-search').addEventListener('click',open);
    ov.querySelector('.js-search-close').addEventListener('click',close);
    input.addEventListener('input',()=>runSearch(input.value));
    sugs.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{ input.value=c.textContent; runSearch(c.textContent); input.focus(); }));
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
    ov.addEventListener('click',e=>{ if(e.target===ov) close(); });

    /* mobile menu */
    const mm = nav.querySelector('.mobile-menu');
    nav.querySelector('.js-burger').addEventListener('click',()=>{
      const isOpen = mm.classList.toggle('open');
      nav.querySelector('.js-burger').innerHTML = isOpen ? ICON.x : ICON.menu;
      if(isOpen) nav.classList.add('solid');
    });

    if(cfg.overHero){
      const onScroll=()=>{ if(window.scrollY>40){ nav.classList.remove('over'); nav.classList.add('solid'); } else { nav.classList.add('over'); nav.classList.remove('solid'); } };
      onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
    }
    updateSavedBadge();
  }

  /* ---- footer ---- */
  if(!cfg.noFoot){
    const f = document.createElement('footer');
    f.className='footer';
    f.innerHTML = `<div class="wrap">
      <div class="footer-grid">
        <div class="mast">
          ${wordmark()}
          <p class="epigraph" style="font-size:18px; margin:20px 0 0; max-width:240px">Asia's modern-luxury edit — modestly told.</p>
        </div>
        <div><h4>Editorial</h4><ul>
          <li><a href="latest.html">Latest</a></li><li><a href="style.html">Style</a></li>
          <li><a href="index.html">Travel</a></li><li><a href="index.html">Culture</a></li>
          <li><a href="guide-halal-fine-dining.html">Guides</a></li></ul></div>
        <div><h4>About</h4><ul>
          <li><a href="about.html">Our story</a></li><li><a href="author-nadra-nichols.html">Contributors</a></li>
          <li><a href="subscribe.html">Newsletter</a></li><li><a href="pipeline.html">How we publish</a></li></ul></div>
        <div><h4>Follow</h4><ul>
          <li><a href="reading-list.html">Reading list</a></li><li><a href="index.html">Instagram</a></li>
          <li><a href="index.html">X / Twitter</a></li><li><a href="index.html">RSS</a></li></ul></div>
      </div>
      <div class="rule" style="margin-top:48px"></div>
      <div class="footer-base">
        <span class="meta">© 2026 Arahkaii. All rights reserved.</span>
        <span class="meta">Made in Singapore · 4200K</span>
      </div>
    </div>`;
    document.body.appendChild(f);
  }

  /* ---- progress bar ---- */
  const prog = document.querySelector('.progress');
  if(prog){
    const upd=()=>{ const h=document.documentElement.scrollHeight-window.innerHeight; prog.style.width = (h>0?(window.scrollY/h*100):0)+'%'; };
    upd(); window.addEventListener('scroll',upd,{passive:true}); window.addEventListener('resize',upd);
  }

  /* ---- inject save buttons on story cards ---- */
  function injectSaves(){
    document.querySelectorAll('.story').forEach(card=>{
      const img=card.querySelector('.img'); const head=card.querySelector('.headline');
      if(!img || !head || img.querySelector('.save-btn')) return;
      const title=head.textContent.trim();
      const href=card.getAttribute('href')||'article.html';
      const tone=(img.className.match(/tone-\w/)||['tone-b'])[0];
      const byEl=card.querySelector('.byline'); const byline=byEl?byEl.textContent.trim():'';
      const btn=document.createElement('span');
      btn.className='save-btn'+(isSaved(title)?' on':'');
      btn.setAttribute('role','button'); btn.setAttribute('tabindex','0');
      btn.setAttribute('aria-label','Save for later');
      btn.innerHTML=ICON.bookmark;
      const act=(e)=>{ e.preventDefault(); e.stopPropagation(); const on=toggleSave({title,href,tone,byline}); btn.classList.toggle('on',on); toast(on?'Saved to your reading list':'Removed from your reading list'); };
      btn.addEventListener('click',act);
      btn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') act(e); });
      img.appendChild(btn);
    });
  }
  injectSaves();

  /* ---- toast ---- */
  let toastEl;
  function toast(msg){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.classList.add('show');
    clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1800);
  }
  window.ARAHKAII.toast=toast;

  /* ---- blur-up + rise via IntersectionObserver ---- */
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{ rootMargin:'0px 0px -8% 0px', threshold:.08 });
  const observe=()=> document.querySelectorAll('.blurup:not(.in),.rise:not(.in)').forEach(el=>io.observe(el));
  observe();
  window.ARAHKAII.observe=observe;

  /* ---- subscriber memory ---- */
  if(isSubscribed()) renderSubscribedForms();

  /* ---- page cross-fade ---- */
  const reveal=()=> body.classList.add('ready');
  requestAnimationFrame(reveal);
  setTimeout(reveal, 60);
  document.addEventListener('click',e=>{
    const a = e.target.closest && e.target.closest('a[href]');
    if(!a) return;
    if(a.closest('.save-btn')) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || a.target==='_blank' || e.metaKey || e.ctrlKey) return;
    if(href.endsWith('.html') || href==='index.html'){
      e.preventDefault();
      body.classList.add('leaving');
      setTimeout(()=>{ window.location.href = href; }, 360);
    }
  });
  window.addEventListener('pageshow',e=>{ if(e.persisted){ body.classList.remove('leaving'); body.classList.add('ready'); } });

  /* ---- newsletter field (delegated) ---- */
  document.addEventListener('submit',e=>{
    const form = e.target.closest('.js-news');
    if(!form) return;
    e.preventDefault();
    const field = form.querySelector('.field'); const input = form.querySelector('input');
    const v = (input.value||'').trim();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    let note = form.querySelector('.field-note');
    if(!ok){ if(note){ note.textContent='Please enter a valid email address.'; note.style.color='var(--clay)'; } input.focus(); return; }
    try{ localStorage.setItem(SUBKEY, v); }catch(err){}
    field.classList.add('done'); field.dataset.locked='1';
    field.innerHTML = subscribedMarkup;
    if(note){ note.textContent='A confirmation is on its way to '+v+'.'; note.style.color='var(--muted)'; }
    setTimeout(renderSubscribedForms, 50);
  });

})();
