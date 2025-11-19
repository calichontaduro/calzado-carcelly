// Elementos del DOM
const filterCategory = document.getElementById('filterCategory');
const filterStyle = document.getElementById('filterStyle');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');
const productRows = document.querySelectorAll('.row.row-cols-1');
const allProducts = document.querySelectorAll('.product-item');
const productCount = document.getElementById('productCount');

// Estado de la aplicación
let currentFilters = {
    category: 'all',
    style: 'all',
    sort: 'recent',
    search: ''
};

// Función para aplicar filtros
function applyFilters() {
    let visibleProducts = 0;
    const totalProducts = allProducts.length;
    
    // Ocultar/mostrar secciones completas según categoría
    const sections = document.querySelectorAll('section[data-category]');
    sections.forEach(section => {
        const sectionCategory = section.dataset.category;
        if (currentFilters.category === 'all' || currentFilters.category === sectionCategory) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Filtrar productos
    allProducts.forEach(product => {
        const productCategory = product.dataset.category;
        const productStyle = product.dataset.style;
        const productName = product.dataset.name.toLowerCase();
        
        // Verificar filtros
        const matchesCategory = currentFilters.category === 'all' || productCategory === currentFilters.category;
        const matchesStyle = currentFilters.style === 'all' || productStyle === currentFilters.style;
        const matchesSearch = currentFilters.search === '' || productName.includes(currentFilters.search.toLowerCase());
        
        // Mostrar u ocultar producto
        if (matchesCategory && matchesStyle && matchesSearch) {
            product.classList.remove('hidden');
            visibleProducts++;
        } else {
            product.classList.add('hidden');
        }
    });
    
    // Actualizar contador
    updateProductCount(visibleProducts, totalProducts);
    
    // Aplicar ordenamiento
    applySorting();
}

// Función para ordenar productos
function applySorting() {
    if (currentFilters.sort === 'recent') return; // No reordenar si es "recientes"
    
    // Ordenar productos dentro de cada sección
    const sections = document.querySelectorAll('section[data-category]');
    
    sections.forEach(section => {
        const sectionProducts = Array.from(section.querySelectorAll('.product-item:not(.hidden)'));
        const container = section.querySelector('.row');
        
        if (!container || sectionProducts.length === 0) return;
        
        sectionProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.dataset.name;
            const nameB = b.dataset.name;
            
            switch (currentFilters.sort) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'popular':
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });
        
        // Reordenar solo dentro de esta sección
        sectionProducts.forEach(product => {
            container.appendChild(product);
        });
    });
}

// Función para actualizar contador de productos
function updateProductCount(visible, total) {
    productCount.innerHTML = `Mostrando <strong>${visible}</strong> de <strong>${total}</strong> productos`;
}

// Event Listeners para filtros
filterCategory.addEventListener('change', (e) => {
    currentFilters.category = e.target.value;
    applyFilters();
});

filterStyle.addEventListener('change', (e) => {
    currentFilters.style = e.target.value;
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

// Paginación
const paginationLinks = document.querySelectorAll('.pagination .page-link');
let currentPage = 1;

paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const parent = e.target.closest('.page-item');
        if (parent.classList.contains('disabled') || parent.classList.contains('active')) {
            return;
        }
        
        const text = e.target.textContent;
        
        if (text === 'Anterior') {
            if (currentPage > 1) currentPage--;
        } else if (text === 'Siguiente') {
            if (currentPage < 3) currentPage++;
        } else {
            currentPage = parseInt(text);
        }
        
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function updatePagination() {
    const pageItems = document.querySelectorAll('.pagination .page-item');
    
    pageItems.forEach((item, index) => {
        item.classList.remove('active', 'disabled');
        
        // Deshabilitar "Anterior" en página 1
        if (index === 0 && currentPage === 1) {
            item.classList.add('disabled');
        }
        
        // Deshabilitar "Siguiente" en última página
        if (index === pageItems.length - 1 && currentPage === 3) {
            item.classList.add('disabled');
        }
        
        // Marcar página actual
        const linkText = item.querySelector('.page-link').textContent;
        if (linkText === currentPage.toString()) {
            item.classList.add('active');
        }
    });
}

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
    updateProductCount(allProducts.length, allProducts.length);
});

// Efecto de hover en las cards (opcional - añade interactividad)
allProducts.forEach(product => {
    const card = product.querySelector('.card');
    
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 15px 30px rgba(0, 129, 241, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});