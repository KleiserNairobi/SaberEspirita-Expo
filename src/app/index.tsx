import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { user } = useAuth();

  // Redireciona baseado no estado de autenticação
  return (
    <Redirect
      href={user ? "/(private)/(tabs)/Study/Tela1" : "/(public)/Login"}
    />
  );
}
