// Initialize Supabase
const supabaseUrl = 'https://fquuhzfdyjxcmzeopvcn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdXVoemZkeWp4Y216ZW9wdmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNjMwMjEsImV4cCI6MjA1NDkzOTAyMX0.h2P5N1RBHROE54D2CQ0a_Kx0h0RGwU9w2_i6X0o3lhw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized:', supabase);

// Add product form submission
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const barcode = document.getElementById('product-barcode').value;
  const stock = parseInt(document.getElementById('product-stock').value);
  const image = document.getElementById('product-image').value;

  // Validate inputs
  if (!name || !price || !barcode || !stock || !image) {
    alert('Please fill in all fields!');
    return;
  }

  // Log the product data
  console.log('Inserting product:', { name, price, barcode, stock, image });

  // Insert product into Supabase
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, barcode, stock, image }]);

  if (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product. Please try again.');
    return;
  }

  // Log success
  console.log('Product added successfully:', data);

  // Clear the form
  document.getElementById('add-product-form').reset();

  // Refresh the product list
  fetchProducts();

  alert('Product added successfully!');
});

// Fetch and display products
async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  data.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="100">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <p>Stock: ${product.stock}</p>
    `;
    productList.appendChild(productElement);
  });
}