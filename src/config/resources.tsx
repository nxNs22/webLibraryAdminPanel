import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  BookOutlined, 
  MobileOutlined, 
  AudioOutlined, 
  AppstoreOutlined, 
  GiftOutlined,
  FormatPainterOutlined,
  ScissorOutlined,       
} from "@ant-design/icons";

export const menuResources = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Ana Sayfa", icon: <DashboardOutlined /> },
  },
  {
    name: "orders",
    list: "/orders",
    meta: { label: "Sipariş Yönetimi", icon: <ShoppingOutlined /> },
  },
  {
    name: "products", // 🌟 Bütün ürünlerin genel rotası
    list: "/books",
    edit: "/products/edit/:id", 
    create: "/products/create",
    meta: { label: "Kitaplar", icon: <BookOutlined /> },
  },
  {
    name: "ebooks_list",
    list: "/ebooks",
    edit: "/products/edit/:id", // Aynı Edit sayfasına gidecek
    meta: { label: "E-Kitaplar", icon: <MobileOutlined /> },
  },
  {
    name: "audiobooks_list",
    list: "/audiobooks",
    edit: "/products/edit/:id",
    meta: { label: "Sesli Kitaplar", icon: <AudioOutlined /> },
  },
  {
    name: "other_products",
    list: "/other-products",
    edit: "/products/edit/:id",
    meta: { label: "Diğer Ürünler", icon: <AppstoreOutlined /> },
  },
  {
    name: "gifts",
    list: "/gifts",
    edit: "/products/edit/:id",
    meta: { label: "Hediyelik (Gifts)", icon: <GiftOutlined /> },
  },
  {
    name: "art",
    list: "/arts",
    edit: "/products/edit/:id",
    meta: { label: "Sanat (Art)", icon: <FormatPainterOutlined /> },
  },
  {
    name: "handmade",
    list: "/handmade",
    edit: "/products/edit/:id",
    meta: { label: "El Yapımı", icon: <ScissorOutlined /> },
  }
];