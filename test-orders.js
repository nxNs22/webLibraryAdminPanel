const { createSupabaseScriptClient, requireEnv } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();
const testAuthEmail = requireEnv("TEST_AUTH_EMAIL");
const testAuthPassword = requireEnv("TEST_AUTH_PASSWORD");

async function checkColumns() {
  // Login first
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: testAuthEmail,
    password: testAuthPassword
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  console.log("Logged in successfully as:", authData.user.email);

  const { data, error } = await supabase
    .from("orders")
    .insert({})
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Success! Columns on 'orders' table:", Object.keys(data[0]));
    console.log("Full record:", data[0]);
  }
}

checkColumns();
