const { createSupabaseScriptClient, requireEnv } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();
const adminEmail = requireEnv("SEED_ADMIN_EMAIL");
const adminPassword = requireEnv("SEED_ADMIN_PASSWORD");

async function signupAndInsert() {
  console.log("Registering admin user...");
  
  // Try to sign up the admin user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword
  });

  let userId;
  if (signUpError) {
    if (signUpError.message.includes("already registered")) {
      console.log("User already exists, logging in...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });
      if (signInError) {
        console.error("Login failed:", signInError);
        return;
      }
      userId = signInData.user.id;
    } else {
      console.error("Signup failed:", signUpError);
      return;
    }
  } else {
    console.log("Signup success!");
    userId = signUpData.user.id;
  }

  console.log("User ID:", userId);

  // Now insert a sample order for this logged-in user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      order_number: "ORD-2026-001",
      total_amount: 198.99,
      status: "pending",
      payment_status: "paid"
    })
    .select();

  if (orderError) {
    console.error("Order insert error:", orderError);
  } else {
    console.log("Order insert success:", order);

    // Insert item
    const { data: item, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order[0].id,
        product_title: "Suç ve Ceza (Kitap)",
        quantity: 1,
        price_at_purchase: 180.00
      })
      .select();

    if (itemError) {
      console.error("Item insert error:", itemError);
    } else {
      console.log("Item insert success:", item);
    }
  }
}

signupAndInsert();
