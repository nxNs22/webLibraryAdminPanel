"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";

export const authProviderClient: AuthProvider = {
  // ... diğer kodlar aynı kalacak

  login: async ({ email, password }) => {
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    if (data?.session) {
      const userId = data.session.user.id; // 🌟 Artık direkt User ID'yi alıyoruz

      // 🌟 YENİ SİSTEM: Senin kendi 'profiles' tablonu kontrol ediyoruz
      const { data: profileData, error: profileError } = await supabaseBrowserClient
        .from("profiles")
        .select("role")
        .eq("id", userId) // ID ile eşleştiriyoruz
        .single();

      // Eğer profili yoksa veya rolü 'admin' değilse (yani 'user' ise):
      if (!profileData || profileData.role !== "admin") {
        await supabaseBrowserClient.auth.signOut(); // Hemen oturumu kapat
        return {
          success: false,
          error: {
            name: "Yetkisiz Giriş 🛑",
            message: "Bu panele sadece sistem yöneticileri girebilir. Müşteri hesapları erişemez.",
          },
        };
      }

      // Rolü 'admin' ise içeri alıyoruz:
      await supabaseBrowserClient.auth.setSession(data.session);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Geçersiz e-posta veya şifre",
      },
    };
  },


  logout: async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async () => {
    const { data, error } = await supabaseBrowserClient.auth.getUser();
    const { user } = data;

    if (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const user = await supabaseBrowserClient.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    const { data } = await supabaseBrowserClient.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
  onError: async (error) => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
