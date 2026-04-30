"use client";

import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Divider, notification, Space, Typography } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { supabaseBrowserClient } from "@utils/supabase/client";

const { Title, Text } = Typography;

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 1. Sayfa açıldığında kullanıcı bilgilerini Supabase'den çekiyoruz
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabaseBrowserClient.auth.getUser();
    if (user) {
      setUser(user);
      
      // Profiles tablosundaki ekstra detayları (İsim, Telefon) çekiyoruz
      const { data: profile } = await supabaseBrowserClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        profileForm.setFieldsValue({
          email: user.email, // E-posta auth'tan geliyor (değiştirilemez yaptık)
          full_name: profile.full_name,
          phone: profile.phone,
        });
      }
    }
  };

  // 2. Profil Bilgilerini Güncelleme Fonksiyonu
  const handleUpdateProfile = async (values: any) => {
    setLoadingProfile(true);
    const { error } = await supabaseBrowserClient
      .from("profiles")
      .update({ 
        full_name: values.full_name, 
        phone: values.phone 
      })
      .eq("id", user.id);

    setLoadingProfile(false);

    if (error) {
      notification.error({ message: "Hata oluştu", description: error.message });
    } else {
      notification.success({ message: "Başarılı", description: "Profil bilgileriniz güncellendi!" });
    }
  };

  // 3. Şifre Değiştirme Fonksiyonu
  const handleUpdatePassword = async (values: any) => {
    setLoadingPassword(true);
    const { error } = await supabaseBrowserClient.auth.updateUser({
      password: values.password,
    });

    setLoadingPassword(false);

    if (error) {
      notification.error({ message: "Şifre değiştirilemedi", description: error.message });
    } else {
      notification.success({ message: "Başarılı", description: "Şifreniz güvenle değiştirildi!" });
      passwordForm.resetFields(); // Şifre kutularını temizle
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 0" }}>
      <Title level={2}>Hesap Ayarları</Title>
      <Text type="secondary">Kişisel bilgilerinizi ve hesap şifrenizi bu alandan yönetebilirsiniz.</Text>

      <Space direction="vertical" size="large" style={{ display: "flex", marginTop: "24px" }}>
        
        {/* PROFİL BİLGİLERİ KARTI */}
        <Card title="Profil Bilgileri" bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
          <Form 
            form={profileForm} 
            layout="vertical" 
            onFinish={handleUpdateProfile}
          >
            <Form.Item label="E-Posta Adresi" name="email">
              <Input prefix={<MailOutlined />} disabled />
              <Text type="secondary" style={{ fontSize: "12px" }}>E-posta adresi değiştirilemez.</Text>
            </Form.Item>

            <Form.Item label="Ad Soyad" name="full_name">
              <Input prefix={<UserOutlined />} placeholder="Örn: Ahmet Yılmaz" />
            </Form.Item>

            <Form.Item label="Telefon Numarası" name="phone">
              <Input prefix={<PhoneOutlined />} placeholder="Örn: +90 555 123 45 67" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loadingProfile}>
              Bilgileri Kaydet
            </Button>
          </Form>
        </Card>

        {/* ŞİFRE DEĞİŞTİRME KARTI */}
        <Card title="Şifre Değiştir" bordered={false} style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
          <Form 
            form={passwordForm} 
            layout="vertical" 
            onFinish={handleUpdatePassword}
          >
            <Form.Item 
              label="Yeni Şifre" 
              name="password" 
              rules={[{ required: true, message: "Lütfen yeni şifrenizi girin!" }, { min: 6, message: "Şifre en az 6 karakter olmalıdır!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi girin" />
            </Form.Item>

            <Form.Item 
              label="Yeni Şifre (Tekrar)" 
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Lütfen yeni şifrenizi tekrar girin!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Girdiğiniz şifreler eşleşmiyor!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Yeni şifrenizi doğrulayın" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loadingPassword} danger>
              Şifreyi Güncelle
            </Button>
          </Form>
        </Card>

      </Space>
    </div>
  );
}