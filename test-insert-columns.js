const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function testInsert() {
  // Test if 'email' or 'customer_email' is valid
  const test1 = await supabase.from("orders").insert({ order_number: "TEST-002", email: "test@example.com" });
  console.log("Insert with 'email':", test1.error ? test1.error.message : "Success");

  const test2 = await supabase.from("orders").insert({ order_number: "TEST-003", customer_email: "test@example.com" });
  console.log("Insert with 'customer_email':", test2.error ? test2.error.message : "Success");
}

testInsert();
