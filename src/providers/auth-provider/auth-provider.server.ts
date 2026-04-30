import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    const { user } = data;

    if (error) {
      return { authenticated: false, logout: true, redirectTo: "/login" };
    }

    if (user) {
      // 🌟 YENİ SİSTEM: Sunucu tarafında 'profiles' tablosuna bakıyoruz
      const { data: profileData } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id) // ID ile arıyoruz
        .single();

      // Eğer profili varsa ve rolü admin ise:
      if (profileData && profileData.role === "admin") {
        return {
          authenticated: true,
        };
      } else {
        // Müşteriyse ('user') veya profili yoksa dışarı atıyoruz:
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
        };
      }
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
};