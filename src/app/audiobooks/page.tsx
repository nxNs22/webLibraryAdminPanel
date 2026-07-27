"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton, useImport } from "@refinedev/antd";
import { Table, Space, Avatar, Badge } from "antd";

export default function AudiobooksList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { initial: [{ field: "category", operator: "eq", value: "audiobook" }] },
    syncWithLocation: true,
  });

  const { uploadProps, buttonProps } = useImport({
    resource: "products",
    mapData: (item) => {
      try {
        return {
          title: item.title,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock, 10) || 0,
          image_url: item.image_url || null,
          category: "audiobook",
          subcategory: item.language === "Turkish" ? "turkish" : "english",
          details: {
            author: item.author || null,
            language: item.language || null,
            narrator: item.narrator || null,
            duration: item.duration || null,
          },
        };
      } catch (error: unknown) {
        console.error("Audiobook satırı işlenirken hata:", error);
        return item;
      }
    },
  });

  return (
    <List
      title="Sesli Kitaplar"
      resource="products"
      headerButtons={
        <ImportButton
          buttonProps={{ ...buttonProps, type: "primary" }}
          uploadProps={uploadProps}
        />
      }
    >
      <Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: true }}>
        <Table.Column dataIndex="image_url" title="Görsel" render={(v) => <Avatar shape="square" src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="Kitap Adı" />
        <Table.Column title="Yazar" render={(_, record: any) => record.details?.author || "-"} />
        <Table.Column title="Dil" render={(_, record: any) => record.details?.language || "-"} />
        <Table.Column dataIndex="stock" title="Stok" render={(v) => (
          <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />
        )} />
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>€{Number(v).toFixed(2)}</b>} />
        <Table.Column title="İşlemler" dataIndex="actions" render={(_, record: any) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} />
          </Space>
        )} />
      </Table>
    </List>
  );
}