(async function(){
  const productosPorDefecto = [
    {id:'p1', nombre:'AB S4', precio:0, stock:40},
    {id:'p2', nombre:'Acidil', precio:190.00, stock:40},
    {id:'p3', nombre:'Anti Reumatico', precio:400.00, stock:40},
    {id:'p4', nombre:'Apesin', precio:190.00, stock:40},
    {id:'p5', nombre:'B12', precio:0, stock:40},
    {id:'p6', nombre:'B6', precio:0, stock:40},
    {id:'p7', nombre:'Berro y Miel g.', precio:350.00, stock:40},
    {id:'p8', nombre:'Berro Pequeño', precio:225.00, stock:40},
    {id:'p9', nombre:'Betamil', precio:210.00, stock:40},
    {id:'p10', nombre:'Biotin', precio:0, stock:40},
    {id:'p11', nombre:'Borosol P.', precio:160.00, stock:40},
    {id:'p12', nombre:'Borosol Liquido', precio:190.00, stock:40},
    {id:'p13', nombre:'Botella', precio:450.00, stock:40},
    {id:'p14', nombre:'Bromisol', precio:0, stock:40},
    {id:'p15', nombre:'Bromurer Forte', precio:0, stock:40},
    {id:'p16', nombre:'Calsi de Colores', precio:0, stock:40},
    {id:'p17', nombre:'Calsio', precio:150.00, stock:40},
    {id:'p18', nombre:'CereForte', precio:0, stock:40},
    {id:'p19', nombre:'Cerebrina', precio:200.00, stock:40},
    {id:'p20', nombre:'Champoo', precio:150.00, stock:40},
    {id:'p21', nombre:'Citrato de Magnesio', precio:500.00, stock:40},
    {id:'p22', nombre:'Colageno', precio:550.00, stock:40},
    {id:'p23', nombre:'Colageno Polvo', precio:0, stock:40},
    {id:'p24', nombre:'Comber', precio:240.00, stock:40},
    {id:'p25', nombre:'Complejo B', precio:200.00, stock:40},
    {id:'p26', nombre:'Cubeton', precio:275.00, stock:40},
    {id:'p27', nombre:'Damecon', precio:0, stock:40},
    {id:'p28', nombre:'Depura Cub.', precio:275.00, stock:40},
    {id:'p29', nombre:'Deparasitante', precio:150.00, stock:40},
    {id:'p30', nombre:'Digestivo', precio:275.00, stock:40},
    {id:'p31', nombre:'Doña Celia', precio:350.00, stock:40},
    {id:'p32', nombre:'D.B.T.', precio:0, stock:40},
    {id:'p33', nombre:'Enzimen', precio:0, stock:40},
    {id:'p34', nombre:'Expect Plus', precio:190.00, stock:40},
    {id:'p35', nombre:'Extract. Vig.', precio:190.00, stock:40},
    {id:'p36', nombre:'Fibrin', precio:0, stock:40},
    {id:'p37', nombre:'Fotobiz', precio:0, stock:40},
    {id:'p38', nombre:'Fricon', precio:140.00, stock:40},
    {id:'p39', nombre:'Gengloben', precio:175.00, stock:40},
    {id:'p40', nombre:'Gincen', precio:225.00, stock:40},
    {id:'p41', nombre:'Gomenol', precio:160.00, stock:40},
    {id:'p42', nombre:'Inmunocell', precio:190.00, stock:40},
    {id:'p43', nombre:'Maca', precio:0, stock:40},
    {id:'p44', nombre:'Mentol Azul', precio:200.00, stock:40},
    {id:'p45', nombre:'Miel Bronquial', precio:350.00, stock:40},
    {id:'p46', nombre:'Multi 23', precio:350.00, stock:40},
    {id:'p47', nombre:'Omega 3', precio:350.00, stock:40},
    {id:'p48', nombre:'Omega 3, 6 y 9', precio:500.00, stock:40},
    {id:'p49', nombre:'Pawe Paw', precio:700.00, stock:40},
    {id:'p50', nombre:'Pomada Colld.', precio:250.00, stock:40},
    {id:'p51', nombre:'Potacio', precio:0, stock:40},
    {id:'p52', nombre:'Prolin', precio:225.00, stock:40},
    {id:'p53', nombre:'Prometto J.', precio:270.00, stock:40},
    {id:'p54', nombre:'Prometto Pastilla', precio:450.00, stock:40},
    {id:'p55', nombre:'Protanol', precio:600.00, stock:40},
    {id:'p56', nombre:'R44 Vendedor', precio:240.00, stock:40},
    {id:'p57', nombre:'Rabano y Cebolla', precio:210.00, stock:40},
    {id:'p58', nombre:'Reurin', precio:320.00, stock:40},
    {id:'p59', nombre:'Romp. P.', precio:210.00, stock:40},
    {id:'p60', nombre:'Sabila', precio:250.00, stock:40},
    {id:'p61', nombre:'Siglo 22', precio:375.00, stock:40},
    {id:'p62', nombre:'Solongo', precio:170.00, stock:40},
    {id:'p63', nombre:'Tratamiento', precio:200.00, stock:40},
    {id:'p64', nombre:'Uren', precio:0, stock:40},
    {id:'p65', nombre:'V.E', precio:650.00, stock:40},
    {id:'p66', nombre:'V.E en Pote', precio:0, stock:40},
    {id:'p67', nombre:'V.D3', precio:0, stock:40},
    {id:'p68', nombre:'Vacelina / Cola de Caballo', precio:240.00, stock:40},
    {id:'p69', nombre:'Vaginol', precio:140.00, stock:40},
    {id:'p70', nombre:'Vigoricout', precio:190.00, stock:40},
    {id:'p71', nombre:'Vip Vaporub', precio:0, stock:40},
    {id:'p72', nombre:'Yombimen', precio:0, stock:40},
    {id:'p73', nombre:'Zinc', precio:0, stock:40}
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
