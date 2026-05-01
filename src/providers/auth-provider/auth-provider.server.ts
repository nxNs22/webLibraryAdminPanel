import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    
    // 🚨 SUNUCU NE GÖRÜYOR KONSOLA YAZDIRALIM 🚨
    console.log("=== NEXT.JS SUNUCU KONTROLÜ ===");
    console.log("Kullanıcı Bulundu mu?:", data?.user?.email || "YOK");
    console.log("Supabase Hatası Var mı?:", error?.message || "YOK");
    console.log("================================");

    if (error) {
      return { authenticated: false, logout: true, redirectTo: "/login" };
    }

    if (data?.user) {
      return { authenticated: true };
    }

    return { authenticated: false, logout: true, redirectTo: "/login" };
  },
};