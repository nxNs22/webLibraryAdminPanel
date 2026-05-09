"use client";

import { useEffect, useState } from "react";
import { supabase, getErrorMessage } from "./supabaseClient"; 
import { Table, Tag, Select, Input, Button, Space, Typography, Card, message } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type OrderItem = {
  id: string;
  product_title: string;
  quantity: number;
  price_at_purchase: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: unknown) {
      message.error("Siparişler yüklenirken hata oluştu: " + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const hide = message.loading("Durum güncelleniyor...", 0);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      hide();
      message.success("Sipariş durumu güncellendi!");
    } catch (err: unknown) {
      hide();
      message.error("Durum güncellenemedi: " + getErrorMessage(err));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Sipariş No',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text: string) => <Text strong>#{text}</Text>,
    },
    {
      title: 'Müşteri',
      key: 'customer',
      render: (_: any, record: Order) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.customer_name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.customer_email}</Text>
        </Space>
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString("tr-TR"),
    },
    {
      title: 'Toplam',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => <Text strong>{amount.toFixed(2)} €</Text>,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch(status?.toLowerCase()) {
          case 'pending': color = 'warning'; break;
          case 'processing': color = 'processing'; break;
          case 'shipped': color = 'cyan'; break;
          case 'delivered': color = 'success'; break;
          case 'cancelled': color = 'error'; break;
        }
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'İşlem',
      key: 'action',
      render: (_: any, record: Order) => (
        <Select
          value={record.status}
          style={{ width: 130 }}
          onChange={(value) => updateOrderStatus(record.id, value)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      ),
    }
  ];

  return (
    <Card 
      title={<Title level={3} style={{ margin: 0 }}>Sipariş Yönetimi</Title>}
      extra={<Button icon={<ReloadOutlined />} onClick={fetchOrders}>Yenile</Button>}
      style={{ margin: '24px' }}
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Sipariş no veya müşteri adı..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 250 }}
        />
        <Select 
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 200 }}
          options={[
            { value: 'all', label: 'Tüm Durumlar' },
            { value: 'pending', label: 'Bekliyor (Pending)' },
            { value: 'processing', label: 'Hazırlanıyor (Processing)' },
            { value: 'shipped', label: 'Kargoya Verildi (Shipped)' },
            { value: 'delivered', label: 'Teslim Edildi (Delivered)' },
            { value: 'cancelled', label: 'İptal Edildi (Cancelled)' },
          ]}
        />
      </Space>

      <Table 
        columns={columns} 
        dataSource={filteredOrders.map(o => ({ ...o, key: o.id }))} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}