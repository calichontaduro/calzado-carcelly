// Elementos del DOM
const filterMonth = document.getElementById('filterMonth');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const productRows = document.querySelectorAll('.row.row-cols-1');
const allProducts = document.querySelectorAll('.product-item');
const productCount = document.getElementById('productCount');

// Estado de la aplicación
let currentFilters = {
    month: 'all',
    sort: 'recent',
    search: ''
};

// Función para aplicar filtros
function applyFilters() {
    let visibleProducts = 0;

    allProducts.forEach(product => {
        const productMonth = product.dataset.month;
        const productName = product.dataset.name.toLowerCase();

        // Verificar filtros
        const matchesMonth = currentFilters.month === 'all' || productMonth === currentFilters.month;
        const matchesSearch = currentFilters.search === '' || productName.includes(currentFilters.search.toLowerCase());

        // Mostrar u ocultar producto
        if (matchesMonth && matchesSearch) {
            product.classList.remove('hidden');
            visibleProducts++;
        } else {
            product.classList.add('hidden');
        }
    });

    // Actualizar contador
    updateProductCount(visibleProducts);

    // Aplicar ordenamiento
    applySorting();
}

// Función para ordenar productos
function applySorting() {
    if (currentFilters.sort === 'recent') return; // No reordenar si es "recientes"

    const visibleProducts = Array.from(allProducts).filter(p => !p.classList.contains('hidden'));
    const container = visibleProducts[0]?.parentElement;

    if (!container) return;

    visibleProducts.sort((a, b) => {
        const nameA = a.dataset.name;
        const nameB = b.dataset.name;

        switch (currentFilters.sort) {
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            default:
                return 0;
        }
    });

    // Reordenar en el DOM
    visibleProducts.forEach(product => {
        container.appendChild(product);
    });
}

// Función para actualizar contador de productos
function updateProductCount(visible) {
    productCount.innerHTML = `Mostrando <strong>${visible}</strong> novedades`;
}

// Event Listeners para filtros
filterMonth.addEventListener('change', (e) => {
    currentFilters.month = e.target.value;
    applyFilters();
});

sortBy.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    applyFilters();
});

// Event Listener para búsqueda
searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    applyFilters();
});

// Event Listeners para cambio de vista
gridView.addEventListener('click', () => {
    productRows.forEach(row => {
        row.classList.remove('list-view');
        row.classList.add('row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4');
    });
    gridView.classList.add('active');
    listView.classList.remove('active');
});

listView.addEventListener('click', () => {
    productRows.forEach(row => {
        row.classList.add('list-view');
        row.classList.remove('row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4');
    });
    listView.classList.add('active');
    gridView.classList.remove('active');
});

// Animación suave al hacer scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Inicializar contador al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    updateProductCount(allProducts.length);
});

// Efecto de hover en las cards
allProducts.forEach(product => {
    const card = product.querySelector('.card');

    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 15px 30px rgba(0, 129, 241, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});