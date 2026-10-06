const cart = new Map();
const catBar = document.getElementById('cats');
const catalog = document.getElementById('catalog');
let active = 'All';

const colors = {
  Laptops:'#7ee0c6', Desktops:'#8eb6ff', Tablets:'#f5c451', GPUs:'#ff8b73',
  CPUs:'#d7b4ff', RAM:'#9ad7ff', Storage:'#b7e38d', Monitors:'#ffd38a',
  Mice:'#f3a6ff', Keyboards:'#9ef0d0', Accessories:'#ffc1a8', Networking:'#a9c4ff', Hardware:'#c9d4e5'
};

function money(n){ return '$' + n.toLocaleString(); }

function card(p){
  const el = document.createElement('article');
  el.className = 'card';
  el.dataset.id = p.id;
  const badges = (p.badges||[]).map(b => `<span class="badge ${b}">${b}</span>`).join('');
  el.innerHTML = `
    <div class="art" style="background:${colors[p.category]||'#9ef0d0'}">${p.category}</div>
    <div class="badges">${badges}</div>
    <h3>${p.name}</h3>
    <div class="meta">${p.blurb} · ${p.rating}★ · ${p.stock} in stock</div>
    <div class="price">${money(p.price)}${p.was?`<span class="was">${money(p.was)}</span>`:''}</div>
    <button class="add" data-add="${p.id}">Add to cart</button>`;
  return el;
}

function paint(node, list){
  node.innerHTML = '';
  list.forEach(p => node.appendChild(card(p)));
}

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
    b.textContent = c;
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
    total += p.price * qty; count += qty;
    const row = document.createElement('div');
    row.className = 'line';
    row.innerHTML = `<span>${p.name} × ${qty}</span><b>${money(p.price*qty)}</b>`;
    lines.appendChild(row);
  });
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(total);
}

document.body.addEventListener('click', e => {
  const id = e.target.dataset.add;
  if (!id) return;
  cart.set(id, (cart.get(id)||0)+1);
  renderCart();
  document.getElementById('drawer').hidden = false;
});
document.getElementById('q').addEventListener('input', render);
document.getElementById('cartBtn').onclick = () => { document.getElementById('drawer').hidden = false; };
document.getElementById('closeCart').onclick = () => { document.getElementById('drawer').hidden = true; };
document.getElementById('checkout').onclick = () => alert('Demo checkout — connect payments later.');

categories();
render();
renderCart();
