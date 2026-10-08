// Item templates for list sections. Rendered into <template data-list="..."> slots.
export const templates = {
  navLinks: (l, index) => `<a data-nl="1" href="${l.href}" style="color:${l.fg};background:${l.bg};padding:0 18px;min-height:44px;display:inline-flex;align-items:center;border-radius:999px;transition:background .25s,color .25s" class="hv-0">${l.label}</a>`,
  moods: (m, index) => `<div data-click="moods" data-i="${index}" role="button" style="cursor:pointer;display:inline-flex;align-items:center;gap:7px;min-height:40px;box-sizing:border-box;background:${m.bg};border:${m.border};border-radius:999px;padding:0 13px;font-weight:800;font-size:14px;transition:background .25s,transform .2s" class="hv-3"><span style="width:12px;height:12px;border-radius:50%;background:${m.dot}"></span>${m.label}</div>`,
  attrs: (a, index) => `<div><div style="font-weight:900;font-size:22px;margin-bottom:2px">${a.t}</div><div style="font-size:16px;color:#E3EEE4">${a.d}</div></div>`,
  steps: (s, index) => `<div data-click="steps" data-i="${index}" role="button" style="cursor:pointer;display:flex;gap:20px;align-items:flex-start;background:${s.bg};border:2px solid ${s.bc};border-radius:28px;padding:26px 28px;box-shadow:${s.sh};transition:background .3s,border-color .3s,box-shadow .3s,transform .25s;transform:${s.tf}" class="hv-5">
<div style="width:56px;height:56px;border-radius:50%;background:${s.nbg};color:${s.nfg};display:flex;align-items:center;justify-content:center;font-family:'Fredoka',sans-serif;font-weight:600;font-size:26px;flex:none;transition:background .3s,color .3s">${s.n}</div>
<div><h3 style="font-size:24px;font-weight:700;margin:0 0 6px;color:#12554D">${s.t}</h3><p style="margin:0;font-size:18px;color:#3C524E">${s.d}</p></div>
</div>`,
  feats: (f, index) => `<div data-click="feats" data-i="${index}" data-hover="feats" data-i="${index}" role="button" style="cursor:pointer;display:flex;align-items:center;gap:16px;background:${f.rowBg};border:2px solid ${f.rowBc};border-radius:22px;padding:10px 18px 10px 10px;box-shadow:${f.rowSh};transform:${f.rowTf};transition:background .25s,border-color .25s,box-shadow .25s,transform .25s">
<div style="width:48px;height:48px;border-radius:15px;background:${f.bg};display:flex;align-items:center;justify-content:center;flex:none"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${f.c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${f.d}"></path></svg></div>
<div style="font-weight:800;font-size:19px;color:#12554D;line-height:1.25">${f.t}</div>
</div>`,
  trust: (t, index) => `<div style="background:#FFFFFF14;border:1.5px solid #FFFFFF30;border-radius:20px;padding:18px 22px;font-weight:700;font-size:18px">${t}</div>`,
  basicList: (i, index) => `<li style="display:flex;gap:12px;font-size:17px"><span style="width:10px;height:10px;border-radius:50%;background:#6FB39A;flex:none;margin-top:10px"></span><span>${i}</span></li>`,
  famList: (i, index) => `<li style="display:flex;gap:12px;font-size:17px"><span style="width:10px;height:10px;border-radius:50%;background:#F6E3C8;flex:none;margin-top:10px"></span><span>${i}</span></li>`,
  faqs: (q, index) => `<div style="background:#FBF6EC;border:1.5px solid #E9E0CC;border-radius:22px;overflow:hidden">
<button data-click="faqs" data-i="${index}" aria-expanded="${q.expanded}" style="font:inherit;width:100%;text-align:left;background:none;border:0;cursor:pointer;min-height:64px;padding:12px 26px;display:flex;justify-content:space-between;align-items:center;gap:16px;font-weight:800;font-size:19px;color:#12554D"><span>${q.q}</span><span style="font-size:28px;font-weight:700;color:#17695F;flex:none">${q.sign}</span></button>
<div style="display:${q.display};padding:0 26px 22px;color:#3C524E">${q.a}</div>
</div>`,
};
