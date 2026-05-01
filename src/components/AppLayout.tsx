"use client";

import { ThemedLayout, ThemedSider } from "@refinedev/antd";
import { usePathname } from "next/navigation";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // 1. Şu an bulunduğumuz URL'yi alıyoruz
  const pathname = usePathname();

  // 2. Navbar'ın (Sol Menünün) GÖRÜNMESİNİ İSTEMEDİĞİMİZ sayfaları belirliyoruz
  const isAuthPage = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/forgot-password');

  // 3. Eğer kullanıcı giriş sayfalarından birindeyse, SADECE sayfanın içeriğini göster (Menü YOK)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 4. Eğer admin panelinin içindeyse, standart menülü tasarımı göster
  return (
    <ThemedLayout
      // Sider, sol taraftaki Navbar'ı temsil eder. 
      Sider={(props) => <ThemedSider {...props} fixed />}
    >
      {children}
    </ThemedLayout>
  );
}