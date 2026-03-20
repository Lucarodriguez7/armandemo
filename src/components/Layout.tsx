import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Instagram, Mail, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------------- NAVBAR ---------------- */

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [proyectosOpen, setProyectosOpen] = useState(false); // Desktop dropdown
  const [proyectosMobileOpen, setProyectosMobileOpen] = useState(false); // Mobile accordion
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  /* ── scroll effect ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── cierra mobile al cambiar de ruta ── */
  useEffect(() => {
    setIsOpen(false);
    setProyectosMobileOpen(false);
  }, [location.pathname]);

  /* ── bloquea scroll cuando mobile menu está abierto ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const proyectos = [
    { name: "La Feliza", path: "/proyectos/la-feliza" },
    { name: "Valle del Tabaquillo", path: "/proyectos/valle-del-tabaquillo" },
  ];

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Propiedades", path: "/propiedades" },
    { name: "Tasaciones", path: "/tasaciones" },
    { name: "Nosotros", path: "/nosotros" },
    { name: "Contacto", path: "/contacto" },
  ];

  const navbarBackground =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-[#1f1f1f]/95 backdrop-blur-md shadow-lg";

  const isProyectosActive = location.pathname.startsWith("/proyectos");

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-40 h-20 flex items-center transition-all duration-300 border-b border-transparent",
          !isHome || scrolled ? "border-white/10" : "",
          navbarBackground
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link to="/" className="z-50 transition-transform hover:scale-105 active:scale-95">
              <img
                src="https://imgur.com/1tXzOav.jpg"
                alt="Arman Propiedades"
                className="h-10 md:h-12 object-contain"
              />
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div className="hidden md:flex items-center gap-10">
              
              {/* Inicio y Propiedades */}
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-xs font-semibold tracking-wider uppercase text-white/70 hover:text-white transition-all relative group",
                    location.pathname === link.path && "text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300",
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}

              {/* DROPDOWN PROYECTOS (Hover) */}
              <div 
                className="relative group h-20 flex items-center"
                onMouseEnter={() => setProyectosOpen(true)}
                onMouseLeave={() => setProyectosOpen(false)}
              >
                <Link
                  to="/proyectos"
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-white/70 hover:text-white transition-all group",
                    isProyectosActive && "text-white"
                  )}
                >
                  Proyectos
                  <ChevronDown size={14} className={cn("transition-transform duration-300", proyectosOpen && "rotate-180")} />
                  <span className={cn(
                    "absolute left-0 bottom-6 h-[2px] bg-white transition-all duration-300",
                    isProyectosActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>

                {/* Dropdown Panel */}
                <div className={cn(
                  "absolute top-[80px] left-1/2 -translate-x-1/2 w-64 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
                  proyectosOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
                )}>
                  <div className="p-2">
                    {proyectos.map((p) => (
                      <Link
                        key={p.path}
                        to={p.path}
                        className="flex items-center justify-between px-5 py-4 text-xs font uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        {p.name}
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <Link
                        to="/proyectos"
                        className="block text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                      >
                        Ver todos los desarrollos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resto de links */}
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-xs font-semibold tracking-wider uppercase text-white/70 hover:text-white transition-all relative group",
                    location.pathname === link.path && "text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300",
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}
            </div>

            {/* Hamburguesa mobile */}
            <button 
              onClick={() => setIsOpen(true)} 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] transition-opacity duration-500",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      />

      {/* ── MOBILE DRAWER ── */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-full sm:w-[350px] bg-[#111] z-[60] shadow-2xl transform transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-8 border-b border-white/5">
          <img src="https://imgur.com/1tXzOav.jpg" className="h-10" alt="Logo" />
          <button 
            onClick={() => setIsOpen(false)}
            className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-8 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xl font-semibold text-white hover:text-white/60 transition py-4 border-b border-white/5"
            >
              {link.name}
            </Link>
          ))}

          {/* Acordeón Proyectos mobile */}
          <div className="border-b border-white/5">
            <button
              onClick={() => setProyectosMobileOpen(!proyectosMobileOpen)}
              className="w-full flex items-center justify-between text-xl font-semibold text-white py-8"
            >
              Proyectos
              <ChevronDown className={cn("transition-transform duration-300", proyectosMobileOpen && "rotate-180")} />
            </button>
            
            <div className={cn(
              "overflow-hidden transition-all duration-500 space-y-4 px-4",
              proyectosMobileOpen ? "max-h-[500px] pb-8 opacity-100" : "max-h-0 opacity-0"
            )}>
              <Link to="/proyectos" className="block text-white/40 font-bold uppercase tracking-widest text-xs mb-4">Ver Catálogo General</Link>
              {proyectos.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className="block text-lg font-medium text-white/80 hover:text-white"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xl font-semibold text-white hover:text-white/60 transition py-4 border-b border-white/5"
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
    <footer className="bg-[#111] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <img src="https://imgur.com/1tXzOav.jpg" className="h-14" alt="Logo" />
            <p className="text-white/40 text-sm leading-relaxed">
              Elevamos el estándar inmobiliario en Córdoba con transparencia, diseño y compromiso profesional.
            </p>
            <div className="flex gap-6">
              <a href="https://instagram.com/arman.propiedades" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="mailto:armangrupoinmobiliario@gmail.com" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-white/30">Explorar</h3>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><Link to="/propiedades" className="hover:text-white transition">Catálogo</Link></li>
              <li><Link to="/proyectos" className="hover:text-white transition">Desarrollos</Link></li>
              <li><Link to="/tasaciones" className="hover:text-white transition">Tasaciones</Link></li>
              <li><Link to="/nosotros" className="hover:text-white transition">Nuestra Historia</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-white/30">Proyectos</h3>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><Link to="/proyectos/la-feliza" className="hover:text-white transition">La Feliza</Link></li>
              <li><Link to="/proyectos/valle-del-tabaquillo" className="hover:text-white transition">Valle del Tabaquillo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-white/30">Ubicación</h3>
            <ul className="space-y-6 text-white/60 text-sm font-medium">
              <li className="flex gap-4 items-start leading-relaxed">
                <MapPin size={20} className="text-white/20 shrink-0" /> 
                <span>Calle 9 de Julio 37, <br />Córdoba Capital</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone size={20} className="text-white/20 shrink-0" /> 
                <span>+54 9 351 505 2474</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
          <span>© {new Date().getFullYear()} ARMAN GRUPO INMOBILIARIO</span>
          <a href="https://www.entercompany.ar" target="_blank" rel="noreferrer" className="text-[#4A90D9]/60 hover:text-[#4A90D9] transition-colors duration-200">Desarrollado por Enter Company</a>
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
    className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">1</span>
  </a>
);

/* ---------------- PAGE LAYOUT ---------------- */

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-wrapper flex flex-col min-h-screen w-full overflow-x-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        html, body {
          max-width: 100% !important;
          overflow-x: hidden !important;
          margin: 0; padding: 0; width: 100%;
          background-color: #111;
          font-family: 'DM Sans', sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>

      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};