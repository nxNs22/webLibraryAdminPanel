const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function seedOrders() {
  console.log("Seeding sample orders...");

  // 1. Insert sample orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .insert([
      {
        order_number: "ORD-2026-001",
        customer_name: "Ahmet Yılmaz",
        customer_email: "ahmet.yilmaz@example.com",
        total_amount: 198.99,
        status: "pending",
        payment_status: "paid"
      },
      {
        order_number: "ORD-2026-002",
        customer_name: "Ayşe Demir",
        customer_email: "ayse.demir@example.com",
        total_amount: 89.50,
        status: "shipped",
        payment_status: "paid"
      },
      {
        order_number: "ORD-2026-003",
        customer_name: "Can Kaya",
        customer_email: "can.kaya@example.com",
        total_amount: 45.00,
        status: "delivered",
        payment_status: "paid"
      }
    ])
    .select();

  if (ordersError) {
    console.error("Error inserting orders:", ordersError);
    return;
  }

  console.log("Inserted orders:", orders);

  // 2. Insert order items
  const items = [
    {
      order_id: orders[0].id,
      product_title: "Suç ve Ceza (Kitap)",
      quantity: 1,
      price_at_purchase: 180.00
    },
    {
      order_id: orders[0].id,
      product_title: "Deri Kitap Ayracı",
      quantity: 1,
      price_at_purchase: 18.99
    },
    {
      order_id: orders[1].id,
      product_title: "Dijital 1984 (E-Kitap)",
      quantity: 1,
      price_at_purchase: 9.50
    },
    {
      order_id: orders[1].id,
      product_title: "El Yapımı Deri Kitap Kılıfı",
      quantity: 1,
      price_at_purchase: 80.00
    },
    {
      order_id: orders[2].id,
      product_title: "Tasarım Kitap Ayracı",
      quantity: 1,
      price_at_purchase: 45.00
    }
  ];

  const { data: insertedItems, error: itemsError } = await supabase
    .from("order_items")
    .insert(items)
    .select();

  if (itemsError) {
    console.error("Error inserting order items:", itemsError);
    return;
  }

  console.log("Inserted order items successfully!");
}

seedOrders();
