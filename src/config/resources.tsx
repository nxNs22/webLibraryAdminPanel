import { 
  DashboardOutlined, 
  ShoppingOutlined, // 🌟 Siparişler için yeni eklenen ikon
  BookOutlined, 
  MobileOutlined, 
  AudioOutlined, 
  AppstoreOutlined, 
  GiftOutlined,
  UserOutlined,
  FormatPainterOutlined,
  ScissorOutlined,       
  StarOutlined,          
  UploadOutlined         
} from "@ant-design/icons";

export const menuResources = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Ana Sayfa", icon: <DashboardOutlined /> },
  },
  // 🌟 YENİ EKLENEN SİPARİŞ YÖNETİMİ SAYFASI
  {
    name: "orders",
    list: "/orders",
    meta: { label: "Sipariş Yönetimi", icon: <ShoppingOutlined /> },
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
  {
    name: "art_category",
    list: "/art",
    meta: { label: "Sanat", icon: <FormatPainterOutlined /> },
  },
  {
    name: "handmade_category",
    list: "/handmade",
    meta: { label: "El Yapımı", icon: <ScissorOutlined /> },
  },
  {
    name: "featured_management",
    list: "/featured",
    meta: { label: "Vitrin Yönetimi", icon: <StarOutlined /> },
  },
  {
    name: "excel_upload",
    list: "/excel-upload",
    meta: { label: "Toplu Yükleme", icon: <UploadOutlined /> },
  },
  {
    name: "account_settings",
    list: "/account",
    meta: { label: "Hesabım", icon: <UserOutlined /> },
  }
];