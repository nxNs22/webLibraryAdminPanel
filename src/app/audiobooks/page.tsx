"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar, Badge } from "antd";

export default function AudiobooksList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { initial: [{ field: "category_id", operator: "eq", value: 3 }] }, // 3: Audiobooks
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
          category_id: 3, 
          sub_category_id: parseInt(item.sub_category_id, 10),
          details: {
            author: item.author,
            language: item.language,
            narrator: item.narrator,
            duration: item.duration 
          }
        };
      } catch (error: unknown) {
        console.error("Satır işlenirken hata:", error);
        return item; 
      }
    },
  });

  return (
    <List 
      title="Sesli Kitaplar" 
      headerButtons={<ImportButton buttonProps={{ type: "primary", loading: importProps.isLoading }} uploadProps={{ accept: ".csv,.xlsx,.xls", showUploadList: false, beforeUpload: (file) => { try { importProps.handleChange({ file }); } catch (error: unknown) { console.error("Hata:", error); } return false; } }} />}
    >
      <Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: true }}>
        <Table.Column dataIndex="image_url" title="Görsel" render={(v) => <Avatar shape="square" src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="Kitap Adı" />
        <Table.Column title="Seslendiren" render={(_, record: any) => record.details?.narrator || "-"} />
        <Table.Column title="Süre" render={(_, record: any) => record.details?.duration || "-"} />
        <Table.Column dataIndex="stock" title="Stok" render={(v) => <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />} />
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>₺{Number(v).toFixed(2)}</b>} />
        <Table.Column title="İşlemler" dataIndex="actions" render={(_, record: any) => (
            <Space><EditButton hideText size="small" recordItemId={record.id} /><ShowButton hideText size="small" recordItemId={record.id} /><DeleteButton hideText size="small" recordItemId={record.id} /></Space>
        )} />
      </Table>
    </List>
  );
}