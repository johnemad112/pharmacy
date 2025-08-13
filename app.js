// بيانات العملات
const fmt = new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' });

// سلة المشتريات عبر LocalStorage
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]') }
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCount() }
function updateCartCount(){ const c=getCart(); const n=c.reduce((t,i)=>t+i.qty,0); const el=document.getElementById('cart-count'); if(el) el.textContent = n }

// رسم البطاقات
function renderProducts(list){
  const grid = document.getElementById('collections');
  if(!grid) return;
  if(!list || list.length===0){ grid.innerHTML = '<div class="card">لا توجد نتائج مطابقة.</div>'; return; }
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <a href="product.html?id=${p.id}">
        <img loading="lazy" src="${p.image||'assets/img/placeholder.png'}" alt="${p.title}"/>
      </a>
      <div class="p-body">
        <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
        ${p.rx_required ? '<div class="rx-badge">⚠️ قد يتطلب وصفة</div>':''}
        <div class="price">${fmt.format(p.price)}</div>
        <div class="actions">
          <button data-id="${p.id}" class="add">إضافة للسلة</button>
          <a class="ghost" href="product.html?id=${p.id}">تفاصيل</a>
        </div>
      </div>
    </article>
  `).join('');
  // أحداث إضافة للسلة
  grid.querySelectorAll('button.add').forEach(btn=>{
    btn.onclick = (e)=>{
      const id = +e.currentTarget.dataset.id;
      const p = PRODUCTS.find(x=>x.id===id);
      const cart = getCart();
      const i = cart.findIndex(x=>x.id===id);
      if(i>-1) cart[i].qty += 1; else cart.push({id:p.id, title:p.title, price:p.price, qty:1});
      setCart(cart);
      alert('تمت إضافة المنتج إلى السلة');
    };
  });
}

// فلترة
function applyFilters(){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('category').value;
  const form = document.getElementById('dosage_form').value;
  const rx = document.getElementById('rx_only').checked;

  const list = PRODUCTS.filter(p=>{
    const matchQ = !q || p.title.toLowerCase().includes(q) || (p.active_ingredient||'').toLowerCase().includes(q);
    const matchCat = !cat || p.category===cat;
    const matchForm = !form || p.dosage_form===form;
    const matchRx = !rx || p.rx_required===true;
    return matchQ && matchCat && matchForm && matchRx;
  });
  renderProducts(list);
}

function initFilters(){
  ['search','category','dosage_form','rx_only'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener(id==='search'?'input':'change', applyFilters);
  });
}

function boot(){
  updateCartCount();
  renderProducts(PRODUCTS);
  initFilters();
}

document.addEventListener('DOMContentLoaded', boot);
