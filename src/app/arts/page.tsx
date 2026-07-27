"use client";

import { List, useTable, EditButton, ShowButton, DeleteButton, ImportButton, useImport } from "@refinedev/antd";
import { Table, Space, Avatar, Badge, Tag } from "antd";

export default function ArtList() {
  const { tableProps } = useTable({
    resource: "products",
    filters: { initial: [{ field: "category", operator: "eq", value: "art" }] },
    syncWithLocation: true,
  });

  const { uploadProps, buttonProps } = useImport({
    resource: "products",
    mapData: (item) => {
      try {
        const subCat = (item.subcategory || item.type || "art").toLowerCase();
        return {
          title: item.title,
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock, 10) || 0,
          image_url: item.image_url || null,
          category: "art",
          subcategory: subCat,
          details: {
            type: subCat,
            artist: item.artist || item.author || "Anonim Sanatçı",
            dimensions: item.dimensions || "-",
          },
        };
      } catch (error: unknown) {
        console.error("Art satırı işlenirken hata:", error);
        return item;
      }
    },
  });

  return (
    <List
      title="Sanat Eserleri (Art)"
      resource="products"
      headerButtons={
        <ImportButton
          buttonProps={{ ...buttonProps, type: "primary" }}
          uploadProps={uploadProps}
        />
      }
    >
      <Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: true }}>
        <Table.Column dataIndex="image_url" title="Eser" render={(v) => <Avatar shape="square" size={48} src={v || "/placeholder.png"} />} />
        <Table.Column dataIndex="title" title="Eser Adı" />
        <Table.Column title="Tür" render={(_, record: any) => (
          <Tag color="cyan">{record.subcategory || record.details?.type || "Art"}</Tag>
        )} />
        <Table.Column dataIndex="stock" title="Stok" render={(v) => (
          <Badge status={v > 0 ? "success" : "error"} text={v > 0 ? `${v} Adet` : "Tükendi"} />
        )} />
        <Table.Column dataIndex="price" title="Fiyat" render={(v) => <b>€{Number(v).toFixed(2)}</b>} />
        <Table.Column title="İşlemler" render={(_, record: any) => (
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