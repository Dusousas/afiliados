"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { PiEnvelopeLight, PiLockSimpleLight } from "react-icons/pi";
import { authClient } from "@/services/clientApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    authClient
      .getCurrentUser()
      .then((user) => {
        if (!mounted) return;
        if (user) {
          router.replace(user.role === "admin" ? "/admin" : "/dashboard");
          return;
        }
        setCheckingSession(false);
      })
      .catch(() => {
        if (!mounted) return;
        setCheckingSession(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authClient.login({ email, password });
      router.push(result.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel entrar.");
      setLoading(false);
    }
  };

  return (
    <section className="bgMain pt-[80px]">
      <div className="maxW lg:min-h-[calc(100vh-80px)] flex items-center justify-center relative z-10 px-4">
        <div className="cardLinear shadow py-10 relative px-10 border-BlueP border rounded-2xl w-full max-w-[600px] mx-auto">
          <div className="mb-8 text-center">
            <p className="text-BlueP/80 text-sm uppercase tracking-[0.3em]">Portal Afiliados</p>
            <h1 className="text-white text-3xl font-semibold mt-2">Acesse sua conta</h1>
            <p className="text-white/60 text-sm mt-3">
              Entre com seu perfil para abrir o painel certo automaticamente.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="flex text-white tracking-wider text-sm">Email</label>
              <div className="relative">
                <PiEnvelopeLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="seuemail@dominio.com"
                  type="email"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Senha</label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 pr-3 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Digite sua senha"
                  type="password"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <button
              type="submit"
              disabled={loading || checkingSession}
              className="w-full cursor-pointer bg-BlueP hover:bg-BlueP/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {checkingSession ? "Verificando..." : loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex items-center gap-4 text-white/40 text-xs">
              <span className="h-px flex-1 bg-white/20" />
              ou continue com
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <div className="w-full">
              <button
                type="button"
                className="flex cursor-not-allowed w-full items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold opacity-70"
              >
                <FcGoogle size={22} />
                Google em breve
              </button>
            </div>

            <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
              Admin dev: <span className="font-semibold">admin@youon.com</span> /{" "}
              <span className="font-semibold">Admin123!</span>
            </div>

            <p className="text-center text-white/70 text-sm">
              Nao tem conta?
              <Link href="/register" className="text-BlueP font-semibold ml-1">
                Crie agora
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
