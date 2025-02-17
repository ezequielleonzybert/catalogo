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
    productCatalog.innerHTML = ''; // Clear existing content
    for (const product of products) {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        // Construct the image URL for "1.png" or "1.jpg"
        const formattedName = formatProductName(product.name);
        const imageUrlPng = `${baseImageUrl}${formattedName}/1.png`;
        const imageUrlJpg = `${baseImageUrl}${formattedName}/1.jpg`;

        // Try to load both images and use the first one that loads successfully
        let imageUrl;
        try {
            imageUrl = await loadImage(imageUrlPng);
        } catch {
            imageUrl = await loadImage(imageUrlJpg);
        }

        // Create an image element and set the src attribute
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = product.name;
        // img.loading = 'lazy'; // Enable lazy loading

        // Append the image element to the product element
        productElement.appendChild(img);

        // Add the rest of the product details
        const productDetails = `
            <h2>${product.name}</h2>
            <p class="price">$${product.price}</p>
        `;
        productElement.innerHTML += productDetails;

        productCatalog.appendChild(productElement);
    }
}