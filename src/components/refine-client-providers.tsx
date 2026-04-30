"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { DevtoolsProvider } from "@providers/devtools";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { menuResources } from "@/config/resources";

interface RefineClientProvidersProps {
  children: React.ReactNode;
  defaultMode: "dark" | "light";
}

export function RefineClientProviders({
  children,
  defaultMode,
}: RefineClientProvidersProps) {
  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              authProvider={authProviderClient}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              resources={menuResources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "YLtAuz-NDrGbE-r4X5Qy",
              }}
            >
              {children}
              <RefineKbar />
            </Refine>
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
}
