const productCatalog = document.getElementById('products');
const body = document.body;
body.style.width = screen.width.toString();
body.style.height = screen.height.toString();

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
        const [name, price, description, category] = row.split(',');
        return { name, price, description, category: category.trim() };
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
    productCatalog.innerHTML = '';
    for (const product of products) {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-category', product.category); // Agregar categoría

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

        productCatalog.appendChild(productElement);
    }
}

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.categoria input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.getAttribute('data-category'));

    document.querySelectorAll('.product').forEach(product => {
        const productCategory = product.getAttribute('data-category');
        product.style.display = selectedCategories.length === 0 || selectedCategories.includes(productCategory)
            ? 'block'
            : 'none';
    });
}

document.querySelectorAll('.categoria input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});

const categorias = document.getElementsByClassName('categorias')[0];
const products = document.getElementById('products');
const arrow = document.getElementById('arrow');
let categorias_height = categorias.clientHeight;
let prev_categorias_height = categorias_height;
let prev_width = window.innerWidth;
let current_width = window.innerWidth;

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

window.addEventListener("resize", () => {
    current_width = window.innerWidth
    if (current_width < 800) {
        categorias_height = categorias.clientHeight;
        if (prev_width >= 800 && !categorias.classList.contains('disappear')) {
            products.style.transform = "translateY(" + (categorias_height + 20).toString() + "px)";
        }
        else if (categorias_height != prev_categorias_height && !categorias.classList.contains('disappear')) {
            products.style.transform = "translateY(" + (categorias_height + 20).toString() + "px)";
            prev_categorias_height = categorias_height;
        }
    }
    else if (current_width >= 800 && prev_width < 800) {
        products.style.transform = "translateY(0)";
    }
    prev_width = current_width;
});