const categoriaSelect = document.getElementById('categoriaSelect');
const tablaProductosBody = document.getElementById('tablaProductosBody');
const accionSelect = document.getElementById('accionSelect');
const formAccion = document.getElementById('formAccion');
const btnEjecutarAccion = document.getElementById('btnEjecutarAccion');

let tiendaDatos = { accesorios: [], prendas: [] };  // Ahora se llena desde la API
let categoriaActual = categoriaSelect.value;
let accionActual = accionSelect.value;

// Verificar autenticación al cargar la página
function verificarAutenticacion() {
    const token = getCookie('token');
    if (!token) {
        alert('Debes iniciar sesión como administrador');
        window.location.href = '/admin/login.html';
        return false;
    }
    
    // Verificar si el token es válido y corresponde a un administrador
    try {
        const payload = parseJwt(token);
        if (!payload || payload.rol !== 'Administrador') {
            alert('Acceso denegado. Solo administradores pueden acceder.');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            window.location.href = '/admin/login.html';
            return false;
        }
        return true;
    } catch (e) {
        alert('Token inválido');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        window.location.href = '/admin/login.html';
        return false;
    }
}

// Función para obtener el valor de una cookie por nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Función para decodificar el payload de un JWT
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Función para obtener el token de autorización
function getAuthHeaders() {
    const token = getCookie('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Carga inicial desde la API
async function cargarDatos() {
  try {
    const [accesoriosResp, prendasResp] = await Promise.all([
      fetch('/api/accesorios'),
      fetch('/api/prendas')
    ]);
    const accesorios = await accesoriosResp.json();
    const prendas = await prendasResp.json();
    tiendaDatos = { accesorios, prendas };
    mostrarTabla();
  } catch (e) {
    console.error("Error cargando datos desde la API:", e);
    tiendaDatos = { accesorios: [], prendas: [] };
    mostrarTabla();
  }
}

// Mostrar tabla según categoría seleccionada
function mostrarTabla() {
  tablaProductosBody.innerHTML = '';
  const lista = tiendaDatos[categoriaActual];
  if (!lista) return;
  for (const item of lista) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>$${item.precio}</td>
    `;
    tablaProductosBody.appendChild(tr);
  }
}

// Cambia los inputs del formulario según la acción
function actualizarFormulario() {
  formAccion.innerHTML = '';
  if (accionActual === 'eliminar') {
    // Solo pide ID
    formAccion.innerHTML = `
      <label for=\"inputId\">ID:</label>
      <input type=\"number\" id=\"inputId\" name=\"id\" required min=\"1\" />
    `;
  } else if (accionActual === 'agregar' || accionActual === 'editar') {
    // ID para editar, pero para agregar no se pide (se auto incrementa)
    if (accionActual === 'editar') {
      formAccion.innerHTML += `
        <label for=\"inputId\">ID:</label>
        <input type=\"number\" id=\"inputId\" name=\"id\" required min=\"1\" />
      `;
    }
    formAccion.innerHTML += `
      <label for=\"inputNombre\">Nombre:</label>
      <input type=\"text\" id=\"inputNombre\" name=\"nombre\" required />
      <label for=\"inputPrecio\">Precio:</label>
      <input type=\"number\" id=\"inputPrecio\" name=\"precio\" required min=\"0\" step=\"0.01\" />
      <label for=\"fileUpload\">Subir archivo (tipo file):</label>
      <input type=\"file\" id=\"fileUpload\" name=\"fileUpload\" accept=\"*/*\" />
    `;
  }
}

// Función para leer archivo como base64
function leerArchivoComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Funciones CRUD usando backend
async function agregarProductoBackend(categoria, nombre, precio, imagenFile) {
  let imagenBase64 = null;
  let imagenNombre = null;
  if (imagenFile) {
    imagenBase64 = await leerArchivoComoBase64(imagenFile);
    imagenNombre = imagenFile.name;
  }
  const body = JSON.stringify({ nombre, precio, imagenBase64, imagenNombre });
  const resp = await fetch(`/api/${categoria}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body
  });
  if (!resp.ok) {
    if (resp.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/admin/login.html';
      return;
    }
    alert('Error al agregar producto');
    return;
  }
  await cargarDatos();
}

async function editarProductoBackend(categoria, id, nombre, precio, imagenFile) {
  let imagenBase64 = null;
  let imagenNombre = null;
  if (imagenFile) {
    imagenBase64 = await leerArchivoComoBase64(imagenFile);
    imagenNombre = imagenFile.name;
  }
  const body = JSON.stringify({ nombre, precio, imagenBase64, imagenNombre });
  const resp = await fetch(`/api/${categoria}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body
  });
  if (!resp.ok) {
    if (resp.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/admin/login.html';
      return;
    }
    alert('Error al editar producto');
    return;
  }
  await cargarDatos();
}

async function eliminarProductoBackend(categoria, id) {
  const resp = await fetch(`/api/${categoria}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!resp.ok) {
    if (resp.status === 401) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/admin/login.html';
      return;
    }
    alert('Error al eliminar producto');
    return;
  }
  await cargarDatos();
}

// Eventos

categoriaSelect.addEventListener('change', () => {
  categoriaActual = categoriaSelect.value;
  mostrarTabla();
});

accionSelect.addEventListener('change', () => {
  accionActual = accionSelect.value;
  actualizarFormulario();
});

// Ejecutar acción al hacer click en el botón
btnEjecutarAccion.addEventListener('click', async e => {
  e.preventDefault();
  const formData = new FormData(formAccion);
  const fileInput = formAccion.querySelector('#fileUpload');
  const imagenFile = fileInput ? fileInput.files[0] : undefined;

  if (accionActual === 'agregar') {
    const nombre = formData.get('nombre').trim();
    const precio = formData.get('precio');
    if (!nombre || !precio || !imagenFile) {
      alert('Completa todos los campos y selecciona un archivo');
      return;
    }
    await agregarProductoBackend(categoriaActual, nombre, precio, imagenFile);
    formAccion.reset();
  } else if (accionActual === 'editar') {
    const id = parseInt(formData.get('id'));
    const nombre = formData.get('nombre').trim();
    const precio = formData.get('precio');
    // imagenFile es opcional en editar
    if (!id || !nombre || !precio) {
      alert('Completa todos los campos');
      return;
    }
    await editarProductoBackend(categoriaActual, id, nombre, precio, imagenFile);
    formAccion.reset();
  } else if (accionActual === 'eliminar') {
    const id = parseInt(formData.get('id'));
    if (!id) {
      alert('Completa el campo ID');
      return;
    }
    if (confirm(`¿Eliminar producto con ID ${id}?`)) {
      await eliminarProductoBackend(categoriaActual, id);
      formAccion.reset();
    }
  }
});

// Inicialización
if (verificarAutenticacion()) {
    cargarDatos().then(() => {
        actualizarFormulario();
        mostrarTabla();
    });
} 