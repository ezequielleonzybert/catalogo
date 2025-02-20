const body = document.body;
body.style.width = screen.width.toString();
body.style.height = screen.height.toString();
const categorias = document.getElementsByClassName('categorias')[0];
const products = document.getElementById('products');
const arrow = document.getElementById('arrow');
let categorias_height = categorias.clientHeight;
let prev_categorias_height = categorias_height;
let prev_width = window.innerWidth;
let current_width = window.innerWidth;

// Detect if running on GitHub Pages or local server
const isGitHubPages = location.hostname === 'ezequielleonzybert.github.io';
const baseImageUrl = isGitHubPages
    ? 'https://raw.githubusercontent.com/ezequielleonzybert/catalogo/refs/heads/main/docs/images/'
    : 'images/';

fetch('data/products.csv')
    .then(response => response.text())
    .then(data => {
        const products = parseCSV(data);
        renderProducts(products);
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Omitir la cabecera
    return rows.map(row => {
        const [name, price, description, category, tags] = row.split(',');
        return {
            name,
            price,
            description,
            category: category ? category.trim() : '',
            tags: tags ? tags.toLowerCase().trim() : ''
        };
    });
}

function formatProductName(name) {
    return name.toLowerCase().replace(/ /g, '_');
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
    });
}

async function renderProducts(products) {
    products.innerHTML = '';
    for (const product of products) {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-category', product.category);
        productElement.setAttribute('data-tags', product.tags); // Guardar los tags

        const formattedName = formatProductName(product.name);
        const imageUrl = `${baseImageUrl}${formattedName}/0.webp`;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = product.name;

        productElement.appendChild(img);

        const formattedPrice = Number(product.price).toLocaleString('es-AR');
        productElement.innerHTML += `
            <h2>${product.name}</h2>
            <p class="price">$${formattedPrice}</p>
        `;

        products.appendChild(productElement);
    }
}

function filterAndSearchProducts() {
    const query = searchbox.value.toLowerCase().trim();
    const keywords = query.split(/\s+/); // Divide en palabras separadas

    const selectedCategories = Array.from(document.querySelectorAll('.categoria input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.getAttribute('data-category'));

    document.querySelectorAll('.product').forEach(product => {
        const tags = product.getAttribute('data-tags') || '';
        const productCategory = product.getAttribute('data-category');

        // Verifica si todas las palabras están en los tags
        const matchesSearch = keywords.every(word => tags.includes(word));

        // Verifica si el producto pertenece a una de las categorías seleccionadas
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);

        // Mostrar solo si cumple ambas condiciones
        product.style.display = matchesSearch && matchesCategory ? 'flex' : 'none';
    });
}

// Conectar la función a los eventos de búsqueda y selección de categorías
const searchbox = document.getElementById('searchbox');
searchbox.addEventListener('input', filterAndSearchProducts);
document.querySelectorAll('.categoria input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterAndSearchProducts);
});

function toggleCategorias() {
    if (window.innerWidth < 800) {
        categorias_height = categorias.clientHeight;
        if (categorias.classList.contains('disappear')) {
            arrow.classList.add('rotate180');
            categorias.classList.remove('disappear');
            categorias.style.transform = "translateY(20px)";
            products.style.transform = "translateY(" + (categorias_height + 20).toString() + "px)";
        } else {
            categorias.classList.add('disappear');
            categorias.style.transform = "translateY(0)";
            products.style.transform = "translateY(0)";
            arrow.classList.remove('rotate180');
            products.classList.remove('move');
        }
    }
}