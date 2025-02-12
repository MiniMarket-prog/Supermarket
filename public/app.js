// Initialize Supabase
const supabaseUrl = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdXVoemZkeWp4Y216ZW9wdmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNjMwMjEsImV4cCI6MjA1NDkzOTAyMX0.h2P5N1RBHROE54D2CQ0a_Kx0h0RGwU9w2_i6X0o3lhw';
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

// Initialize
fetchProducts();
fetchStockAlerts();