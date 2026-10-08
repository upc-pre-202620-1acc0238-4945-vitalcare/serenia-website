import './styles.css';
import './motion.css';
import { dict } from './i18n.js';
import { templates } from './templates.js';

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } },
};

const state = {
  wEmail: '', wStatus: 'idle', feat: 0, lang: storage.get('serenia-lang') || 'es',
  step: 0, annual: true, open: 0, mood: 0, scrolled: false, progress: 0, active: '',
};

const setState = (patch) => {
  Object.assign(state, typeof patch === 'function' ? patch(state) : patch);
  render();
};

/* ---------- Content data (Spanish source) ---------- */

const MOODS = [
  { label: 'Muy bien', dot: '#6FB39A', title: 'Hoy se siente muy bien', note: '“Desayuné con la vecina.”' },
  { label: 'Bien', dot: '#A8CDB0', title: 'Hoy se siente bien', note: '“Salí a caminar un rato.”' },
  { label: 'Regular', dot: '#F2C894', title: 'Hoy se siente regular', note: '“Un poco cansada.”' },
  { label: 'No muy bien', dot: '#E8896B', title: 'Hoy no se siente muy bien', note: '“Extraño a todos.”' },
];

const NAV = [['como', 'Cómo funciona'], ['familia', 'Para quién'], ['funciones', 'Funciones'], ['planes', 'Planes']];

const ATTRS = [
  { t: 'Sencilla', d: 'Pocos pasos, sin tecnicismos.' },
  { t: 'Cálida', d: 'Lenguaje amable, nada clínico.' },
  { t: 'Discreta', d: 'Acompaña sin invadir.' },
  { t: 'Confiable', d: 'El estado del día, claro a distancia.' },
];

const STEPS = [
  ['1', 'Cuenta cómo está', 'Un toque en el check-in diario. Si quiere, deja una nota o un audio.'],
  ['2', 'Su familia lo ve', 'El círculo de cuidado recibe el estado del día y responde con cariño.'],
  ['3', 'Una sugerencia a tiempo', 'Si el malestar se sostiene, Serenia te dice cómo acompañar.'],
];
const STEP_PANEL_BG = ['#E3EEE4', '#F6E3C8', '#DCEADF'];

const FEATURES = [
  { d: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01', c: '#17695F', bg: '#E3EEE4', t: 'Check-in diario',
    long: 'Un toque al día para decir cómo amaneció. Sin escribir, sin menús, sin complicarse.', plan: 'Plan Básico y Familia' },
  { d: 'M4 7V4h16v3 M9 20h6 M12 4v16', c: '#8A4A1E', bg: '#F6E3C8', t: 'Modo simplificado',
    long: 'Un saludo, cuatro opciones y nada más en pantalla. Letra grande, contraste alto y botones amplios.', plan: 'Plan Básico y Familia' },
  { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3', c: '#17695F', bg: '#E3EEE4', t: 'Notas y mensajes de audio',
    long: 'Si quiere contar más, lo hace con su propia voz. La familia escucha cuando puede.', plan: 'Limitados en Básico · Ilimitados en Familia' },
  { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', c: '#8A4A1E', bg: '#F6E3C8', t: 'Círculo de cuidado',
    long: 'Hijos, nietos, vecinos y cuidadores ven el estado del día y responden con un mensaje o un audio.', plan: '1 familiar en Básico · hasta 5 en Familia' },
  { d: 'M22 12h-4l-3 9L9 3l-3 9H2', c: '#17695F', bg: '#E3EEE4', t: 'Patrones de bienestar',
    long: 'Serenia distingue un mal día de un malestar que se sostiene, y también celebra cuando hay mejoría.', plan: 'Plan Familia' },
  { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4', c: '#8A4A1E', bg: '#F6E3C8', t: 'Sugerencias para el familiar',
    long: 'Cuando hace falta, recibes una idea concreta y amable: una llamada corta, un audio, una visita.', plan: 'Plan Familia' },
  { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', c: '#17695F', bg: '#E3EEE4', t: 'Pequeños logros',
    long: 'Pequeñas metas del día a día, como salir a caminar o comer con alguien, que se celebran en familia.', plan: 'Básico en el plan gratis · Completo en Familia' },
  { d: 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M4.93 4.93l4.24 4.24 M14.83 9.17l4.24-4.24 M14.83 14.83l4.24 4.24 M9.17 14.83l-4.24 4.24', c: '#8A4A1E', bg: '#F6E3C8', t: 'Botón de ayuda siempre visible',
    long: 'Siempre a la vista, en todas las pantallas. Un toque avisa a su círculo de cuidado.', plan: 'Plan Básico y Familia' },
  { d: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 16l2 2 4-4', c: '#17695F', bg: '#E3EEE4', t: 'Resumen del día',
    long: 'Cada día, un resumen claro de cómo estuvo, para que la familia no tenga que preguntar.', plan: 'Plan Básico y Familia' },
];

const TRUST = ['Compartes solo el estado del día', 'Alertas solo ante malestar sostenido', 'Tú eliges quién está en el círculo'];
const BASIC_LIST = ['Check-in diario', 'Estado visible para 1 familiar', 'Botón de ayuda', 'Mensajes de audio limitados', 'Historial de los últimos 7 días', 'Logros y resumen semanal básico'];
const FAMILY_LIST = ['Todo lo del plan Básico', 'Hasta 5 familiares en el círculo', 'Mensajes de audio ilimitados', 'Historial completo de bienestar', 'Sugerencias de acompañamiento', 'Alertas por malestar sostenido', 'Logros y resumen semanal completo'];

const FAQS = [
  ['¿Mi mamá necesita saber usar bien el celular?', 'No. El modo simplificado tiene letra grande, cuatro opciones y un botón de ayuda siempre visible. Basta un toque al día.'],
  ['¿Qué pasa si tiene un mal día?', 'Nada se alarma. Serenia solo sugiere acompañamiento cuando detecta un malestar sostenido en varios días.'],
  ['¿Quién ve su información?', 'Solo las personas que ella o él invita a su círculo de cuidado. Se comparte el estado del día, no sus conversaciones privadas.'],
  ['¿Puedo cancelar la suscripción?', 'Sí, cuando quieras. El plan Básico sigue siendo gratuito y conserva tu check-in diario y el botón de ayuda.'],
];

const GREEN = '#17695F';
const toggleBg = (on) => (on ? GREEN : 'transparent');
const toggleFg = (on) => (on ? '#fff' : '#12554D');

/* ---------- View model: everything the template binds to ---------- */

function viewModel() {
  const en = state.lang === 'en';
  const t = (s) => (en && dict[s]) || s;
  const a = state.annual;
  const mood = MOODS[state.mood];
  const feat = FEATURES[state.feat];

  const lists = {
    navLinks: NAV.map(([id, label]) => ({
      href: '#' + id, label: t(label),
      bg: state.active === id ? '#E3EEE4' : 'transparent',
      fg: state.active === id ? '#12554D' : '#1F3B37',
    })),
    moods: MOODS.map((m, i) => ({
      label: t(m.label), dot: m.dot,
      bg: state.mood === i ? '#E3EEE4' : '#fff',
      border: state.mood === i ? '3px solid #17695F' : '2px solid #E9E0CC',
    })),
    attrs: ATTRS.map((o) => ({ t: t(o.t), d: t(o.d) })),
    steps: STEPS.map(([n, title, desc], i) => {
      const on = state.step === i;
      return {
        n, t: t(title), d: t(desc),
        bg: on ? '#FFFFFF' : '#FBF6EC', bc: on ? GREEN : '#EFE6D2',
        sh: on ? '0 16px 36px #17695F22' : 'none', tf: on ? 'translateX(6px)' : 'none',
        nbg: on ? GREEN : '#F6E3C8', nfg: on ? '#fff' : '#12554D',
      };
    }),
    feats: FEATURES.map((f, i) => {
      const on = state.feat === i;
      return {
        t: t(f.t), d: f.d, c: f.c, bg: f.bg,
        rowBg: on ? '#FFFDF8' : 'transparent', rowBc: on ? GREEN : 'transparent',
        rowSh: on ? '0 12px 28px #6A442022' : 'none', rowTf: on ? 'translateX(6px)' : 'none',
      };
    }),
    trust: TRUST.map(t),
    basicList: BASIC_LIST.map(t),
    famList: FAMILY_LIST.map(t),
    faqs: FAQS.map(([q, ans], i) => ({
      q: t(q), a: t(ans),
      display: state.open === i ? 'block' : 'none',
      sign: state.open === i ? '−' : '+',
      expanded: state.open === i,
    })),
  };

  const ws = state.wStatus;
  const bindings = {
    isEs: !en, isEn: en,
    esBg: toggleBg(!en), esFg: toggleFg(!en), enBg: toggleBg(en), enFg: toggleFg(en),
    monthlyBg: toggleBg(!a), monthlyFg: toggleFg(!a), annualBg: toggleBg(a), annualFg: toggleFg(a),
    price: a ? 'S/ 179' : 'S/ 19.90',
    per: t(a ? 'al año' : 'al mes'),
    priceNote: t(a ? '≈ US$15 al mes · ahorras 25 %' : '≈ US$5.50 al mes'),
    famTitle: t(mood.title), famNote: t(mood.note),
    navShadow: state.scrolled ? '0 10px 30px #1F3B3724' : '0 2px 8px #1F3B3710',
    progress: (state.progress * 100).toFixed(1) + '%',
    panelBg: STEP_PANEL_BG[state.step],
    p1: state.step === 0 ? 'flex' : 'none', p2: state.step === 1 ? 'flex' : 'none', p3: state.step === 2 ? 'flex' : 'none',
    det: { d: feat.d, c: feat.c, bg: feat.bg, t: t(feat.t), long: t(feat.long), plan: t(feat.plan) },
    detN: `${state.feat + 1} / ${FEATURES.length}`,
    wEmail: state.wEmail,
    wFormDisp: ws === 'done' ? 'none' : 'flex',
    wDoneDisp: ws === 'done' ? 'flex' : 'none',
    wErrDisp: ws === 'error' ? 'block' : 'none',
    wBorder: ws === 'error' ? '#C9573A' : '#E9E0CC',
  };
  return { lists, bindings };
}

/* ---------- Actions ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FEAT_COUNT = FEATURES.length;

const actions = {
  setEs: () => setLang('es'),
  setEn: () => setLang('en'),
  setMonthly: () => setState({ annual: false }),
  setAnnual: () => setState({ annual: true }),
  prevFeat: () => setState((s) => ({ feat: (s.feat + FEAT_COUNT - 1) % FEAT_COUNT })),
  nextFeat: () => setState((s) => ({ feat: (s.feat + 1) % FEAT_COUNT })),
  onWaitEmail: (e) => setState({ wEmail: e.target.value, wStatus: 'idle' }),
  submitWait: (e) => {
    e.preventDefault();
    const value = state.wEmail.trim();
    if (!EMAIL_RE.test(value)) return setState({ wStatus: 'error' });
    setState({ wStatus: 'done', wEmail: value });
    // TODO: send to a real waitlist endpoint. Stored locally for now (as in the prototype).
    try {
      const list = JSON.parse(storage.get('serenia-waitlist') || '[]');
      list.push(value);
      storage.set('serenia-waitlist', JSON.stringify(list));
    } catch { /* ignore corrupt storage */ }
  },
};

const itemActions = {
  moods: (i) => setState({ mood: i }),
  steps: (i) => setState({ step: i }),
  feats: (i) => setState({ feat: i }),
  faqs: (i) => setState((s) => ({ open: s.open === i ? -1 : i })),
};

function setLang(lang) {
  storage.set('serenia-lang', lang);
  setState({ lang });
}

/* ---------- Rendering ---------- */

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

// Sync `a` (live node) to `b` (fresh node) in place so CSS transitions keep running.
function patch(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) return a.replaceWith(b);
  if (a.nodeType === Node.TEXT_NODE) {
    if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue;
    return;
  }
  for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
  for (const { name } of [...a.attributes]) if (!b.hasAttribute(name)) a.removeAttribute(name);
  if (a.childNodes.length !== b.childNodes.length) return a.replaceChildren(...b.childNodes);
  [...a.childNodes].forEach((child, i) => patch(child, b.childNodes[i]));
}

function renderLists(lists) {
  document.querySelectorAll('template[data-list]').forEach((slot) => {
    const name = slot.dataset.list;
    const existing = [];
    for (let el = slot.previousElementSibling; el && el.dataset.gen === name; el = el.previousElementSibling) existing.unshift(el);

    const host = document.createElement('div');
    host.innerHTML = lists[name].map((item, i) => templates[name](item, i)).join('');
    const fresh = [...host.children];
    fresh.forEach((el) => { el.dataset.gen = name; });

    if (existing.length !== fresh.length) {
      existing.forEach((el) => el.remove());
      fresh.forEach((el) => slot.before(el));
    } else {
      existing.forEach((el, i) => patch(el, fresh[i]));
    }
  });
}

function applyBindings(b) {
  document.querySelectorAll('[data-bind-text]').forEach((el) => { el.textContent = get(b, el.dataset.bindText); });
  document.querySelectorAll('[data-bind-style]').forEach((el) => {
    el.dataset.bindStyle.split(';').forEach((pair) => {
      const [prop, key] = pair.split(':');
      el.style.setProperty(prop, get(b, key));
    });
  });
  document.querySelectorAll('[data-bind-attr]').forEach((el) => {
    el.dataset.bindAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      const value = get(b, key);
      if (attr === 'value') { if (el.value !== value) el.value = value; } else el.setAttribute(attr, String(value));
    });
  });
}

// Cheap pass (no language walk) for high-frequency updates such as scrolling.
function refresh() {
  const { lists, bindings } = viewModel();
  renderLists(lists);
  applyBindings(bindings);
}

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Brief fade/slide on content that changed because of a user action.
function bump(els, stagger = 60) {
  if (REDUCED_MOTION) return;
  els.forEach((el, i) => el?.animate(
    [{ opacity: 0, translate: '0 10px' }, { opacity: 1, translate: '0 0' }],
    { duration: 380, delay: i * stagger, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
  ));
}

const lastSeen = { mood: state.mood, annual: state.annual, feat: state.feat };

function animateChanges() {
  if (state.mood !== lastSeen.mood) {
    bump([...document.querySelectorAll('[data-bind-text="famTitle"], [data-bind-text="famNote"]')]);
  }
  if (state.annual !== lastSeen.annual) {
    bump([...document.querySelectorAll('[data-bind-text="price"], [data-bind-text="priceNote"]')], 40);
  }
  if (state.feat !== lastSeen.feat) {
    const panel = document.querySelector('[data-featpanel]');
    bump([...panel.children].slice(1), 70);
  }
  Object.assign(lastSeen, { mood: state.mood, annual: state.annual, feat: state.feat });
}

function render() {
  refresh();
  applyLang();
  animateChanges();
}

/* ---------- Language: swap static Spanish text nodes for English ---------- */

const swapped = new Map();

function applyLang() {
  const en = state.lang === 'en';
  document.documentElement.lang = en ? 'en' : 'es';
  if (!en) {
    swapped.forEach((v, node) => { if (node.nodeValue === v.tr) node.nodeValue = v.orig; });
    swapped.clear();
    return;
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (/^(SCRIPT|STYLE|TEMPLATE)$/i.test(n.parentNode?.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let node;
  while ((node = walker.nextNode())) {
    const prior = swapped.get(node);
    if (prior && node.nodeValue === prior.tr) continue;
    const raw = node.nodeValue;
    const tr = dict[raw.replace(/\s+/g, ' ').trim()];
    if (tr) {
      const next = raw.replace(raw.trim(), () => tr);
      swapped.set(node, { orig: raw, tr: next });
      node.nodeValue = next;
    }
  }
}

/* ---------- Events ---------- */

document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-click]');
  if (item) return itemActions[item.dataset.click](Number(item.dataset.i));
  const el = e.target.closest('[data-on-click]');
  if (el) actions[el.dataset.onClick](e);
});
document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-hover]');
  if (el && !el.contains(e.relatedTarget) && Number(el.dataset.i) !== state.feat) itemActions[el.dataset.hover](Number(el.dataset.i));
});
document.addEventListener('submit', (e) => {
  const el = e.target.closest('[data-on-submit]');
  if (el) actions[el.dataset.onSubmit](e);
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-on-change]');
  if (el) actions[el.dataset.onChange](e);
});

/* ---------- Behaviors: step autoplay, scroll state, reveal ---------- */

function initScroll() {
  const ids = NAV.map(([id]) => id);
  const toTop = document.getElementById('to-top');
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    let active = '';
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top < 200) active = id;
    });
    Object.assign(state, { scrolled: y > 10, progress: max > 0 ? y / max : 0, active });
    toTop.classList.toggle('show', y > 700);
    refresh();
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting || seen.has(entry.target)) return;
    seen.add(entry.target);
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-reveal]'));
    const delay = Math.max(0, siblings.indexOf(entry.target)) * 90;
    entry.target.animate(
      [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
    );
    entry.target.style.opacity = '';
    io.unobserve(entry.target);
  }), { threshold: 0.12 });
  setTimeout(() => document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) el.style.opacity = '0';
    io.observe(el);
  }), 50);
}

/* ---------- Pointer effects: ripple, card spotlight, hero parallax ---------- */

const BUTTON_SELECTOR = 'a[data-navcta], a[style*="min-height:5"], button[type="submit"]';

function initPointerEffects() {
  document.querySelectorAll(BUTTON_SELECTOR).forEach((el) => el.classList.add('btn-fx'));

  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn-fx');
    if (!btn || REDUCED_MOTION) return;
    const rect = btn.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = `${e.clientX - rect.left}px`;
    dot.style.top = `${e.clientY - rect.top}px`;
    btn.append(dot);
    dot.addEventListener('animationend', () => dot.remove());
  });

  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('[data-pcard], [data-spot]');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });

  const hero = document.querySelector('[data-herovis]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hero || REDUCED_MOTION || !fine) return;
  const depths = [6, -14, -18, 10]; // photo, check-in pills, streak chip, bottom card
  const layers = [...hero.children];
  const section = hero.closest('section');
  section.addEventListener('pointermove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    layers.forEach((layer, i) => { layer.style.translate = `${x * depths[i]}px ${y * depths[i]}px`; });
  });
  section.addEventListener('pointerleave', () => layers.forEach((layer) => { layer.style.translate = ''; }));
}

render();
initScroll();
initReveal();
initPointerEffects();
setInterval(() => setState((s) => ({ step: (s.step + 1) % STEPS.length })), 7000);
