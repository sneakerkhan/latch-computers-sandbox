const cart = new Map();
const catBar = document.getElementById('cats');
const catalog = document.getElementById('catalog');
let active = 'All';

const photos = {
  Laptops: ['1517336714731-489689fd1ca8','1496181133206-80ce9b88a853','1593642632823-8f785ba67e45'],
  Desktops: ['1587202372634-32705e3bf49c','1593640408182-31c70c8268f5','1625842268584-8f3296236761'],
  Tablets: ['1544244015-0df4b3ffc6b0','1561154464-82e9adf32764','1542751110-97427bbecf20'],
  GPUs: ['1591488320449-011701bb6704','1591799264318-7e6ef8ddb7ea','1518770660439-4636190af475'],
  CPUs: ['1518770660439-4636190af475','1518773553398-650c184e0bb3','1591799264318-7e6ef8ddb7ea'],
  RAM: ['1562976540-1502c2145186','1591799264318-7e6ef8ddb7ea'],
  Storage: ['1531492746076-161ca9bcad58','1597872200969-2b65d56bd16b'],
  Monitors: ['1527443224154-c4a3942d3acf','1547119957-637f8679db1e','1593640408182-31c70c8268f5'],
  Mice: ['1527864550417-7fd91fc51a46','1615663245857-ac93bb7c39e7'],
  Keyboards: ['1511467687858-23d96c32e4ae','1587829741301-dc798b83add3','1595225476474-87563907a212'],
  Accessories: ['1505740420928-5e560c06d30e','1583394838336-acd977736f90','1484704849700-f032a568e944'],
  Networking: ['1544197150-b99a580bb7a8','1558494949-ef010cbdcc31'],
  Hardware: ['1518770660439-4636190af475','1587202372775-e229f172b9d7','1591799264318-7e6ef8ddb7ea']
};
const icons = {
  All: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  Laptops: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M2 19h20"/></svg>',
  Desktops: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  Tablets: '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  GPUs: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7V4M10 7V4M14 7V4"/></svg>',
  CPUs: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
  RAM: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M7 7v10M11 7v10M15 7v10"/></svg>',
  Storage: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8"/></svg>',
  Monitors: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  Mice: '<svg viewBox="0 0 24 24"><path d="M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0z"/><path d="M12 8v4"/></svg>',
  Keyboards: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M8 14h8"/></svg>',
  Accessories: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v5a2 2 0 0 0 2 2h1v-7M20 12v5a2 2 0 0 1-2 2h-1v-7"/></svg>',
  Networking: '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M12 8v8"/></svg>',
  Hardware: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4L15 12l-3-3z"/></svg>'
};
const badgeIcon = { trending:'\u2197', 'new':'\u2726', best:'\u2605', deal:'%' };
function money(n){ return '$' + Number(n).toLocaleString(); }
function photoFor(p){
  if (p.image) return p.image;
  const pool = photos[p.category] || photos.Hardware;
  const n = parseInt(String(p.id).replace(/\D/g, ''), 10) || 0;
  const id = pool[n % pool.length];
  return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=800&q=70';
}
function card(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.id = p.id;
  const src = photoFor(p);
  const badges = (p.badges||[]).map(b => `<span class="badge ${b}">${badgeIcon[b]||''} ${b}</span>`).join('');
  el.innerHTML = `<div class="art"><img src="${src}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" /><span>${p.category}</span></div><div class="badges">${badges}</div><h3>${p.name}</h3><div class="meta">${p.blurb} \u00b7 ${p.rating}\u2605 \u00b7 ${p.stock} in stock</div><div class="price">${money(p.price)}${p.was?`<span class="was">${money(p.was)}</span>`:''}</div><button class="add" data-add="${p.id}">Add to cart</button>`;
  const img = el.querySelector('img');
  img.onerror = () => { img.src = 'https://picsum.photos/seed/' + encodeURIComponent(p.id) + '/800/500'; };
  return el;
}
function paint(node, list){ node.innerHTML = ''; list.forEach(p => node.appendChild(card(p))); }
function filtered(){
  const q = document.getElementById('q').value.trim().toLowerCase();
  return PRODUCTS.filter(p => (active==='All' || p.category===active) && (`${p.name} ${p.category} ${p.blurb}`.toLowerCase().includes(q)));
}
function render(){
  const list = filtered();
  paint(document.getElementById('trending'), list.filter(p => p.badges?.includes('trending')).slice(0,8));
  paint(document.getElementById('newest'), list.filter(p => p.badges?.includes('new')).slice(0,8));
  paint(document.getElementById('bestsellers'), list.filter(p => p.badges?.includes('best')).slice(0,8));
  paint(document.getElementById('deals'), list.filter(p => p.badges?.includes('deal') || p.was).slice(0,8));
  paint(catalog, list);
  document.getElementById('resultCount').textContent = list.length + ' cards';
  document.getElementById('skuCount').textContent = PRODUCTS.length;
}
function categories(){
  const cats = ['All', ...new Set(PRODUCTS.map(p => p.category))];
  catBar.innerHTML = '';
  cats.forEach(c => {
    const b = document.createElement('button');
    b.innerHTML = `${icons[c]||icons.Hardware}<span>${c}</span>`;
    if (c===active) b.classList.add('active');
    b.onclick = () => { active = c; categories(); render(); };
    catBar.appendChild(b);
  });
}
function renderCart(){
  const lines = document.getElementById('cartLines');
  lines.innerHTML = '';
  let total = 0, count = 0;
  cart.forEach((qty, id) => {
    const p = PRODUCTS.find(x => x.id===id);
    if (!p) return;
    total += p.price * qty; count += qty;
    const row = document.createElement('div');
    row.className = 'line';
    row.innerHTML = `<img src="${photoFor(p)}" alt="" referrerpolicy="no-referrer" /><span>${p.name} \u00d7 ${qty}</span><b>${money(p.price*qty)}</b>`;
    lines.appendChild(row);
  });
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(total);
}
document.body.addEventListener('click', e => {
  const id = e.target.closest('[data-add]')?.dataset.add;
  if (!id) return;
  cart.set(id, (cart.get(id)||0)+1);
  renderCart();
  document.getElementById('drawer').hidden = false;
});
document.getElementById('q').addEventListener('input', render);
document.getElementById('cartBtn').onclick = () => { document.getElementById('drawer').hidden = false; };
document.getElementById('closeCart').onclick = () => { document.getElementById('drawer').hidden = true; };
document.getElementById('checkout').onclick = () => alert('Demo checkout \u2014 connect payments later.');
categories();
render();
renderCart();
