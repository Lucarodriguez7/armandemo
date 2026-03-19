import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Instagram, Mail, MapPin } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------------- NAVBAR ---------------- */

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Propiedades", path: "/propiedades" },
    { name: "Proyectos", path: "/proyectos" },
    { name: "Tasaciones", path: "/tasaciones" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Contacto", path: "/contacto" }
  ];

  const navbarBackground =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-[#1f1f1f]/95 backdrop-blur-md shadow-lg";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-40 h-20 flex items-center transition-all duration-300",
          navbarBackground
        )}
      >
        {/* Usamos max-width 100% y overflow hidden para que la nav no empuje el layout */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img
                src="https://imgur.com/1tXzOav.jpg"
                alt="Arman Propiedades"
                className="h-10 md:h-12 object-contain"
              />
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-sm text-white relative group",
                      active && "font-semibold"
                    )}
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              })}
            </div>

            <button onClick={() => setIsOpen(true)} className="md:hidden text-white p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      />

      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-[280px] bg-[#1f1f1f] z-[60] shadow-2xl transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <img src="https://imgur.com/1tXzOav.jpg" className="h-8" alt="Logo" />
          <button onClick={() => setIsOpen(false)}>
            <X className="text-white" />
          </button>
        </div>
        <div className="flex flex-col gap-6 p-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-white text-lg font-medium hover:opacity-70 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

/* ---------------- FOOTER ---------------- */

export const Footer = () => {
  return (
    <footer className="bg-[#1f1f1f] text-white pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <img src="https://imgur.com/1tXzOav.jpg" className="h-12" alt="Logo" />
            <p className="text-white/60 text-sm">
              Gestión inmobiliaria responsable y transparente en Córdoba. Tu confianza es nuestro mayor compromiso.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/arman.propiedades" target="_blank" rel="noreferrer">
                <Instagram size={20} className="hover:text-white/80 transition" />
              </a>
              <a href="mailto:armangrupoinmobiliario@gmail.com">
                <Mail size={20} className="hover:text-white/80 transition" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-6">Navegación</h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link to="/" className="hover:text-white transition">Inicio</Link></li>
              <li><Link to="/propiedades" className="hover:text-white transition">Propiedades</Link></li>
              <li><Link to="/proyectos" className="hover:text-white transition">Proyectos</Link></li>
              <li><Link to="/tasaciones" className="hover:text-white transition">Tasaciones</Link></li>
              <li><Link to="/nosotros" className="hover:text-white transition">Nosotros</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6">Servicios</h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>Venta de Propiedades</li>
              <li>Alquileres</li>
              <li>Tasaciones Profesionales</li>
              <li>Desarrollos Inmobiliarios</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex gap-3"><MapPin size={18} /> 9 de Julio 37, Córdoba</li>
              <li className="flex gap-3"><Phone size={18} /> +54 9 351 505 2474</li>
              <li className="flex gap-3"><Mail size={18} /> armangrupoinmobiliario@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Arman Propiedades
        </div>
      </div>
    </footer>
  );
};

/* ---------------- WHATSAPP ---------------- */

export const WhatsAppButton = () => (
  <a
    href="https://wa.me/5493515052474"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition active:scale-95"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

/* ---------------- PAGE LAYOUT (FIXED) ---------------- */

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-wrapper" style={{ 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'hidden', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Estilos globales de emergencia para asegurar el responsive */}
      <style>{`
        html, body {
          max-width: 100% !important;
          overflow-x: hidden !important;
          margin: 0;
          padding: 0;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Previene que elementos internos empujen el viewport */
        * {
          box-sizing: border-box;
        }

        main {
          flex: 1;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
      `}</style>

      <Navbar />

      <main className="pt-20">
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
};