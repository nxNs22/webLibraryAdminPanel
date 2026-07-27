const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function testInsert() {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: "TEST-001",
      total_amount: 100.00
    })
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success:", data);
  }
}

testInsert();
