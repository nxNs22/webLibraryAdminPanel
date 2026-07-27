"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Row, Col, Tag, Avatar, Descriptions, Badge } from "antd";

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  book: { label: "Kitap", color: "blue" },
  ebook: { label: "E-Book", color: "purple" },
  audiobook: { label: "Sesli Kitap", color: "orange" },
  other: { label: "Diğer", color: "default" },
  gift: { label: "Hediyelik", color: "pink" },
  art: { label: "Sanat", color: "volcano" },
  handmade: { label: "El Yapımı", color: "green" },
};

export default function ProductShowPage() {
  const { query } = useShow({ resource: "products" });
  const product = query?.data?.data;

  const cat = CATEGORY_LABELS[product?.category] ?? { label: "Bilinmiyor", color: "default" };

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
                {product.details.binding && (
                  <Descriptions.Item label="Cilt Tipi">{product.details.binding}</Descriptions.Item>
                )}
                {product.details.availability && (
                  <Descriptions.Item label="Durum">{product.details.availability}</Descriptions.Item>
                )}
                {product.details.date_of_issue && (
                  <Descriptions.Item label="Çıkış Yılı">{product.details.date_of_issue}</Descriptions.Item>
                )}
                {product.details.tags && Array.isArray(product.details.tags) && (
                  <Descriptions.Item label="Etiketler">
                    {product.details.tags.map((t: string) => (
                      <Tag key={t} color="blue">{t}</Tag>
                    ))}
                  </Descriptions.Item>
                )}
                {(product.details.genre || product.details.category) && (
                  <Descriptions.Item label="Tür / Kategori">
                    {Array.isArray(product.details.genre)
                      ? product.details.genre.join(", ")
                      : (product.details.genre || product.details.category)}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}
        </Col>
      </Row>
    </Show>
  );
}
