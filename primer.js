// =========================================================
// BASE DE DATOS DE PRODUCTOS DE ALDANAL3D (Con tus imágenes)
// =========================================================
const productosDB = [
  {
    id: 1,
    nombre: "Soporte Joystick / Celular",
    categoria: "gaming",
    precio: 4500,
    imagen: "IMAGEN/Soporte.jpg",
    badge: "Popular",
    descripcion: "Soporte ergonómico compatible con PS4, PS5, Xbox y smartphones."
  },
  {
    id: 2,
    nombre: "Llaveros Custom x10",
    categoria: "llaveros",
    precio: 3000,
    imagen: "IMAGEN/LLAVERO.jpg",
    badge: "Oferta",
    descripcion: "Pack de 10 llaveros personalizados con tu logo o diseño."
  },
  {
    id: 3,
    nombre: "llavero de personaje",
    categoria: "llaveros",
    precio: 8500,
    imagen: "IMAGEN/llaveros.jpg",
    badge: "oferta",
    descripcion: "Lámpara personalizada que revela tu foto al encenderse."
  },
  {
    id: 4,
    nombre: "Organizador de Cables",
    categoria: "accesorios",
    precio: 2200,
    imagen: "IMAGEN/cable.jpg",
    badge: "",
    descripcion: "Set de clips para mantener tu escritorio ordenado."
  },
  {
    id: 5,
    nombre: "Soporte Auriculares Headset",
    categoria: "gaming",
    precio: 5200,
    imagen: "IMAGEN/soporteauriculares.jpg",
    badge: "Nuevo",
    descripcion: "Soporte firme para auriculares con espacio organizador."
  },
  {
    id: 6,
    nombre: "Maceta Geométrica Minimalista",
    categoria: "decoracion",
    precio: 3800,
    imagen: "IMAGEN/Maceta.jpg",
    badge: "",
    descripcion: "Diseño moderno ideal para suculentas y decoración."
  }
];

// Estado global del Carrito
let carrito = JSON.parse(localStorage.getItem('aldana_carrito')) || [];
let categoriaActual = 'todos';
let mensajeParaWhatsApp = "";

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos(productosDB);
  actualizarCarrito();
});

// Guardar en localStorage
function guardarCarritoStorage() {
  localStorage.setItem('aldana_carrito', JSON.stringify(carrito));
}

// RENDERIZAR PRODUCTOS CON IMÁGENES REALES
function renderizarProductos(lista) {
  const grid = document.getElementById('grid-productos');
  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 2rem;">No se encontraron productos.</p>`;
    return;
  }

  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `
      ${prod.badge ? `<span class="product-badge">${prod.badge}</span>` : ''}
      <div class="img-box">
        <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=AldanaL3D'">
      </div>
      <h3>${prod.nombre}</h3>
      <p class="desc">${prod.descripcion}</p>
      <div class="card-footer">
        <span class="precio">$${prod.precio.toLocaleString()}</span>
        <button class="btn-add-cart" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">
          <i class="fa-solid fa-plus"></i> Agregar
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// FILTRAR POR BÚSQUEDA Y CATEGORÍA
function filtrarProductos() {
  const busqueda = document.getElementById('input-buscar').value.toLowerCase();
  
  const filtrados = productosDB.filter(prod => {
    const coincideNombre = prod.nombre.toLowerCase().includes(busqueda) || prod.descripcion.toLowerCase().includes(busqueda);
    const coincideCategoria = categoriaActual === 'todos' || prod.categoria === categoriaActual;
    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(filtrados);
}

function filtrarCategoria(cat, btn) {
  categoriaActual = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filtrarProductos();
}

// MANEJO DEL CARRITO
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('active');
}

function cerrarAlClickearOverlay(e) {
  if (e.target.id === 'cart-drawer') {
    toggleCart();
  }
}

function agregarAlCarrito(nombre, precio) {
  const index = carrito.findIndex(p => p.nombre === nombre);
  
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarritoStorage();
  actualizarCarrito();
  document.getElementById('cart-drawer').classList.add('active');
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  guardarCarritoStorage();
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarritoStorage();
  actualizarCarrito();
}

function actualizarCarrito() {
  const cartList = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');

  cartList.innerHTML = '';
  let totalItems = 0;

  if (carrito.length === 0) {
    cartList.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 0; color: #777;">
        <i class="fa-solid fa-cart-flatbed" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
  } else {
    carrito.forEach((prod, index) => {
      totalItems += prod.cantidad;
      const subtotalItem = prod.precio * prod.cantidad;
      
      const li = document.createElement('li');
      li.className = 'cart-card-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-details">
            <span class="cart-item-title" style="font-weight:600; font-size:0.85rem;">${prod.nombre}</span>
            <span class="cart-item-price" style="color:var(--accent); font-size:0.8rem;">$${subtotalItem.toLocaleString()}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div class="cart-item-actions" style="display:flex; align-items:center; gap:0.4rem; background:#111; padding:3px 8px; border-radius:6px; border:1px solid #333;">
            <span class="cart-qty-btn" onclick="cambiarCantidad(${index}, -1)" style="cursor:pointer; color:#aaa; font-weight:bold;">-</span>
            <span class="cart-qty-num" style="font-size:0.8rem; font-weight:bold;">${prod.cantidad}</span>
            <span class="cart-qty-btn" onclick="cambiarCantidad(${index}, 1)" style="cursor:pointer; color:#aaa; font-weight:bold;">+</span>
          </div>
          <i class="fa-regular fa-trash-can cart-item-delete" onclick="eliminarDelCarrito(${index})" title="Eliminar" style="cursor:pointer; color:#777;"></i>
        </div>
      `;
      cartList.appendChild(li);
    });
  }

  cartCount.innerText = totalItems;
  calcularTotal();
}

function calcularTotal() {
  let subtotal = 0;
  carrito.forEach(prod => subtotal += (prod.precio * prod.cantidad));

  const metodoPago = document.getElementById('metodo-pago').value;
  const entrega = document.getElementById('cliente-entrega').value;

  let descuento = (metodoPago === "Efectivo") ? subtotal * 0.10 : 0;

  let costoEnvio = 0;
  if (entrega === "Envio Moto") costoEnvio = 2500;
  if (entrega === "Correo") costoEnvio = 3800;

  let totalFinal = subtotal - descuento + costoEnvio;

  document.getElementById('cart-subtotal').innerText = `$${subtotal.toLocaleString()}`;
  document.getElementById('cart-descuento').innerText = `-$${descuento.toLocaleString()}`;
  document.getElementById('cart-envio').innerText = `$${costoEnvio.toLocaleString()}`;
  document.getElementById('cart-total').innerText = `$${totalFinal.toLocaleString()}`;

  let totalItems = 0;
  carrito.forEach(prod => totalItems += prod.cantidad);

  const floatingBar = document.getElementById('floating-cart-bar');
  const floatingCount = document.getElementById('floating-count');
  const floatingTotal = document.getElementById('floating-total');

  if (totalItems > 0) {
    floatingBar.classList.add('visible');
    floatingCount.innerText = totalItems;
    floatingTotal.innerText = `$${totalFinal.toLocaleString()}`;
  } else {
    floatingBar.classList.remove('visible');
  }
}

// COPIAR ALIAS MP
function copiarAlias() {
  const aliasText = document.getElementById("alias-text").innerText;
  
  navigator.clipboard.writeText(aliasText).then(() => {
    const btn = document.querySelector(".btn-copiar-alias");
    const original = btn.innerHTML;
    
    btn.innerHTML = `<i class="fa-solid fa-check"></i> ¡Copiado!`;
    btn.style.background = "#25d366";
    btn.style.borderColor = "#25d366";

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = "#252525";
      btn.style.borderColor = "#383838";
    }, 2000);
  }).catch(() => {
    alert("Alias Mercado Pago: " + aliasText);
  });
}

// FINALIZAR COMPRA Y MENSAJE DE WHATSAPP
function finalizarCompra() {
  if (carrito.length === 0) {
    alert('El carrito está vacío. Agregá algún producto antes de continuar.');
    return;
  }

  const nombre = document.getElementById('cliente-nombre').value.trim();
  const direccion = document.getElementById('cliente-direccion').value.trim();
  const entrega = document.getElementById('cliente-entrega').value;
  const metodoPago = document.getElementById('metodo-pago').value;

  if (!nombre) {
    alert('Por favor completá tu Nombre y Apellido.');
    document.getElementById('cliente-nombre').focus();
    return;
  }

  let subtotal = 0;
  carrito.forEach(prod => subtotal += (prod.precio * prod.cantidad));

  let descuento = (metodoPago === "Efectivo") ? subtotal * 0.10 : 0;
  let costoEnvio = 0;
  if (entrega === "Envio Moto") costoEnvio = 2500;
  if (entrega === "Correo") costoEnvio = 3800;
  
  let totalFinal = subtotal - descuento + costoEnvio;

  let htmlResumen = `
    <p><strong>👤 Cliente:</strong> ${nombre}</p>
    <p><strong>🚚 Entrega:</strong> ${entrega} ${direccion ? '(' + direccion + ')' : ''}</p>
    <p><strong>💳 Método de Pago:</strong> ${metodoPago}</p>
    <hr style="border-color:#333; margin: 0.5rem 0;">
    <p><strong>📦 Productos seleccionados:</strong></p>
    <ul>
  `;

  let mensajeWsp = `🛒 *NUEVO PEDIDO - ALDANAL3D*\n\n`;
  mensajeWsp += `👤 *Cliente:* ${nombre}\n`;
  mensajeWsp += `🚚 *Entrega:* ${entrega} ${direccion ? '(' + direccion + ')' : ''}\n`;
  mensajeWsp += `💳 *Pago:* ${metodoPago}\n`;
  mensajeWsp += `------------------------------------\n`;
  mensajeWsp += `📦 *Detalle del pedido:*\n`;

  carrito.forEach(prod => {
    const sub = prod.precio * prod.cantidad;
    htmlResumen += `<li><span>${prod.nombre} (x${prod.cantidad})</span> <strong>$${sub.toLocaleString()}</strong></li>`;
    mensajeWsp += `• ${prod.nombre} (x${prod.cantidad}) — *$${sub.toLocaleString()}*\n`;
  });

  htmlResumen += `</ul>`;
  htmlResumen += `<hr style="border-color:#333; margin: 0.5rem 0;">`;
  if (descuento > 0) htmlResumen += `<p style="color:#25d366;">🎁 Descuento (10% OFF): -$${descuento.toLocaleString()}</p>`;
  if (costoEnvio > 0) htmlResumen += `<p>🛵 Envío: $${costoEnvio.toLocaleString()}</p>`;
  htmlResumen += `<p style="font-size:1rem; color:#e63946; margin-top:0.4rem;"><strong>Total Final: $${totalFinal.toLocaleString()}</strong></p>`;

  mensajeWsp += `------------------------------------\n`;
  if (descuento > 0) mensajeWsp += `🎁 Descuento (10% OFF): -$${descuento.toLocaleString()}\n`;
  if (costoEnvio > 0) mensajeWsp += `🛵 Envío: $${costoEnvio.toLocaleString()}\n`;
  mensajeWsp += `💰 *TOTAL FINAL: $${totalFinal.toLocaleString()}*\n\n`;
  mensajeWsp += `_¡Hola! Confirmo mi pedido para coordinar la entrega y pago._`;

  mensajeParaWhatsApp = mensajeWsp;

  toggleCart();
  document.getElementById('modal-detalle-contenido').innerHTML = htmlResumen;
  document.getElementById('modal-pedido').classList.add('active');
}

function cerrarModalPedido() {
  document.getElementById('modal-pedido').classList.remove('active');
}

function enviarPedidoWhatsAppFinal() {
  const telefono = "5491124662236";
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeParaWhatsApp)}`;
  window.open(url, '_blank');
  cerrarModalPedido();
}