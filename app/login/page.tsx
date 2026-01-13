import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { PiEnvelopeLight, PiLockSimpleLight } from "react-icons/pi";

export default function Login() {
  return (
    <section className="bgMain pt-[80px]">
      <div className="maxW lg:min-h-[calc(100vh-80px)] flex items-center justify-center relative z-10 px-4">
        <div className="cardLinear shadow py-10 relative px-10 border-BlueP border rounded-2xl w-full max-w-[600px] mx-auto">
          <div className="mb-8 text-center">
            <p className="text-BlueP/80 text-sm uppercase tracking-[0.3em]">
              Portal Afiliados
            </p>
            <h1 className="text-white text-3xl font-semibold mt-2">
              Acesse sua conta
            </h1>
            <p className="text-white/60 text-sm mt-3">
              Aproveite os relatórios em tempo real e acompanhe seus resultados.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="flex text-white tracking-wider text-sm">
                Email
              </label>
              <div className="relative">
                <PiEnvelopeLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10  w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="seuemail@dominio.com"
                  type="email"
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">
                Senha
              </label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10  pr-3 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-white/70">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="accent-BlueP rounded"
                    defaultChecked
                  />
                  Lembrar-me
                </label>
                <button type="button" className="text-BlueP cursor-pointer hover:underline">
                  Esqueci a senha
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-BlueP hover:bg-BlueP/90 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Entrar
            </button>

            <div className="flex items-center gap-4 text-white/40 text-xs">
              <span className="h-px flex-1 bg-white/20" />
              ou continue com
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <div className="w-full">
              <button
                type="button"
                className="flex cursor-pointer w-full items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                <FcGoogle size={22} />
                Google
              </button>

            </div>

            <p className="text-center text-white/70 text-sm">
              Não tem conta?
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
