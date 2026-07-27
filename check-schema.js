const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function checkSchema() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error fetching orders:", error);
  } else {
    console.log("Schema columns for 'orders':", data.length > 0 ? Object.keys(data[0]) : "No rows in orders table to inspect.");
  }
}

checkSchema();
