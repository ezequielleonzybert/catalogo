// This file contains the JavaScript code that reads the CSV file, processes the product data, and dynamically updates the product catalog displayed on the webpage.

const productCatalog = document.getElementById('product-catalog');

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
        const [name, price, description, imageUrl] = row.split(',');
        return { name, price, description, imageUrl };
    });
}

function checkImageExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

async function renderProducts(products) {
    productCatalog.innerHTML = ''; // Clear existing content
    for (const product of products) {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        // Construct the image URL for "1.png" or "1.jpg"
        const imageUrlPng = `${product.imageUrl}1.png`;
        const imageUrlJpg = `${product.imageUrl}1.jpg`;

        // Determine which image URL to use
        const imageUrl = await checkImageExists(imageUrlPng) ? imageUrlPng : imageUrlJpg;

        // Create an image element and set the src attribute
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = product.name;

        // Append the image element to the product element
        productElement.appendChild(img);

        // Add the rest of the product details
        const productDetails = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
        `;
        productElement.innerHTML += productDetails;

        productCatalog.appendChild(productElement);
    }
}