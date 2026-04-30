"use client";

import { useList } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography, List as AntdList, Badge } from "antd";
import { 
  BookOutlined, 
  DollarCircleOutlined, 
  ShoppingCartOutlined, 
  WarningOutlined 
} from "@ant-design/icons";

const { Title } = Typography;

export default function DashboardPage() {
  // TypeScript uyumsuzluğunu aşmak için 'as any' ile güvenli çekim yapıyoruz
  const booksQuery = useList({
    resource: "books", // Supabase'deki tablo adın
    pagination: { pageSize: 1 },
  }) as any;
  
  const booksData = booksQuery.data || booksQuery.result;
  const isLoadingBooks = booksQuery.isLoading || booksQuery.query?.isLoading;

  const lowStockQuery = useList({
    resource: "books",
    filters: [
      {
        field: "stock",
        operator: "lt",
        value: 10,
      },
    ],
    pagination: { pageSize: 5 },
  }) as any;

  const lowStockData = lowStockQuery.data || lowStockQuery.result;
  const isLoadingLowStock = lowStockQuery.isLoading || lowStockQuery.query?.isLoading;

  const totalOrders = 156;
  const totalRevenue = 45250;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>Mağaza Özeti</Title>

      {/* İSTATİSTİK KARTLARI */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Kitap"
              value={booksData?.total || 0}
              loading={isLoadingBooks}
              prefix={<BookOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Sipariş"
              value={totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Toplam Gelir"
              value={totalRevenue}
              prefix={<DollarCircleOutlined style={{ color: "#faad14" }} />}
              suffix="₺"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <Statistic
              title="Kritik Stok Uyarısı"
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
            title="Stoğu Azalan Kitaplar (Son 10 Ürün)" 
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
                    description={`Yazar: ${item.author}`}
                  />
                  <div>
                    {item.stock > 0 ? (
                      <Badge status="warning" text={`Son ${item.stock} adet`} />
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
            <p style={{ color: "gray" }}>Siparişler tablosu bağlandığında burada listelenecek...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}