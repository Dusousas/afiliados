import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <>
            <footer id='contact' className='bg-Darkgray py-10'>
                <div className='maxWidth'>
                    <footer className="flex flex-col items-center justify-center">

                        <div className="">
                            <a id='main' href=""><img className="w-[150px]" src="/logowhite.png" alt="Logo tipo Youon" /></a>
                        </div>

                        <div className='text-white mt-6 items-center  flex justify-center gap-3'>
                            <a  target="_blank" href="https://www.instagram.com/agencia.youon"><FaInstagramSquare className="text-3xl text-white cursor-pointer" /></a>
                            <a target="_blank" href="https://www.facebook.com/p/Agência-You-On-61559337856628/?locale=pt_PT"><FaFacebookSquare className="text-3xl text-white cursor-pointer" /></a>
                            <a target="_blank" href="https://br.linkedin.com/company/agencia-you-on"><FaLinkedin className="text-3xl text-white cursor-pointer" /></a>
                            <a target="_blank" href="https://www.tiktok.com/@agencia.youon"><AiFillTikTok className="text-[32px] text-white cursor-pointer" /></a>
                        </div>

                        <h1 className='text-[#48484d] mt-6 uppercase'>&copy; - Copyright 2025 <span className='font-bold'>You on</span></h1>
                        <h1 className='font-bold uppercase text-[#48484d]'>Cnpj: <span className='font-normal'>49.202.463/0001-25</span></h1>
                    </footer>
                </div>
            </footer>
        </>
    );
}