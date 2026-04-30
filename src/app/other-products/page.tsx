"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar, Badge } from "antd";
import React from "react";

export default function OtherProductsList() {
  // 1. Filtrelemeyi 'eq' (eşittir) operatörü ile kesinleştiriyoruz.
  const { tableProps } = useTable({
    resource: "products",
    filters: { 
      initial: [{ field: "category_id", operator: "eq", value: 4 }] // 🌟 Sadece 4 (Other) olanları getir
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
          category_id: 4, // 🌟 Buradan yüklenenler hep 4 olarak kaydedilir
          sub_category_id: parseInt(item.sub_category_id, 10) || null,
          details: {
            brand: item.brand || "-",
            material: item.material || "-"
          }
        };
      } catch (error: unknown) {
        console.error("Satır işlenirken hata:", error);
        return item; 
      }
    },
  });

  // 🌟 Tip hatasını ve filtre uyuşmazlığını önlemek için parçalıyoruz
  const { dataSource, loading, pagination } = tableProps;

  return (
    <List 
      title="Diğer Ürünler" 
      headerButtons={
        <ImportButton 
          buttonProps={{ type: "primary", loading: importProps.isLoading }} 
          uploadProps={{ 
            accept: ".csv,.xlsx,.xls", 
            showUploadList: false, 
            beforeUpload: (file) => { 
              importProps.handleChange({ file }); 
              return false; 
            } 
          }} 
        />
      }
    >
      <Table 
        dataSource={dataSource} 
        loading={loading}
        rowKey="id" 
        // 🌟 Ant Design v5/v6 çakışmasını aşmak için 'as any'
        pagination={{ 
          ...(pagination as any), 
          showSizeChanger: true 
        } as any}
      >
        <Table.Column 
          dataIndex="image_url" 
          title="Görsel" 
          render={(v) => <Avatar shape="square" src={v || "/placeholder.png"} />} 
        />
        <Table.Column dataIndex="title" title="Ürün Adı" />
        
        {/* Detaylar kısmından markayı okuyoruz */}
        <Table.Column 
          title="Marka" 
          render={(_, record: any) => record.details?.brand || "-"} 
        />
        
        <Table.Column 
          dataIndex="stock" 
          title="Stok" 
          render={(v) => <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />} 
        />
        
        <Table.Column 
          dataIndex="price" 
          title="Fiyat" 
          render={(v) => <b>₺{Number(v).toFixed(2)}</b>} 
        />
        
        <Table.Column 
          title="İşlemler" 
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