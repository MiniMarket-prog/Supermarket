// Initialize Supabase
const supabaseUrl = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdXVoemZkeWp4Y216ZW9wdmNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTM2MzAyMSwiZXhwIjoyMDU0OTM5MDIxfQ.l3jv03EdL0gRauoHwN17BVAw0_sXXkHN7CBMPgKGyu8';
const supabaseKey = 'https://fquuhzfdyjxcmzeopvcn.supabase.co';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

// Record a sale
document.getElementById('sale-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const barcode = document.getElementById('barcode').value;
  const quantity = parseInt(document.getElementById('quantity').value);

  // Fetch product by barcode
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single();

  if (error || !product) {
    alert('Product not found!');
    return;
  }

  if (product.stock < quantity) {
    alert('Not enough stock!');
    return;
  }
  

  // Update stock
  const newStock = product.stock - quantity;
  await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', product.id);

  // Record sale
  await supabase
    .from('sales')
    .insert([{ product_id: product.id, quantity, total_price: product.price * quantity }]);

  alert('Sale recorded successfully!');
  fetchProducts();
});

// Fetch stock alerts
async function fetchStockAlerts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lt('stock', 5); // Products with stock less than 5

  if (error) {
    console.error('Error fetching stock alerts:', error);
    return;
  }

  const stockAlerts = document.getElementById('stock-alerts');
  stockAlerts.innerHTML = '';
  data.forEach(product => {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.innerHTML = `
      <h3>${product.name}</h3>
      <p>Stock: ${product.stock}</p>
    `;
    stockAlerts.appendChild(alertElement);
  });
}
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

  // Insert product into Supabase
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, barcode, stock, image }]);

  if (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product. Please try again.');
    return;
  }

  // Clear the form
  document.getElementById('add-product-form').reset();

  // Refresh the product list
  fetchProducts();

  alert('Product added successfully!');
});
// Initialize
fetchProducts();
fetchStockAlerts();