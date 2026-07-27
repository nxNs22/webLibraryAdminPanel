const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

const columnsToTest = [
  "id",
  "created_at",
  "order_number",
  "customer_name",
  "customer_email",
  "customer_phone",
  "shipping_country",
  "total_amount",
  "discount_amount",
  "status",
  "payment_status",
  "user_id"
];

async function testEach() {
  for (const col of columnsToTest) {
    const payload = {};
    if (col === "id" || col === "user_id") {
      payload[col] = "00000000-0000-0000-0000-000000000000";
    } else if (col === "total_amount" || col === "discount_amount") {
      payload[col] = 100;
    } else {
      payload[col] = "test";
    }

    const { error } = await supabase.from("orders").insert(payload);
    if (error) {
      if (error.code === "PGRST204") {
        console.log(`Column '${col}': DOES NOT EXIST`);
      } else {
        console.log(`Column '${col}': EXISTS (Code: ${error.code}, Msg: ${error.message})`);
      }
    } else {
      console.log(`Column '${col}': EXISTS (Success)`);
    }
  }
}

testEach();
