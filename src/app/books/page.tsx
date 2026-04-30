"use client";


import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar, Badge } from "antd";

export default function BooksList() {
  // 1. Sadece Kitapları (category_id: 1) Çek
  const { tableProps } = useTable({
    resource: "products",
    filters: {
      initial: [
        {
          field: "category_id",
          operator: "eq",
          value: 1, // 🎯 Sadece 1 numaralı kategori (Books) gelsin
        },
      ],
    },
    syncWithLocation: true,
  });

  // 2. Excel/CSV Yükleme Mantığı
  const importProps = useImport({
    resource: "products",
    mapData: (item) => {
      try {
        return {
          title: item.title,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock, 10) || 0,
          image_url: item.image_url,
          category_id: 1, // 🎯 Yüklenen her şeyi otomatik "Kitap" yap
          sub_category_id: parseInt(item.sub_category_id, 10), // 1: Türkçe, 2: İngilizce vb.
          
          // 🌟 Kitaba özel bilgileri JSONB formatında "details" içine hapsediyoruz
          details: {
            author: item.author,
            page_count: item.page_count,
            language: item.language
          }
        };
      } catch (error: unknown) {
        // Her zaman anlaştığımız gibi bilinmeyen hataları güvenle yakalıyoruz
        console.error("Excel satırı işlenirken hata oluştu:", error);
        return item; 
      }
    },
  });

  return (
    <List
      title="Kitaplar Kategorisi"
      headerButtons={<ImportButton 
  buttonProps={{ 
    type: "primary",
    loading: importProps.isLoading 
  }} 
  uploadProps={{
    accept: ".csv,.xlsx,.xls", // Sadece Excel ve CSV dosyalarına izin ver
    showUploadList: false, // Ekranda gereksiz yükleme çubuğu göstermesin
    beforeUpload: (file) => {
      // Dosyayı aldığımız an Ant Design'ın yükleme işlemini durdurup (return false), 
      // veriyi bizim yazdığımız güvenli Refine (useImport) kancasına aktarıyoruz.
      try {
        importProps.handleChange({ file });
      } catch (error: unknown) {
        console.error("Dosya okunurken hata oluştu:", error);
      }
      return false; 
    }
  }}
/>}
    >
      <Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: true }}>
        
        <Table.Column dataIndex="image_url" title="Görsel" render={(v) => <Avatar shape="square" src={v || "/placeholder.png"} />} />
        
        <Table.Column dataIndex="title" title="Kitap Adı" />
        
        {/* JSONB İçindeki Yazar Bilgisini Gösterme */}
        <Table.Column 
          title="Yazar" 
          render={(_, record: any) => record.details?.author || "-"} 
        />

        <Table.Column 
          title="Dil" 
          render={(_, record: any) => record.details?.language || "-"} 
        />

        <Table.Column dataIndex="stock" title="Stok" render={(v) => (
          <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />
        )} />
        
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>₺{Number(v).toFixed(2)}</b>} />
        
        <Table.Column
          title="İşlemler"
          dataIndex="actions"
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