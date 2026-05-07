"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar, Badge } from "antd";
import React from "react";

export default function HandmadeList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { 
      initial: [{ field: "category_id", operator: "eq", value: 7 }] // Handmade ID: 7
    },
    syncWithLocation: true,
  });

  const importProps = useImport({
    resource: "products",
    mapData: (item) => {
      try {
        return {
          title: item.title,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock, 10) || 0,
          image_url: item.image_url,
          category_id: 7, 
          details: {
            material: item.material || "Bilinmeyen Malzeme",
            creator: item.creator || item.author || "Özel Üretim"
          }
        };
      } catch (error) {
        console.error("Satır işleme hatası:", error);
        return item;
      }
    },
  });

  const { dataSource, loading, pagination } = tableProps;

  return (
    <List 
      title="El Yapımı (Handmade)" 
      headerButtons={
        <ImportButton 
          buttonProps={{ type: "primary", loading: importProps.isLoading }} 
          uploadProps={{ 
            accept: ".csv,.xlsx,.xls", 
            showUploadList: false, 
            beforeUpload: (file) => { importProps.handleChange({ file }); return false; } 
          }} 
        />
      }
    >
      <Table dataSource={dataSource} loading={loading} rowKey="id" pagination={{ ...(pagination as any), showSizeChanger: true } as any}>
        <Table.Column dataIndex="image_url" title="Görsel" render={(v) => <Avatar shape="square" size={48} src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="Ürün Adı" sorter />
        <Table.Column 
          title="Malzeme (Material)" 
          render={(_, record: any) => <span>{record.details?.material || "-"}</span>} 
        />
        <Table.Column dataIndex="stock" title="Stok" render={(v: number) => <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />} />
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>€{Number(v).toFixed(2)}</b>} />
        <Table.Column 
          title="İşlemler" 
          fixed="right"
          render={(_, record: any) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )} 
        />
      </Table>
    </List>
  );
}