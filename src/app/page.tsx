"use client";

import { useState, useEffect } from "react";
import { useList } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography, List as AntdList, Badge, Tag } from "antd";
import { 
  AppstoreOutlined, 
  EuroOutlined, 
  ShoppingCartOutlined, 
  WarningOutlined 
} from "@ant-design/icons";
import { supabase } from "./orders/supabaseClient"; // Supabase istemcimizi ekledik

const { Title } = Typography;

export default function DashboardPage() {
  // 1. Toplam Ürün Çeşidi Sayısı
  const productsQuery = useList({
    resource: "products",
    pagination: { pageSize: 1 },
  }) as any;
  const productsData = productsQuery.data || productsQuery.result;
  const isLoadingProducts = productsQuery.isLoading || productsQuery.query?.isLoading;

  // 2. 5'ten Az Stoğu Kalan Ürünler (Maksimum 10 tane, stoğu en az olandan sıralı)
  const lowStockQuery = useList({
    resource: "products",
    filters: [
      { field: "stock", operator: "lt", value: 5 }
    ],
    sorters: [
      { field: "stock", order: "asc" }
    ],
    pagination: { pageSize: 10 },
  }) as any;
  const lowStockData = lowStockQuery.data || lowStockQuery.result;
  const isLoadingLowStock = lowStockQuery.isLoading || lowStockQuery.query?.isLoading;

  // 3. Toplam Sipariş Sayısı
  const ordersQuery = useList({
    resource: "orders",
    pagination: { pageSize: 1 },
  }) as any;
  const ordersData = ordersQuery.data || ordersQuery.result;
  const isLoadingOrders = ordersQuery.isLoading || ordersQuery.query?.isLoading;

  // 4. Son 5 Siparişi Çekme (Alt tablo için)
  const recentOrdersQuery = useList({
    resource: "orders",
    sorters: [
      { field: "created_at", order: "desc" }
    ],
    pagination: { pageSize: 5 },
  }) as any;
  const recentOrdersData = recentOrdersQuery.data || recentOrdersQuery.result;
  const isLoadingRecentOrders = recentOrdersQuery.isLoading || recentOrdersQuery.query?.isLoading;

  // 5. Toplam Gelir Hesaplama (Supabase'den)
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      setIsLoadingRevenue(true);
      try {
        // İptal edilmemiş siparişlerin toplam tutarlarını çekiyoruz
        const { data, error } = await supabase
          .from("orders")
          .select("total_amount")
          .neq("status", "cancelled");

        if (error) throw error;

        // Bütün tutarları topluyoruz
        const total = data?.reduce((sum: number, order: any) => sum + (Number(order.total_amount) || 0), 0) || 0;
        setTotalRevenue(total);
      } catch (err: unknown) {
        console.error("Gelir hesaplanamadı:", err);
      } finally {
        setIsLoadingRevenue(false);
      }
    };

    fetchTotalRevenue();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>Mağaza Özeti</Title>

      {/* İSTATİSTİK KARTLARI */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Ürün Çeşidi"
              value={productsData?.total || 0}
              loading={isLoadingProducts}
              prefix={<AppstoreOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Sipariş"
              value={ordersData?.total || 0}
              loading={isLoadingOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              precision={2} // Kuruşları (virgülden sonra 2 hane) gösterir
              loading={isLoadingRevenue}
              prefix={<EuroOutlined style={{ color: "#faad14" }} />}
              suffix="€"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Kritik Stok Uyarısı (< 5)"
              value={lowStockData?.total || 0}
              loading={isLoadingLowStock}
              valueStyle={{ color: "#cf1322" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ALT PANELLER */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card 
            title="Stoğu Azalan Ürünler (Stok < 5)" 
            bordered={false} 
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}
          >
            <AntdList
              loading={isLoadingLowStock}
              dataSource={lowStockData?.data || []}
              renderItem={(item: any) => (
                <AntdList.Item>
                  <AntdList.Item.Meta
                    title={item.title}
                    description={item.author ? `Yazar/Üretici: ${item.author}` : "Detay bilgisi yok"}
                  />
                  <div>
                    {item.stock > 0 ? (
                      <Badge status="warning" text={`Sadece ${item.stock} adet kaldı`} />
                    ) : (
                      <Badge status="error" text="Tükendi" />
                    )}
                  </div>
                </AntdList.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title="Son Siparişler" 
            bordered={false} 
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}
          >
            <AntdList
              loading={isLoadingRecentOrders}
              dataSource={recentOrdersData?.data || []}
              renderItem={(order: any) => {
                let color = "default";
                if (order.status === "pending") color = "warning";
                if (order.status === "processing") color = "processing";
                if (order.status === "shipped") color = "cyan";
                if (order.status === "delivered") color = "success";
                if (order.status === "cancelled") color = "error";

                return (
                  <AntdList.Item>
                    <AntdList.Item.Meta
                      title={<span style={{ fontWeight: "bold" }}>#{order.order_number}</span>}
                      description={`${order.customer_name} • ${new Date(order.created_at).toLocaleDateString("tr-TR")}`}
                    />
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        {Number(order.total_amount).toFixed(2)} €
                      </div>
                      <Tag color={color}>{order.status?.toUpperCase()}</Tag>
                    </div>
                  </AntdList.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}