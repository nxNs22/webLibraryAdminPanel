const { createClient } = require("@supabase/supabase-js");

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}. Set it before running this script.`);
  }

  return value;
}

function createSupabaseScriptClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

module.exports = {
  createSupabaseScriptClient,
  requireEnv,
};
