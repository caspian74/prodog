/* Pro-Dog Estética Canina — interacciones */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '526634321465';

  // ---------- Entrada del hero ----------
  const start = () => requestAnimationFrame(() => root.classList.add('loaded'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(start);
  } else start();

  // ---------- Nav con fondo al hacer scroll + dock móvil ----------
  const nav = document.getElementById('nav');
  const dock = document.getElementById('dock');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    dock.classList.toggle('show', y > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Burbujas que se pueden reventar ----------
  const field = document.getElementById('bubbles');
  if (field && !reduce) {
    const hero = field.parentElement;
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

    const spawn = () => {
      if (!visible || document.hidden) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bubble';
      b.tabIndex = -1;
      b.setAttribute('aria-hidden', 'true');
      const d = 18 + Math.random() * 54;
      b.style.setProperty('--d', d + 'px');
      b.style.setProperty('--t', (9 + Math.random() * 9).toFixed(1) + 's');
      b.style.left = (Math.random() * 100) + '%';
      b.addEventListener('animationend', (ev) => { if (ev.animationName === 'rise' || ev.animationName === 'pop') b.remove(); });
      const popIt = (ev) => {
        if (b.classList.contains('pop')) return;
        const cs = getComputedStyle(b);
        b.style.setProperty('--pos', cs.transform === 'none' ? 'translate(0,0)' : cs.transform);
        b.style.marginLeft = cs.marginLeft;
        b.classList.add('pop');
        splash(ev, d);
      };
      b.addEventListener('pointerdown', popIt);
      b.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse' && Math.random() < 0.35) popIt(ev); });
      field.appendChild(b);
    };

    const splash = (ev, d) => {
      const r = field.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      const n = 8;
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span');
        s.className = 'splash';
        const a = (Math.PI * 2 * i) / n;
        const dist = d * 0.6 + Math.random() * 18;
        s.style.left = x + 'px'; s.style.top = y + 'px';
        s.style.setProperty('--x', Math.cos(a) * dist + 'px');
        s.style.setProperty('--y', Math.sin(a) * dist + 'px');
        s.addEventListener('animationend', () => s.remove());
        field.appendChild(s);
      }
    };

    for (let i = 0; i < 7; i++) setTimeout(spawn, 600 + i * 380);
    setInterval(spawn, 900);
  }

  // ---------- Calculadora de precios ----------
  const PRICES = {
    bano:  { c: 300, m: 400, g: 500, eg: 600 },
    corte: { c: 400, m: 500, g: 600, eg: 700 }
  };
  const LABEL = {
    size: { c: 'perro chico', m: 'perro mediano', g: 'perro grande', eg: 'perro extra grande' },
    service: { bano: 'baño', corte: 'baño y corte' }
  };
  const calc = document.getElementById('calc');
  if (calc) {
    const seg = calc.querySelector('.seg');
    const priceEl = document.getElementById('price');
    const priceBox = priceEl.parentElement;
    const fromEl = document.getElementById('from');
    const cta = document.getElementById('calc-cta');
    const ctaTxt = document.getElementById('calc-cta-txt');
    const state = { service: 'bano', size: 'c' };
    let shown = 300, raf;

    const countTo = (to) => {
      cancelAnimationFrame(raf);
      if (reduce) { priceEl.textContent = to; shown = to; return; }
      const from = shown, t0 = performance.now(), dur = 420;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        shown = Math.round(from + (to - from) * e);
        priceEl.textContent = shown;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      priceBox.classList.remove('bump'); void priceBox.offsetWidth; priceBox.classList.add('bump');
    };

    const render = () => {
      const val = PRICES[state.service][state.size];
      countTo(val);
      fromEl.hidden = state.size !== 'eg';
      seg.dataset.active = state.service;
      const svc = LABEL.service[state.service];
      const size = LABEL.size[state.size];
      ctaTxt.textContent = `Agendar ${svc} para ${size}`;
      const msg = `Hola Pro-Dog, quiero agendar ${svc} para ${size}. ¿Qué horario tienen disponible?`;
      cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    };

    const bindGroup = (selector, key, attr) => {
      const btns = [...calc.querySelectorAll(selector)];
      btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.setAttribute('aria-checked', String(b === btn)));
          state[key] = btn.dataset[attr];
          render();
        });
        btn.addEventListener('keydown', (e) => {
          const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          const next = btns[(i + dir + btns.length) % btns.length];
          next.focus(); next.click();
        });
      });
    };
    bindGroup('.seg button', 'service', 'service');
    bindGroup('.sizes button', 'size', 'size');
    render();
  }

  // ---------- Revelados al hacer scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.prints .print').forEach((p, i) => p.style.setProperty('--delay', (i % 3) * 0.09 + 's'));
    document.querySelectorAll('.chat .msg').forEach((m, i) => m.style.setProperty('--delay', i * 0.12 + 's'));
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---------- Lightbox ----------
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (lb && typeof lb.showModal === 'function') {
    document.querySelectorAll('.print__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        lbImg.src = btn.dataset.full;
        lbImg.alt = img.alt;
        lb.showModal();
      });
    });
    document.getElementById('lightbox-close').addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  } else {
    document.querySelectorAll('.print__btn').forEach((btn) => {
      btn.addEventListener('click', () => window.open(btn.dataset.full, '_blank'));
    });
  }

  // ---------- Copiar dirección ----------
  const copy = document.getElementById('copy');
  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        copy.textContent = 'Dirección copiada';
      } catch {
        copy.textContent = 'No se pudo copiar, selecciónala a mano';
      }
      copy.classList.add('done');
      setTimeout(() => { copy.textContent = 'Copiar dirección'; copy.classList.remove('done'); }, 2200);
    });
  }

  // ---------- Año ----------
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
