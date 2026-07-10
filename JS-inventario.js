(async function(){
  const productosPorDefecto = [
    {id:'p1', nombre:'Arroz Selecto 5lb', precio:180.00, stock:40},
  ];

  const db = window.inventarioDB;
  let productos = [];
  let carrito = {}; // { id: cantidad }
  let editandoId = null;

  const fmt = n => 'RD$' + Number(n).toLocaleString('es-DO', {
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });

  async function iniciarDatos(){
    productos = await db.obtenerProductos();
    if(productos.length === 0){
      productos = structuredClone(productosPorDefecto);
      await db.guardarProductos(productos);
    }
    carrito = await db.obtenerCarrito();
  }

  async function guardarProductos(){
    await db.guardarProductos(productos);
  }

  async function guardarCarrito(){
    await db.guardarCarrito(carrito);
  }

  // ---------- Navegacion ----------
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-'+btn.dataset.view).classList.add('active');
      if(btn.dataset.view === 'admin') renderAdmin();
    });
  });

  // ---------- Catalogo ----------
  const grid = document.getElementById('grid');
  const searchInput = document.getElementById('search');

  function stockDisponible(prod){
    const enCarrito = carrito[prod.id] || 0;
    return prod.stock - enCarrito;
  }

  function renderGrid(){
    const q = searchInput.value.trim().toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(q));
    grid.innerHTML = '';
    if(filtrados.length === 0){
      grid.innerHTML = '<p class="empty-grid">No se encontraron productos.</p>';
      return;
    }
    filtrados.forEach(p=>{
      const disponible = stockDisponible(p);
      const card = document.createElement('button');
      card.className = 'card';
      card.disabled = disponible <= 0;
      card.innerHTML = `
        <div class="card-name">${escapeHtml(p.nombre)}</div>
        <div class="card-price mono">${fmt(p.precio)}</div>
        <div class="card-stock">${disponible > 0 ? 'Disponible: '+disponible : 'Agotado'}</div>
      `;
      card.addEventListener('click', ()=> agregarAlCarrito(p.id));
      grid.appendChild(card);
    });
  }

  async function agregarAlCarrito(id){
    const prod = productos.find(p=>p.id===id);
    if(!prod || stockDisponible(prod) <= 0) return;
    carrito[id] = (carrito[id]||0) + 1;
    await guardarCarrito();
    renderGrid();
    renderReceipt();
  }

  async function cambiarCantidad(id, delta){
    const prod = productos.find(p=>p.id===id);
    if(!prod) return;
    const actual = carrito[id] || 0;
    const nueva = actual + delta;
    if(nueva <= 0){ delete carrito[id]; }
    else if(delta > 0 && stockDisponible(prod) <= 0){ return; }
    else { carrito[id] = nueva; }
    await guardarCarrito();
    renderGrid();
    renderReceipt();
  }

  async function quitarDelCarrito(id){
    delete carrito[id];
    await guardarCarrito();
    renderGrid();
    renderReceipt();
  }

  function renderReceipt(){
    const lines = document.getElementById('receipt-lines');
    const ids = Object.keys(carrito).filter(id => productos.some(p=>p.id===id) && carrito[id] > 0);
    if(ids.length === 0){
      lines.innerHTML = '<p class="empty">Selecciona productos del catalogo...</p>';
    } else {
      lines.innerHTML = ids.map(id=>{
        const p = productos.find(pp=>pp.id===id);
        const cant = carrito[id];
        const subtotal = p.precio * cant;
        return `
          <div class="line">
            <div class="line-name" title="${escapeHtml(p.nombre)}">${escapeHtml(p.nombre)}</div>
            <div class="line-qty">
              <button class="qty-btn" data-action="menos" data-id="${id}">-</button>
              <span>${cant}</span>
              <button class="qty-btn" data-action="mas" data-id="${id}">+</button>
            </div>
            <div class="line-amount">${fmt(subtotal)}</div>
            <button class="remove-x" data-action="quitar" data-id="${id}">quitar</button>
          </div>
        `;
      }).join('');
    }

    const subtotal = ids.reduce((acc,id)=>{
      const p = productos.find(pp=>pp.id===id);
      return acc + p.precio * carrito[id];
    }, 0);
    const itbis = subtotal * 0.18;
    document.getElementById('subtotal').textContent = fmt(subtotal);
    document.getElementById('itbis').textContent = fmt(itbis);
    document.getElementById('total').textContent = fmt(subtotal + itbis);

    lines.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if(action==='mas') cambiarCantidad(id, 1);
        else if(action==='menos') cambiarCantidad(id, -1);
        else if(action==='quitar') quitarDelCarrito(id);
      });
    });
  }

  document.getElementById('clear-cart').addEventListener('click', async ()=>{
    carrito = {};
    await guardarCarrito();
    renderGrid();
    renderReceipt();
  });

  searchInput.addEventListener('input', renderGrid);

  // ---------- Administracion (CRUD) ----------
  const tablaBody = document.getElementById('tabla-body');

  function renderAdmin(){
    tablaBody.innerHTML = '';
    productos.forEach(p=>{
      const tr = document.createElement('tr');
      if(editandoId === p.id){
        tr.innerHTML = `
          <td><input type="text" value="${escapeAttr(p.nombre)}" data-field="nombre"></td>
          <td><input type="number" step="0.01" min="0" value="${p.precio}" data-field="precio"></td>
          <td><input type="number" min="0" value="${p.stock}" data-field="stock"></td>
          <td class="actions">
            <button class="btn-save" data-action="guardar" data-id="${p.id}">Guardar</button>
            <button class="btn-cancel" data-action="cancelar" data-id="${p.id}">Cancelar</button>
          </td>
        `;
      } else {
        tr.innerHTML = `
          <td>${escapeHtml(p.nombre)}</td>
          <td class="mono">${fmt(p.precio)}</td>
          <td class="mono">${p.stock}</td>
          <td class="actions">
            <button class="btn-edit" data-action="editar" data-id="${p.id}">Editar</button>
            <button class="btn-del" data-action="eliminar" data-id="${p.id}">Eliminar</button>
          </td>
        `;
      }
      tablaBody.appendChild(tr);
    });

    tablaBody.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if(action === 'editar'){ editandoId = id; renderAdmin(); }
        else if(action === 'cancelar'){ editandoId = null; renderAdmin(); }
        else if(action === 'guardar'){ guardarEdicion(id); }
        else if(action === 'eliminar'){ eliminarProducto(id); }
      });
    });
  }

  async function guardarEdicion(id){
    const fila = [...tablaBody.querySelectorAll('tr')].find(tr => tr.querySelector('[data-action="guardar"]')?.dataset.id === id);
    const nombre = fila.querySelector('[data-field="nombre"]').value.trim();
    const precio = parseFloat(fila.querySelector('[data-field="precio"]').value);
    const stock = parseInt(fila.querySelector('[data-field="stock"]').value, 10);
    if(!nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0){
      alert('Revisa los datos: nombre, precio y existencia deben ser validos.');
      return;
    }
    const prod = productos.find(p=>p.id===id);
    prod.nombre = nombre;
    prod.precio = precio;
    prod.stock = stock;
    await guardarProductos();
    editandoId = null;
    renderAdmin();
    renderGrid();
    renderReceipt();
  }

  async function eliminarProducto(id){
    const prod = productos.find(p=>p.id===id);
    if(!prod) return;
    if(!confirm(`Eliminar "${prod.nombre}" del catalogo? Esta accion no se puede deshacer.`)) return;
    productos = productos.filter(p=>p.id!==id);
    delete carrito[id];
    await guardarProductos();
    await guardarCarrito();
    renderAdmin();
    renderGrid();
    renderReceipt();
  }

  document.getElementById('form-nuevo').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const nombre = document.getElementById('nuevo-nombre').value.trim();
    const precio = parseFloat(document.getElementById('nuevo-precio').value);
    const stock = parseInt(document.getElementById('nuevo-stock').value, 10);
    if(!nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) return;
    const id = 'p' + Date.now();
    productos.push({id, nombre, precio, stock});
    await guardarProductos();
    e.target.reset();
    renderAdmin();
    renderGrid();
  });

  document.getElementById('reset-data').addEventListener('click', async ()=>{
    if(!confirm('Esto restaurara el catalogo original de 12 productos y borrara tus cambios. Continuar?')) return;
    productos = structuredClone(productosPorDefecto);
    carrito = {};
    await guardarProductos();
    await guardarCarrito();
    editandoId = null;
    renderAdmin();
    renderGrid();
    renderReceipt();
  });

  // ---------- Utilidades ----------
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
  function escapeAttr(str){ return escapeHtml(str); }

  // ---------- Inicio ----------
  try{
    await iniciarDatos();
    renderGrid();
    renderReceipt();
  } catch(error){
    console.error(error);
    grid.innerHTML = '<p class="empty-grid">No se pudo conectar la base de datos del navegador.</p>';
  }
})();
