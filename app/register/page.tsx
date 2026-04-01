"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { PiEnvelopeLight, PiLockSimpleLight, PiPhoneLight } from "react-icons/pi";
import { authClient } from "@/services/clientApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
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

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas nao conferem.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      router.push(result.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel criar a conta.");
      setLoading(false);
    }
  };

  return (
    <section className="bgMain pt-[120px] pb-10">
      <div className="maxW flex items-center justify-center relative z-10 px-4">
        <div className="cardLinear shadow py-10 px-10 border-BlueP border rounded-2xl w-full max-w-[600px] mx-auto">
          <div className="mb-8 text-center">
            <p className="text-BlueP/80 text-sm uppercase tracking-[0.3em]">Portal Afiliados</p>
            <h1 className="text-white text-3xl font-semibold mt-2">Crie sua conta</h1>
            <p className="text-white/60 text-sm mt-3">
              Seu cadastro ja cria o afiliado no banco e abre seu painel automaticamente.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="flex text-white tracking-wider text-sm">Nome completo</label>
              <div className="relative">
                <FaRegUser className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Seu nome"
                  type="text"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Email</label>
              <div className="relative">
                <PiEnvelopeLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={form.email}
                  onChange={handleChange("email")}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="seuemail@dominio.com"
                  type="email"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Telefone</label>
              <div className="relative">
                <PiPhoneLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="(DDD) 99999-9999"
                  type="text"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Senha</label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={form.password}
                  onChange={handleChange("password")}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Digite uma senha segura"
                  type="password"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Confirmar senha</label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Repita sua senha"
                  type="password"
                  disabled={loading || checkingSession}
                />
              </div>
            </div>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <label className="flex gap-2 text-white/70 text-xs cursor-pointer select-none">
              <input type="checkbox" className="accent-BlueP rounded" defaultChecked />
              Eu li e concordo com os termos de uso.
            </label>

            <button
              type="submit"
              disabled={loading || checkingSession}
              className="w-full cursor-pointer bg-BlueP hover:bg-BlueP/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {checkingSession ? "Verificando..." : loading ? "Criando conta..." : "Criar conta"}
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

            <p className="text-center text-white/70 text-sm">
              Ja possui conta?
              <Link href="/login" className="text-BlueP font-semibold ml-1">
                Entre agora
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
