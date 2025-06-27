import {
    renderizadoPrendas,
    renderizadoAccesorios, 
    setupDropdownMenu, 
    togglePasswordVisibility,
    marcarBotonActivo
} from "./funciones.js";

const contenedorPrendas = document.getElementById('prendas-productos');
const contenedorAccesorios = document.getElementById('accesorios-productos');

const isHome = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '/public/client/html/index.html';

if (contenedorPrendas) {
    renderizadoPrendas(contenedorPrendas, isHome ? {home: true} : {});
}

if (contenedorAccesorios) {
    renderizadoAccesorios(contenedorAccesorios, isHome ? {home: true} : {});
}

document.addEventListener("DOMContentLoaded", () => {
    marcarBotonActivo();
    setupDropdownMenu("userProfileBtn", "dropdownMenu", "profileArrow");
});

togglePasswordVisibility("password", "togglePassword");

document.addEventListener('DOMContentLoaded', function () {
    const togglePasswordButtons = document.querySelectorAll('.toggle-password-btn');

    if (togglePasswordButtons.length > 0) {
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function () {
                const passwordField = this.previousElementSibling;

                if (passwordField && passwordField.type) {
                    const isPassword = passwordField.type === 'password';
                    passwordField.type = isPassword ? 'text' : 'password';

                    const icon = this.querySelector('i');
                    if (icon) {
                        if (isPassword) {
                            icon.classList.remove('fa-eye');
                            icon.classList.add('fa-eye-slash');
                        } else {
                            icon.classList.remove('fa-eye-slash');
                            icon.classList.add('fa-eye');
                        }
                    }
                }
            });
        });
    }

    // Actualizar stat-card de productos disponibles
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        fetch('/api/v1/articulos')
            .then(res => res.json())
            .then(productos => {
                const path = window.location.pathname;
                let cantidad = 0;
                let texto = 'Productos Disponibles';
                if (path.includes('prendas.html')) {
                    cantidad = productos.filter(p => p.tipo === 'prenda').length;
                    texto = 'Prendas Disponibles';
                } else if (path.includes('accesorios.html')) {
                    cantidad = productos.filter(p => p.tipo === 'accesorio').length;
                    texto = 'Accesorios Disponibles';
                } else {
                    cantidad = productos.length;
                }
                // Buscar el stat-card correcto (el primero siempre es el de productos)
                const statCard = statCards[0];
                const h3 = statCard.querySelector('h3');
                const p = statCard.querySelector('.stat-number');
                if (h3 && p) {
                    h3.textContent = texto;
                    p.textContent = cantidad.toLocaleString('es-AR');
                }
            });
    }
});

// Función para obtener el valor de una cookie por nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Redirección a login si no hay cookie 'token' y no estamos en login o registro
const path = window.location.pathname;
const isAuthPage = path.includes('login.html') || path.includes('registro.html') || path.includes('recuperar.html');
if (!isAuthPage && !getCookie('token')) {
    window.location.href = '/auth/login.html';
}

// Redirección a index si el usuario ya está logueado y está en una página de auth
const authPages = ["login.html", "registro.html", "recuperar.html"];
if (getCookie('token') && authPages.some(p => window.location.pathname.includes(p))) {
    window.location.href = '/index.html';
}

// Función para decodificar el payload de un JWT
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Ocultar botón 'Agregar' si el usuario no es administrador
function ocultarBotonAgregarSiNoAdmin() {
    const token = getCookie('token');
    console.log('[DEBUG] Token:', token);
    if (!token) {
        document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
            btn.style.display = 'none';
            btn.onclick = () => window.location.href = '/admin/login.html';
        });
        console.log('[DEBUG] No token, ocultando botón');
        return;
    }
    const payload = parseJwt(token);
    console.log('[DEBUG] Payload:', payload);
    // Mostrar solo si es Administrador
    if (payload && payload.rol === 'Administrador') {
        document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
            btn.style.display = 'inline-block';
            btn.onclick = () => window.location.href = '/admin/';
        });
        console.log('[DEBUG] Usuario es Administrador, mostrando botón');
    } else {
        document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
            btn.style.display = 'none';
            btn.onclick = () => window.location.href = '/admin/login.html';
        });
        console.log('[DEBUG] Usuario NO es Administrador, ocultando botón');
    }
}

document.addEventListener('DOMContentLoaded', ocultarBotonAgregarSiNoAdmin);

function mostrarLogoutSiLogueado() {
    const token = getCookie('token');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownMenu) return;
    const dropdownContent = dropdownMenu.querySelector('.dropdown-content');
    if (!dropdownContent) return;
    const loginBtn = dropdownContent.querySelector('[data-action="login"]');
    const signupBtn = dropdownContent.querySelector('[data-action="signup"]');
    let logoutBtn = dropdownContent.querySelector('[data-action="logout"]');

    if (token) {
        // Ocultar Log In y Sign Up
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        // Agregar Log Out si no existe
        if (!logoutBtn) {
            logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'dropdown-item';
            logoutBtn.setAttribute('data-action', 'logout');
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log Out';
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                window.location.href = "/auth/login.html";
            };
            dropdownContent.appendChild(logoutBtn);
        } else {
            logoutBtn.style.display = '';
        }
    } else {
        // Mostrar Log In y Sign Up
        if (loginBtn) loginBtn.style.display = '';
        if (signupBtn) signupBtn.style.display = '';
        // Ocultar Log Out si existe
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', mostrarLogoutSiLogueado);