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