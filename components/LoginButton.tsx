// components/LoginButton.tsx
'use client'
import { useAuth } from "@/hooks/useAuth";

export default function LoginButton() {
  const { user, login, logout } = useAuth();

  return user ? (
    <button onClick={logout}>Se déconnecter</button>
  ) : (
    <button onClick={login}>Se connecter avec Google</button>
  );
}
