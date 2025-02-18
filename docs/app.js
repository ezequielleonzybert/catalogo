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

const categorias = document.getElementsByClassName('categorias')[0];
let categorias_height = categorias.clientHeight;
const products = document.getElementById('products');
const arrow = document.getElementById('arrow');

function toggleCategorias() {
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

window.addEventListener("resize", () => {
    if (window.innerWidth < 800 && !categorias.classList.contains('disappear')) {
        categorias_height = categorias.clientHeight;
        products.style.transform = "translateY(" + (categorias_height + 20).toString() + "px)";
    }
    else {
        // categorias.style.opacity = "0";
        console.log(1)
        products.style.transform = "translateY(0)";
    }
});