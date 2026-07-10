(function(){
  const DB_NAME = 'colmado_la_esquina';
  const DB_VERSION = 1;
  const STORE_PRODUCTS = 'productos';
  const STORE_CART = 'carrito';

  function abrirDB(){
    return new Promise((resolve, reject)=>{
      if(!('indexedDB' in window)){
        reject(new Error('IndexedDB no esta disponible en este navegador.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = ()=>{
        const db = request.result;
        if(!db.objectStoreNames.contains(STORE_PRODUCTS)){
          db.createObjectStore(STORE_PRODUCTS, {keyPath:'id'});
        }
        if(!db.objectStoreNames.contains(STORE_CART)){
          db.createObjectStore(STORE_CART, {keyPath:'id'});
        }
      };

      request.onsuccess = ()=> resolve(request.result);
      request.onerror = ()=> reject(request.error);
    });
  }

  let dbPromise;
  function getDB(){
    if(!dbPromise) dbPromise = abrirDB();
    return dbPromise;
  }

  async function getAll(storeName){
    const db = await getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction(storeName, 'readonly');
      const request = transaction.objectStore(storeName).getAll();
      request.onsuccess = ()=> resolve(request.result || []);
      request.onerror = ()=> reject(request.error);
    });
  }

  async function replaceAll(storeName, items){
    const db = await getDB();
    return new Promise((resolve, reject)=>{
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.clear();
      items.forEach(item => store.put(item));
      transaction.oncomplete = ()=> resolve();
      transaction.onerror = ()=> reject(transaction.error);
      transaction.onabort = ()=> reject(transaction.error);
    });
  }

  async function obtenerProductos(){
    return getAll(STORE_PRODUCTS);
  }

  async function guardarProductos(productos){
    await replaceAll(STORE_PRODUCTS, productos);
  }

  async function obtenerCarrito(){
    const items = await getAll(STORE_CART);
    return items.reduce((carrito, item)=>{
      carrito[item.id] = item.cantidad;
      return carrito;
    }, {});
  }

  async function guardarCarrito(carrito){
    const items = Object.entries(carrito)
      .filter(([, cantidad]) => cantidad > 0)
      .map(([id, cantidad]) => ({id, cantidad}));
    await replaceAll(STORE_CART, items);
  }

  window.inventarioDB = {
    obtenerProductos,
    guardarProductos,
    obtenerCarrito,
    guardarCarrito
  };
})();
