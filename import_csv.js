const fs = require('fs');
const path = require('path');
const { createSupabaseScriptClient } = require('./supabase-script-client');

const supabase = createSupabaseScriptClient();

// Simple CSV parser
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',').map(v => v.trim().replace(/\r/g, ''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

async function importBooks(rows) {
  const data = rows.map(item => ({
    title: item.title,
    author: item.author || null,
    language: item.language || 'Turkish',
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    description: item.description || null,
  }));
  const { error } = await supabase.from('books').insert(data);
  if (error) console.error('❌ Books error:', error.message);
  else console.log(`✅ ${data.length} kitap eklendi`);
}

async function importProducts(rows, category, mapRow) {
  const data = rows.map(mapRow).filter(Boolean);
  const { error } = await supabase.from('products').insert(data);
  if (error) console.error(`❌ ${category} error:`, error.message);
  else console.log(`✅ ${data.length} ${category} ürünü eklendi`);
}

async function main() {
  const csvDir = path.join(__dirname, '../blendartbook/scratch/csv');
  console.log('🚀 CSV import başlıyor...\n');

  // 1. Kitaplar → books table
  const booksCSV = fs.readFileSync(path.join(csvDir, '1_kitaplar.csv'), 'utf8');
  await importBooks(parseCSV(booksCSV));

  // 2. E-Kitaplar → products table
  const ebooksCSV = fs.readFileSync(path.join(csvDir, '2_ekitaplar.csv'), 'utf8');
  await importProducts(parseCSV(ebooksCSV), 'ebook', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'ebook',
    subcategory: item.language === 'Turkish' ? 'turkish' : 'english',
    details: { author: item.author, language: item.language, format: item.format },
  }));

  // 3. Sesli Kitaplar → products table
  const audiobooksCSV = fs.readFileSync(path.join(csvDir, '3_sesli_kitaplar.csv'), 'utf8');
  await importProducts(parseCSV(audiobooksCSV), 'audiobook', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'audiobook',
    subcategory: item.language === 'Turkish' ? 'turkish' : 'english',
    details: { author: item.author, language: item.language },
  }));

  // 4. Diğer Ürünler → products table
  const otherCSV = fs.readFileSync(path.join(csvDir, '4_diger_urunler.csv'), 'utf8');
  await importProducts(parseCSV(otherCSV), 'other', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'other',
    details: { brand: item.brand, material: item.material },
  }));

  // 5. Hediyelik → products table
  const giftsCSV = fs.readFileSync(path.join(csvDir, '5_hediyelik.csv'), 'utf8');
  await importProducts(parseCSV(giftsCSV), 'gift', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'gift',
    subcategory: (item.target || 'unisex').toLowerCase(),
    details: { material: item.material, brand: item.brand, target: (item.target || 'unisex').toLowerCase() },
  }));

  // 6. Sanat → products table
  const artCSV = fs.readFileSync(path.join(csvDir, '6_sanat.csv'), 'utf8');
  await importProducts(parseCSV(artCSV), 'art', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'art',
    subcategory: (item.subcategory || 'other').toLowerCase(),
    details: { artist: item.artist, dimensions: item.dimensions },
  }));

  // 7. El Yapımı → products table
  const handmadeCSV = fs.readFileSync(path.join(csvDir, '7_el_yapimi.csv'), 'utf8');
  await importProducts(parseCSV(handmadeCSV), 'handmade', item => ({
    title: item.title,
    price: parseFloat(item.price) || 0,
    stock: parseInt(item.stock, 10) || 0,
    image_url: item.image_url || null,
    category: 'handmade',
    details: { material: item.material, creator: item.creator },
  }));

  console.log('\n🎉 Tüm veriler yüklendi! Web siteni yenile.');
}

main().catch(console.error);
