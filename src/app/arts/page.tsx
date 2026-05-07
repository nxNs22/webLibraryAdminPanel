"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar, Badge, Tag } from "antd";
import React from "react";

export default function ArtList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { 
      initial: [{ field: "category_id", operator: "eq", value: 6 }] // Sanat ID: 6
    },
    syncWithLocation: true,
  });

  const importProps = useImport({
    resource: "products",
    mapData: (item) => {
      try {
        const subCat = (item.subcategory || item.type || "Art").toLowerCase();
        return {
          title: item.title,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock, 10) || 0,
          image_url: item.image_url,
          category_id: 6,
          subcategory: subCat, // Frontend filtrelemesi için
          details: {
            type: subCat,
            artist: item.artist || item.author || "Anonim Sanatçı",
            dimensions: item.dimensions || "-"
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
      title="Sanat Eserleri (Art)" 
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
        <Table.Column dataIndex="image_url" title="Eser" render={(v) => <Avatar shape="square" size={48} src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="Eser Adı" sorter />
        <Table.Column 
          title="Kategori (Type)" 
          render={(_, record: any) => (
            <Tag color="cyan" style={{ textTransform: 'capitalize' }}>
              {record.subcategory || record.details?.type || "Art"}
            </Tag>
          )} 
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