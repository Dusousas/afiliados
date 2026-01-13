import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { PiEnvelopeLight, PiLockSimpleLight } from "react-icons/pi";

export default function RegisterPage() {
  return (
    <section className="bgMain pt-[120px] pb-10 ">
      <div className="maxW flex items-center justify-center relative z-10">
        <div className="cardLinear shadow py-10 px-10 border-BlueP border rounded-2xl w-full max-w-[600px] mx-auto">
          <div className="mb-8 text-center">
            <p className="text-BlueP/80 text-sm uppercase tracking-[0.3em]">Portal Afiliados</p>
            <h1 className="text-white text-3xl font-semibold mt-2">Crie sua conta</h1>
            <p className="text-white/60 text-sm mt-3">Faça parte da nossa rede e acompanhe seus ganhos em tempo real.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="flex text-white tracking-wider text-sm">Nome completo</label>
              <div className="relative">
                <FaRegUser className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Seu nome"
                  type="text"
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Email</label>
              <div className="relative">
                <PiEnvelopeLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="seuemail@dominio.com"
                  type="email"
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Senha</label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Digite uma senha segura"
                  type="password"
                />
              </div>
            </div>

            <div>
              <label className="flex text-white tracking-wider text-sm">Confirmar senha</label>
              <div className="relative">
                <PiLockSimpleLight className="text-white/60 absolute left-3 top-[32px] -translate-y-1/2" />
                <input
                  className="bg-Darkgray rounded-lg mt-2 py-3 px-10 w-full text-white outline-none focus:ring-2 focus:ring-BlueP"
                  placeholder="Repita sua senha"
                  type="password"
                />
              </div>
            </div>

            <label className="flex gap-2 text-white/70 text-xs cursor-pointer select-none">
              <input type="checkbox" className="accent-BlueP rounded" defaultChecked />
              Eu li e concordo com os termos de uso.
            </label>

            <button
              type="submit"
              className="w-full cursor-pointer bg-BlueP hover:bg-BlueP/90 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Criar conta
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
              Já possui conta?
              <Link href="/" className="text-BlueP font-semibold ml-1">
                Entre agora
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
