"use client";

import React, { useState } from "react";
import { Card, Upload, message, Statistic, Row, Col, Typography, Alert, List as AntList, Tag, Table, Button, Space, Popconfirm } from "antd";
import { InboxOutlined, CheckCircleOutlined, CloudUploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
// 🌟 Güncellenen Import:
import { supabaseBrowserClient as supabase } from "../../utils/supabase/client"; 

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function ExcelUploadPage() {
  const [loading, setLoading] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [fileData, setFileData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, productsAdded: 0, collectionsAdded: 0 });
  const [success, setSuccess] = useState(false);

  const handleFileRead = (file: File) => {
    setReadingFile(true);
    setSuccess(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);
        setFileData(rows);
        message.success("Dosya okundu, lütfen önizleyin.");
      } catch (err) {
        message.error("Dosya okunurken hata oluştu!");
      } finally {
        setReadingFile(false);
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleConfirmUpload = async () => {
    setLoading(true);
    let pCount = 0;
    let cCount = 0;

    try {
      for (const row of fileData) {
        const { data: newProduct, error: pErr } = await supabase
          .from("products")
          .insert({
            title: row.title,
            price: parseFloat(row.price || 0),
            stock: parseInt(row.stock || 0),
            category_id: parseInt(row.category_id || 1),
            image_url: row.image_url || null,
            details: { author: row.author || "", publisher: row.publisher || "" }
          })
          .select("id").single();

        if (pErr) continue;
        pCount++;

        if (row.collection_id) {
          const ids = String(row.collection_id).split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          const toAdd = ids.map(cId => ({ collection_id: cId, product_id: newProduct.id }));
          const { error: cErr } = await supabase.from("collection_products").insert(toAdd);
          if (!cErr) cCount += toAdd.length;
        }
      }
      setStats({ total: fileData.length, productsAdded: pCount, collectionsAdded: cCount });
      setSuccess(true);
      setFileData([]);
      message.success("Yükleme tamamlandı!");
    } catch (err) {
      message.error("Hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <Title level={2}>Toplu Yükleme Merkezi</Title>
      {fileData.length === 0 && (
        <Card style={{ marginTop: 24 }}>
          <Dragger accept=".xlsx, .xls, .csv" showUploadList={false} beforeUpload={handleFileRead} disabled={loading}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Excel dosyasını buraya sürükleyin</p>
          </Dragger>
        </Card>
      )}
      {fileData.length > 0 && (
        <Card style={{ marginTop: 24 }} title="Önizleme">
          <Table dataSource={fileData} columns={[{ title: "Ad", dataIndex: "title" }, { title: "Fiyat", dataIndex: "price" }, { title: "Vitrin", dataIndex: "collection_id" }]} rowKey={(r, i) => i?.toString() || Math.random().toString()} pagination={{ pageSize: 5 }} />
          <div style={{ marginTop: 20, textAlign: "right" }}>
            <Button onClick={() => setFileData([])} style={{ marginRight: 10 }}>İptal</Button>
            <Button type="primary" loading={loading} onClick={handleConfirmUpload}>Yüklemeyi Başlat</Button>
          </div>
        </Card>
      )}
      {success && (
        <Alert message="Başarılı" description={`${stats.productsAdded} ürün eklendi.`} type="success" showIcon style={{ marginTop: 20 }} />
      )}
    </div>
  );
}