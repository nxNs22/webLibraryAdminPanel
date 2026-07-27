"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton, useImport } from "@refinedev/antd";
import { Table, Space, Avatar } from "antd";

export default function EBooksList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { initial: [{ field: "category", operator: "eq", value: "ebook" }] },
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
          category: "ebook",
          subcategory: item.language === "Turkish" ? "turkish" : "english",
          details: {
            author: item.author || null,
            language: item.language || null,
            format: item.format || null,
          },
        };
      } catch (error: unknown) {
        console.error("E-Book satırı işlenirken hata:", error);
        return item;
      }
    },
  });

  return (
    <List
      title="E-Books"
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
        <Table.Column dataIndex="title" title="E-Kitap Adı" />
        <Table.Column title="Yazar" render={(_, record: any) => record.details?.author || "-"} />
        <Table.Column title="Format" render={(_, record: any) => record.details?.format || "-"} />
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