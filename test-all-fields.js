const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function testAllFields() {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: "Test Customer",
      customer_phone: "1234567890",
      shipping_country: "Turkey",
      total_amount: 150.00,
      discount_amount: 0,
      status: "pending",
      payment_status: "pending",
      order_number: "BLND-TEST"
    })
    .select();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Columns on 'orders':", Object.keys(data[0]));
    console.log("Record:", data[0]);
  }
}

testAllFields();
