"use client";

import React, { useState, useEffect } from "react";
import { Tabs, Table, Button, Modal, Select, message, Popconfirm, Avatar, Tag, Space } from "antd";
import { PlusOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
// 🌟 Güncellenen Import:
import { supabaseBrowserClient as supabase } from "../../utils/supabase/client"; 

const COLLECTIONS = [
  { id: 1, name: "New Arrivals", color: "blue" },
  { id: 2, name: "Bestsellers", color: "orange" },
  { id: 3, name: "Monthly Set", color: "pink" },
  { id: 4, name: "World Literature", color: "green" },
];

export default function FeaturedManagement() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchCollectionProducts = async (collectionId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("collection_products")
        .select(`
          id,
          product_id,
          products ( id, title, image_url, price, stock )
        `)
        .eq("collection_id", collectionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      console.error("Vitrin çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCounts = async () => {
    try {
      const { data, error } = await supabase
        .from("collection_products")
        .select("collection_id");
      
      if (error) throw error;

      const newCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      data?.forEach((row: any) => {
        if (newCounts[row.collection_id] !== undefined) {
          newCounts[row.collection_id]++;
        }
      });
      setCounts(newCounts);
    } catch (err: unknown) {
      console.error("Sayaç yükleme hatası:", err);
    }
  };

  useEffect(() => {
    fetchCollectionProducts(activeTab);
    fetchAllCounts();
  }, [activeTab]);

  const handleRemove = async (recordId: number) => {
    try {
      const { error } = await supabase
        .from("collection_products")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
      message.success("Ürün vitrinden çıkarıldı!");
      fetchCollectionProducts(activeTab);
      fetchAllCounts();
    } catch (err: unknown) {
      message.error("Silme işlemi başarısız!");
    }
  };

  const handleClearCollection = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("collection_products")
        .delete()
        .eq("collection_id", activeTab);

      if (error) throw error;
      message.success("Vitrin temizlendi!");
      fetchCollectionProducts(activeTab);
      fetchAllCounts();
    } catch (err: unknown) {
      message.error("Temizleme başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value || value.length < 2) return;
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price")
        .ilike("title", `%${value}%`)
        .limit(10);

      if (error) throw error;
      setSearchData(data || []);
    } catch (err: unknown) {
      console.error("Arama hatası:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId) return;
    setAdding(true);
    try {
      const { error } = await supabase
        .from("collection_products")
        .insert({ collection_id: activeTab, product_id: selectedProductId });

      if (error) throw error;

      message.success("Ürün eklendi!");
      setIsModalOpen(false);
      setSelectedProductId(null);
      fetchCollectionProducts(activeTab); 
      fetchAllCounts();
    } catch (err: unknown) {
      message.error("Ekleme başarısız!");
    } finally {
      setAdding(false);
    }
  };

  const columns = [
    {
      title: "Görsel",
      dataIndex: "products",
      width: 80,
      render: (prod: any) => {
        const url = Array.isArray(prod) ? prod[0]?.image_url : prod?.image_url;
        return <Avatar shape="square" size={50} src={url || "/placeholder.png"} />;
      }
    },
    {
      title: "Ürün Adı",
      dataIndex: "products",
      render: (prod: any) => {
        const title = Array.isArray(prod) ? prod[0]?.title : prod?.title;
        return <b>{title || "Bilinmeyen Ürün"}</b>;
      }
    },
    {
      title: "Fiyat",
      dataIndex: "products",
      width: 120,
      render: (prod: any) => {
        const price = Array.isArray(prod) ? prod[0]?.price : prod?.price;
        return <span>€{Number(price || 0).toFixed(2)}</span>;
      }
    },
    {
      title: "İşlem",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm title="Çıkarılsın mı?" onConfirm={() => handleRemove(record.id)}>
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const tabItems = COLLECTIONS.map((col) => ({
    key: col.id.toString(),
    label: (
      <span>
        {col.name} <Tag color={col.color} className="ml-2">{counts[col.id] || 0}/12</Tag>
      </span>
    ),
    children: (
      <>
        <div className="flex justify-between items-center mb-4 mt-2">
          <h3 className="text-lg font-semibold">{col.name} Ürünleri</h3>
          <Space>
            <Popconfirm title="Sıfırlansın mı?" onConfirm={handleClearCollection}>
              <Button danger icon={<ClearOutlined />} disabled={items.length === 0}>Tümünü Sil</Button>
            </Popconfirm>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} disabled={items.length >= 12}>
              {items.length >= 12 ? "Kapasite Dolu" : "Ürün Ekle"}
            </Button>
          </Space>
        </div>
        <Table dataSource={items} columns={columns} rowKey="id" loading={loading} pagination={false} bordered />
      </>
    ),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vitrin Yönetimi</h1>
      </div>
      <Tabs activeKey={activeTab.toString()} onChange={(key) => setActiveTab(Number(key))} type="card" items={tabItems} />
      <Modal
        title="Ürün Ekle"
        open={isModalOpen}
        onOk={handleAddProduct}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={adding}
      >
        <Select
          showSearch
          placeholder="Ürün ara..."
          style={{ width: '100%', marginTop: 20 }}
          onSearch={handleSearch}
          onChange={(val) => setSelectedProductId(val)}
          options={searchData.map((d) => ({ value: d.id, label: `${d.title} (€${d.price})` }))}
        />
      </Modal>
    </div>
  );
}