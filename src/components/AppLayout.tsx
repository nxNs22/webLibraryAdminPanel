"use client";

import { ThemedLayout, ThemedSider } from "@refinedev/antd";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemedLayout
      // Sider, sol taraftaki Navbar'ı temsil eder. 
      // İleride buraya kendi logonu veya özel renklerini de ekleyebilirsin.
      Sider={(props) => <ThemedSider {...props} fixed />}
    >
      {children}
    </ThemedLayout>
  );
}