import { AuthPage } from "@components/auth-page";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { redirect } from "next/navigation";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return (
    <AuthPage 
      type="login" 
      registerLink={false} // 🌟 SİHİRLİ KOD: Kayıt Ol linkini tamamen gizler
      forgotPasswordLink={false} // 🌟 Şifremi Unuttum linkini gizler (istiyorsan silebilirsin)
      rememberMe={<></>} // 🌟 Beni Hatırla butonunu gizler (istiyorsan silebilirsin)
    />
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}