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
  const category = productData?.category;

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
                label="Kategori"
                name={["category"]}
              >
                <Select size="large" disabled>
                  <Select.Option value="book">Kitap</Select.Option>
                  <Select.Option value="ebook">E-Book</Select.Option>
                  <Select.Option value="audiobook">Sesli Kitap</Select.Option>
                  <Select.Option value="other">Diğer</Select.Option>
                  <Select.Option value="gift">Hediyelik</Select.Option>
                  <Select.Option value="art">Sanat</Select.Option>
                  <Select.Option value="handmade">El Yapımı</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Card title="Gelişmiş Detaylar (JSONB)" type="inner" className="mt-4 bg-gray-50">
            <Row gutter={16}>
              {/* Kitap / E-Book / Audiobook için Ortak Alanlar */}
              {["book", "ebook", "audiobook"].includes(category) && (
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

              {/* İndirim için Eski Fiyat (Tüm Ürünler İçin) */}
              <Col xs={24} md={12}>
                <Form.Item label="Eski Fiyat (İndirim Göstermek İçin)" name={["details", "original_price"]}>
                  <InputNumber style={{ width: "100%" }} placeholder="Örn: 104.00" />
                </Form.Item>
              </Col>

              {/* Sadece Fiziksel Kitap İçin */}
              {category === "book" && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item label="Sayfa Sayısı" name={["details", "page_count"]}>
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Cilt Tipi (Binding)" name={["details", "binding"]}>
                      <Select placeholder="Cilt Tipi Seçin">
                        <Select.Option value="Paperback">Paperback</Select.Option>
                        <Select.Option value="Hardback">Hardback</Select.Option>
                        <Select.Option value="Board book">Board book</Select.Option>
                        <Select.Option value="Book">Book</Select.Option>
                        <Select.Option value="Sheet">Sheet</Select.Option>
                        <Select.Option value="Spiral bound">Spiral bound</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              )}

              {/* Sadece E-Kitap İçin */}
              {category === "ebook" && (
                <Col xs={24} md={12}>
                  <Form.Item label="Format" name={["details", "format"]}>
                    <Select placeholder="Format Seçin">
                      <Select.Option value="PDF">PDF</Select.Option>
                      <Select.Option value="EPUB">EPUB</Select.Option>
                      <Select.Option value="MOBI">MOBI</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}

              {/* Sadece Sesli Kitap İçin */}
              {category === "audiobook" && (
                <>
                  <Col xs={24} md={12}>
                    <Form.Item label="Format" name={["details", "format"]}>
                      <Select placeholder="Ses Formatı Seçin">
                        <Select.Option value="MP3">MP3</Select.Option>
                        <Select.Option value="Audiobook">Audiobook (genel)</Select.Option>
                        <Select.Option value="Audio CD">Audio CD</Select.Option>
                        <Select.Option value="AAC">AAC</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Anlatıcı (Narrator)" name={["details", "narrator"]}>
                      <Input placeholder="Örn: John Smith" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Süre (Duration)" name={["details", "duration"]}>
                      <Input placeholder="Örn: 12 saat 30 dakika" />
                    </Form.Item>
                  </Col>
                </>
              )}

              {/* Tüm Ürünler İçin Ekstra Filtre Alanları */}
              <Col xs={24} md={12}>
                <Form.Item label="Durum (Availability)" name={["details", "availability"]}>
                  <Select placeholder="Teslimat / Stok Durumu">
                    <Select.Option value="Within 24 hours">Within 24 hours</Select.Option>
                    <Select.Option value="Within three days">Within three days</Select.Option>
                    <Select.Option value="Within a week">Within a week</Select.Option>
                    <Select.Option value="Within two weeks">Within two weeks</Select.Option>
                    <Select.Option value="Within a month">Within a month</Select.Option>
                    <Select.Option value="More than a month">More than a month</Select.Option>
                    <Select.Option value="Pre-order">Pre-order</Select.Option>
                    <Select.Option value="Availability unknown">Availability unknown</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Etiketler (Tags)" name={["details", "tags"]}>
                  <Select mode="tags" placeholder="Etiket ekleyin (örn: New, Top, Affordable)">
                    <Select.Option value="New">New</Select.Option>
                    <Select.Option value="Coming soon">Coming soon</Select.Option>
                    <Select.Option value="Affordable">Affordable</Select.Option>
                    <Select.Option value="Top">Top</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Çıkış Yılı (Date of issue)" name={["details", "date_of_issue"]}>
                  <InputNumber style={{ width: "100%" }} placeholder="Örn: 2024" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Tür / Alt Kategori (Genre/Category)" name={["details", "genre"]}>
                  <Select mode="tags" placeholder="Örn: Science, History, Biography">
                    <Select.Option value="The Arts">The Arts</Select.Option>
                    <Select.Option value="Language & Linguistics">Language & Linguistics</Select.Option>
                    <Select.Option value="Biography">Biography</Select.Option>
                    <Select.Option value="Fiction">Fiction</Select.Option>
                    <Select.Option value="Reference">Reference</Select.Option>
                    <Select.Option value="Society & Social Sciences">Society & Social Sciences</Select.Option>
                    <Select.Option value="Economics & Finance">Economics & Finance</Select.Option>
                    <Select.Option value="Law">Law</Select.Option>
                    <Select.Option value="Medicine & Nursing">Medicine & Nursing</Select.Option>
                    <Select.Option value="History & Archaeology">History & Archaeology</Select.Option>
                    <Select.Option value="Mathematics & Science">Mathematics & Science</Select.Option>
                    <Select.Option value="Philosophy & Religion">Philosophy & Religion</Select.Option>
                    <Select.Option value="Earth Sciences">Earth Sciences</Select.Option>
                    <Select.Option value="Sports">Sports</Select.Option>
                    <Select.Option value="Technology & Engineering">Technology & Engineering</Select.Option>
                    <Select.Option value="Computing & IT">Computing & IT</Select.Option>
                    <Select.Option value="Health & Personal development">Health & Personal development</Select.Option>
                    <Select.Option value="Lifestyle & Hobbies">Lifestyle & Hobbies</Select.Option>
                    <Select.Option value="Graphic novels">Graphic novels</Select.Option>
                    <Select.Option value="Children's & Teenage">{"Children's & Teenage"}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Sadece Sanat ve Handmade İçin */}
              {["art", "handmade"].includes(category) && (
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
              {category === "gift" && (
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