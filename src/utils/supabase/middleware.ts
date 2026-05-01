import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "./constants";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // 1. Supabase'den kullanıcının giriş yapıp yapmadığını (user) soruyoruz
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Kullanıcının şu an gitmek istediği URL'yi alıyoruz
  const currentPath = request.nextUrl.pathname;

  // 3. Herkese açık olması GEREKEN (giriş yapılmadan görülebilen) sayfalar
  const isPublicPage = 
    currentPath.startsWith('/login') || 
    currentPath.startsWith('/register') || 
    currentPath.startsWith('/forgot-password');

  // 🛡️ KURAL 1: KULLANICI GİRİŞ YAPMAMIŞSA
  // Ve herkese açık olmayan bir sayfaya (örneğin Dashboard'a) girmeye çalışıyorsa -> KAPI DIŞARI (Login'e yönlendir)
  if (!user && !isPublicPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // 🛡️ KURAL 2: KULLANICI ZATEN GİRİŞ YAPMIŞSA
  // Ve tekrar Login veya Register sayfasına girmeye çalışıyorsa -> İÇERİ AL (Ana sayfaya yönlendir)
  if (user && isPublicPage) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.redirect(homeUrl);
  }

  return response;
}