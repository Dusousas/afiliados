"use client";

import React, { useState, useEffect, JSX } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation"; // ✅ App Router

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const router = useRouter();
  const pathname = usePathname(); // ✅ rota atual

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleNavigation = (path: string, section?: string | null): void => {
    setIsOpen(false);

    if (path && path !== pathname) {
      if (section) {
        sessionStorage.setItem("scrollToSection", section);
      }
      router.push(path); // ✅ continua igual
    } else if (section) {
      scrollToSection(section);
    }
  };

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const sectionToScroll: string | null =
      sessionStorage.getItem("scrollToSection");
    if (sectionToScroll) {
      sessionStorage.removeItem("scrollToSection");
      setTimeout(() => {
        scrollToSection(sectionToScroll);
      }, 100);
    }
  }, []);

  // Detecta a seção ativa na Home
  useEffect(() => {
    const sections = ["home", "services", "plans", "portfolio", "faq"];

    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      for (let section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // inicial
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  const menuItems = [
    { name: "Minha conta", section: "home", path: "/" },

  ];

  const renderButton = (item: (typeof menuItems)[0]) => {
    const isActive =
      (item.section &&
        activeSection === item.section &&
        pathname === "/") ||
      (!item.section && pathname === item.path);

    return (
      <button
        key={item.name}
        onClick={() => handleNavigation(item.path, item.section || "")}
        className={`uppercase transition-opacity cursor-pointer ${
          isActive ? "text-BlueP font-bold" : "hover:text-BlueP"
        }`}
        type="button"
      >
        {item.name}
      </button>
    );
  };

  return (
    <>
      <nav className="hidden lg:block">
        <ul className="flex gap-6 items-center text-md uppercase tracking-widest">
          {menuItems.map(renderButton)}
        </ul>
      </nav>

      {/* Menu Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl cursor-pointer text-BlueP focus:outline-none relative z-50"
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        <nav
          className={`fixed top-0 right-0 h-screen w-full bg-white shadow-md z-40 flex flex-col items-center justify-center transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="flex flex-col items-center gap-8 text-lg text-black">
            {menuItems.map(renderButton)}
          </ul>
        </nav>
      </div>
    </>
  );
}
