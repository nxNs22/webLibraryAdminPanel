"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Row, Col, Tag, Avatar, Descriptions, Badge } from "antd";

const CATEGORY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Kitap", color: "blue" },
  2: { label: "E-Book", color: "purple" },
  3: { label: "Sesli Kitap", color: "orange" },
  4: { label: "Diğer", color: "default" },
  5: { label: "Hediyelik", color: "pink" },
  6: { label: "Sanat", color: "volcano" },
  7: { label: "El Yapımı", color: "green" },
};

export default function ProductShowPage() {
  const { query } = useShow({ resource: "products" });
  const product = query?.data?.data;

  const cat = CATEGORY_LABELS[product?.category_id] ?? { label: "Bilinmiyor", color: "default" };

  return (
    <Show title="Ürün Detayı">
      <Row gutter={24}>
        {/* Sol: Görsel */}
        <Col xs={24} md={8} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Avatar
            shape="square"
            size={220}
            src={product?.image_url || "/placeholder.png"}
            style={{ border: "1px solid #f0f0f0", borderRadius: 12 }}
          />
        </Col>

        {/* Sağ: Bilgiler */}
        <Col xs={24} md={16}>
          <Card bordered={false} style={{ marginBottom: 16 }}>
            <Descriptions title="Genel Bilgiler" column={2} bordered size="small">
              <Descriptions.Item label="Ürün Adı" span={2}>
                <b>{product?.title || "—"}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Fiyat">
                <b style={{ color: "#0ea5e9" }}>€{Number(product?.price || 0).toFixed(2)}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Stok">
                <Badge
                  status={(product?.stock ?? 0) > 0 ? "success" : "error"}
                  text={(product?.stock ?? 0) > 0 ? `${product?.stock} Adet` : "Tükendi"}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Kategori">
                <Tag color={cat.color}>{cat.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Görsel URL">
                <a href={product?.image_url} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>
                  {product?.image_url || "—"}
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* JSONB Details */}
          {product?.details && Object.keys(product.details).length > 0 && (
            <Card title="Detay Bilgiler" bordered={false} size="small">
              <Descriptions column={2} bordered size="small">
                {product.details.author && (
                  <Descriptions.Item label="Yazar">{product.details.author}</Descriptions.Item>
                )}
                {product.details.language && (
                  <Descriptions.Item label="Dil">{product.details.language}</Descriptions.Item>
                )}
                {product.details.page_count && (
                  <Descriptions.Item label="Sayfa Sayısı">{product.details.page_count}</Descriptions.Item>
                )}
                {product.details.artist && (
                  <Descriptions.Item label="Sanatçı">{product.details.artist}</Descriptions.Item>
                )}
                {product.details.material && (
                  <Descriptions.Item label="Materyal">{product.details.material}</Descriptions.Item>
                )}
                {product.details.target && (
                  <Descriptions.Item label="Hedef Kitle">{product.details.target}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Col>
      </Row>
    </Show>
  );
}
