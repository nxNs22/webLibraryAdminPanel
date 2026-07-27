const { createSupabaseScriptClient } = require("./supabase-script-client");

const supabase = createSupabaseScriptClient();

async function fetchProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
  } else {
    console.log("Profiles in database:", data);
  }
}

fetchProfiles();
