const productCatalog = document.getElementById('products');

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
    const rows = data.split('\n').slice(1); // Skip header row
    return rows.map(row => {
        const [name, price, description] = row.split(',');
        return { name, price, description };
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

        const formattedName = formatProductName(product.name);


        const imageUrl = `${baseImageUrl}${formattedName}/0.webp`;

        // Create an image element and set the src attribute
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = product.name;
        // img.loading = 'lazy'; // Enable lazy loading

        // Append the image element to the product element
        productElement.appendChild(img);

        // Add the rest of the product details
        const formattedPrice = Number(product.price).toLocaleString('es-AR');
        const productDetails = `
            <h2>${product.name}</h2>
            <p class="price">$${formattedPrice}</p>
        `;
        productElement.innerHTML += productDetails;

        productCatalog.appendChild(productElement);
    }
}

function toggleCategorias() {
    const categorias = document.getElementById('categorias');
    const arrow = document.getElementById('arrow');
    if (categorias.style.display === 'none' || categorias.style.display === '') {
        categorias.style.display = 'flex';
        arrow.classList.add('rotate180');
    } else {
        categorias.style.display = 'none';
        arrow.classList.remove('rotate180');
    }
}