"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Card, Row, Col } from "antd";

export default function ProductEditPage() {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "products",
    action: "edit",
  });

  const productData = query?.data?.data;
  
  // Ürünün kategorisine göre form alanlarını dinamik gösterelim
  const categoryId = productData?.category_id;

  return (
    <Edit saveButtonProps={saveButtonProps} title="Ürünü Düzenle">
      <Card bordered={false}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Ürün Adı"
                name={["title"]}
                rules={[{ required: true, message: "Ürün adı zorunludur" }]}
              >
                <Input placeholder="Ürün veya Kitap Adı" size="large" />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                label="Görsel URL"
                name={["image_url"]}
              >
                <Input placeholder="https://..." size="large" />
              </Form.Item>
            </Col>

            <Col xs={12} md={8}>
              <Form.Item
                label="Fiyat (€)"
                name={["price"]}
                rules={[{ required: true, message: "Fiyat zorunludur" }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>

            <Col xs={12} md={8}>
              <Form.Item
                label="Stok Durumu"
                name={["stock"]}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Kategori ID"
                name={["category_id"]}
              >
                <Select size="large" disabled>
                  <Select.Option value={1}>Kitap</Select.Option>
                  <Select.Option value={2}>E-Book</Select.Option>
                  <Select.Option value={3}>Sesli Kitap</Select.Option>
                  <Select.Option value={4}>Diğer</Select.Option>
                  <Select.Option value={5}>Hediyelik</Select.Option>
                  <Select.Option value={6}>Sanat</Select.Option>
                  <Select.Option value={7}>El Yapımı</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Card title="Gelişmiş Detaylar (JSONB)" type="inner" className="mt-4 bg-gray-50">
            <Row gutter={16}>
              {/* Kitap / E-Book / Audiobook için Ortak Alanlar */}
              {[1, 2, 3].includes(categoryId) && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item label="Yazar" name={["details", "author"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Dil" name={["details", "language"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              )}

              {/* Sadece Fiziksel Kitap İçin */}
              {categoryId === 1 && (
                <Col xs={24} md={12}>
                  <Form.Item label="Sayfa Sayısı" name={["details", "page_count"]}>
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              )}

              {/* Sadece Sanat ve Handmade İçin */}
              {[6, 7].includes(categoryId) && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item label="Sanatçı / Üretici" name={["details", "artist"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Materyal" name={["details", "material"]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              )}

              {/* Sadece Hediyelik İçin */}
              {categoryId === 5 && (
                <Col xs={24} md={12}>
                  <Form.Item label="Hedef Kitle (Target)" name={["details", "target"]}>
                    <Input placeholder="Men, Women, Kids..." />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        </Form>
      </Card>
    </Edit>
  );
}