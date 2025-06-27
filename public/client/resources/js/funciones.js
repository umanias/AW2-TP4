export function renderizadoPrendas(contenedor, opciones = {}) {
    const esInicio = opciones.home === true;
    const porPagina = esInicio ? 5 : 10;
    let pagina = 1;
    const paginador = document.querySelector('.pagination-container .pagination');
    function renderizar(paginaActual) {
        fetch('/api/v1/articulos')
            .then((respuesta) => respuesta.json())
            .then((productos) => {
                const prendas = productos.filter(p => p.tipo === 'prenda');
                contenedor.innerHTML = '';
                const inicio = (paginaActual - 1) * porPagina;
                const fin = inicio + porPagina;
                prendas.slice(inicio, fin).forEach(producto => {
                    const prendaHTML = `
                        <article class="producto-card">
                            <img src="${producto.imagen}" alt="Prenda: ${producto.nombre}" class="producto-img">
                            <div class="producto-info">
                                <h3 class="producto-nombre">${producto.nombre}</h3>
                                <p class="producto-precio">Precio: $ ${producto.precio}</p>
                                <button class="btn-agregar">Añadir al Carrito</button>
                            </div>
                        </article>  
                    `;
                    contenedor.innerHTML += prendaHTML;
                });
                // Paginador
                if (!esInicio && prendas.length > porPagina && paginador) {
                    const totalPaginas = Math.ceil(prendas.length / porPagina);
                    actualizarPaginadorHTML(paginaActual, totalPaginas, (nuevaPag) => {
                        pagina = nuevaPag;
                        renderizar(pagina);
                    }, paginador);
                } else if (paginador) {
                    paginador.innerHTML = '';
                }
            });
    }
    renderizar(pagina);
}

export function renderizadoAccesorios(contenedor, opciones = {}) {
    const esInicio = opciones.home === true;
    const porPagina = esInicio ? 5 : 10;
    let pagina = 1;
    const paginador = document.querySelector('.pagination-container .pagination');
    function renderizar(paginaActual) {
        fetch('/api/v1/articulos')
            .then((respuesta) => respuesta.json())
            .then((productos) => {
                const accesorios = productos.filter(p => p.tipo === 'accesorio');
                contenedor.innerHTML = '';
                const inicio = (paginaActual - 1) * porPagina;
                const fin = inicio + porPagina;
                accesorios.slice(inicio, fin).forEach(producto => {
                    const accesorioHTML = `
                        <article class="producto-card">
                            <img src="${producto.imagen}" alt="Accesorio: ${producto.nombre}" class="producto-img">
                            <div class="producto-info">
                                <h3 class="producto-nombre">${producto.nombre}</h3>
                                <p class="producto-precio">Precio: $ ${producto.precio}</p>
                                <button class="btn-agregar">Añadir al Carrito</button>
                            </div>
                        </article>  
                    `;
                    contenedor.innerHTML += accesorioHTML;
                });
                // Paginador
                if (!esInicio && accesorios.length > porPagina && paginador) {
                    const totalPaginas = Math.ceil(accesorios.length / porPagina);
                    actualizarPaginadorHTML(paginaActual, totalPaginas, (nuevaPag) => {
                        pagina = nuevaPag;
                        renderizar(pagina);
                    }, paginador);
                } else if (paginador) {
                    paginador.innerHTML = '';
                }
            });
    }
    renderizar(pagina);
}

function actualizarPaginadorHTML(paginaActual, totalPaginas, onPageChange, paginador) {
    // Limpiar botones actuales
    paginador.innerHTML = '';
    // Botón anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'page-btn';
    btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => { if (paginaActual > 1) onPageChange(paginaActual - 1); };
    paginador.appendChild(btnAnterior);
    // Botones de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === paginaActual ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => { if (i !== paginaActual) onPageChange(i); };
        paginador.appendChild(btn);
    }
    // Botón siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = 'page-btn';
    btnSiguiente.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => { if (paginaActual < totalPaginas) onPageChange(paginaActual + 1); };
    paginador.appendChild(btnSiguiente);
}

export function setupDropdownMenu(userBtnId, menuId, arrowId) {
    const userProfileBtn = document.getElementById(userBtnId);
    const dropdownMenu = document.getElementById(menuId);
    const profileArrow = document.getElementById(arrowId);

    if (!userProfileBtn || !dropdownMenu || !profileArrow) return;

    userProfileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
        profileArrow.classList.toggle("rotate");
    });

    document.addEventListener("click", () => {
        dropdownMenu.classList.remove("show");
        profileArrow.classList.remove("rotate");
    });
}

export function togglePasswordVisibility(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);

    if (!passwordInput || !toggleButton) return;

    toggleButton.addEventListener('click', () => {
        const icon = toggleButton.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

export function marcarBotonActivo() {
    const botones = document.querySelectorAll('.sidebar-button');
    const currentPath = window.location.pathname;

    botones.forEach(boton => {
        const botonHref = boton.getAttribute('href');
        const botonUrl = new URL(botonHref, window.location.origin);
        const botonPath = botonUrl.pathname;

        if (botonPath === currentPath) {
            boton.classList.add('active');
        } else {
            boton.classList.remove('active');
        }
    });
}