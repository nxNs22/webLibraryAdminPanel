"use client"

import { 
  DashboardOutlined, 
  BookOutlined, 
  MobileOutlined, 
  AudioOutlined, 
  AppstoreOutlined, 
  GiftOutlined,
  UserOutlined // 🌟 Yeni ikonumuzu import ettik
} from "@ant-design/icons";

export const menuResources = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Ana Sayfa", icon: <DashboardOutlined /> },
  },
  {
    name: "products", 
    list: "/books",
    meta: { label: "Kitaplar", icon: <BookOutlined /> },
  },
  {
    name: "ebooks_category",
    list: "/ebooks",
    meta: { label: "E-Books", icon: <MobileOutlined /> },
  },
  {
    name: "audiobooks_category",
    list: "/audiobooks",
    meta: { label: "Audiobooks", icon: <AudioOutlined /> },
  },
  {
    name: "other_category",
    list: "/other-products",
    meta: { label: "Diğer Ürünler", icon: <AppstoreOutlined /> },
  },
  {
    name: "gifts_category",
    list: "/gifts",
    meta: { label: "Hediyeler", icon: <GiftOutlined /> },
  },
  // 🌟 Yeni Hesabım Sayfamız:
  {
    name: "account_settings",
    list: "/account",
    meta: { label: "Hesabım", icon: <UserOutlined /> },
  }
];