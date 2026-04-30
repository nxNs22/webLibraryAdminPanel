"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton } from "@refinedev/antd";
import { useImport } from "@refinedev/core";
import { Table, Space, Avatar } from "antd";

export default function EBooksList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { initial: [{ field: "category_id", operator: "eq", value: 2 }] }, // 2: E-Books
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
          category_id: 2, 
          sub_category_id: parseInt(item.sub_category_id, 10),
          details: {
            author: item.author,
            language: item.language,
            format: item.format // Örn: PDF, EPUB
          }
        };
      } catch (error: unknown) {
        console.error("E-Book satırı işlenirken hata:", error);
        return item; 
      }
    },
  });

  return (
    <List title="E-Books Kategorisi" headerButtons={<ImportButton buttonProps={{ type: "primary", loading: importProps.isLoading }} uploadProps={{ accept: ".csv,.xlsx,.xls", showUploadList: false, beforeUpload: (file) => { try { importProps.handleChange({ file }); } catch (error: unknown) { console.error("Hata:", error); } return false; } }} />}>
      <Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: true }}>
        <Table.Column dataIndex="image_url" title="Görsel" render={(v) => <Avatar shape="square" src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="E-Kitap Adı" />
        <Table.Column title="Yazar" render={(_, record: any) => record.details?.author || "-"} />
        <Table.Column title="Format" render={(_, record: any) => record.details?.format || "-"} />
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>₺{Number(v).toFixed(2)}</b>} />
        <Table.Column title="İşlemler" dataIndex="actions" render={(_, record: any) => (
            <Space><EditButton hideText size="small" recordItemId={record.id} /><ShowButton hideText size="small" recordItemId={record.id} /><DeleteButton hideText size="small" recordItemId={record.id} /></Space>
        )} />
      </Table>
    </List>
  );
}