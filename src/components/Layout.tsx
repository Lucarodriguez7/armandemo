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

  const [isOpen,setIsOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  /* Detect scroll */

  useEffect(()=>{

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll",handleScroll);

    return () => window.removeEventListener("scroll",handleScroll);

  },[]);

  /* Cerrar menu al cambiar pagina */

  useEffect(()=>{
    setIsOpen(false);
  },[location.pathname]);

  /* Bloquear scroll cuando el menu abre */

  useEffect(()=>{

    if(isOpen){
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

  },[isOpen]);

  /* Cerrar con ESC */

  useEffect(()=>{

    const esc = (e:KeyboardEvent)=>{
      if(e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown",esc);

    return ()=>window.removeEventListener("keydown",esc);

  },[]);

  const navLinks = [
    { name:"Inicio",path:"/" },
    { name:"Propiedades",path:"/propiedades" },
    { name:"Proyectos",path:"/proyectos" },
    { name:"Tasaciones",path:"/tasaciones" },
    { name:"Nosotros",path:"/nosotros" },
    { name:"Contacto",path:"/contacto" }
  ];

  const navbarBackground =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-[#1f1f1f]/95 backdrop-blur-md shadow-lg";

  return(

<>
<nav
className={cn(
"fixed top-0 left-0 w-full z-40 h-20 flex items-center transition-all duration-300",
navbarBackground
)}
>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

<div className="flex justify-between items-center">

{/* LOGO */}

<Link to="/">

<img
src="https://imgur.com/1tXzOav.jpg"
alt="Arman Propiedades"
className="h-10 md:h-12 object-contain"
/>

</Link>

{/* DESKTOP MENU */}

<div className="hidden md:flex items-center gap-10">

{navLinks.map((link)=>{

const active = location.pathname === link.path;

return(

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

{/* MOBILE BUTTON */}

<button
onClick={()=>setIsOpen(true)}
className="md:hidden text-white"
>

<Menu size={28}/>

</button>

</div>

</div>

</nav>

{/* OVERLAY */}

<div
onClick={()=>setIsOpen(false)}
className={cn(
"fixed inset-0 bg-black/60 z-50 transition-opacity duration-300",
isOpen ? "opacity-100 visible" : "opacity-0 invisible"
)}
/>

{/* SIDE MENU */}

<div
className={cn(
"fixed top-0 right-0 h-screen w-[280px] bg-[#1f1f1f] z-[60] shadow-2xl transform transition-transform duration-300",
isOpen ? "translate-x-0" : "translate-x-full"
)}
>

<div className="flex justify-between items-center p-6 border-b border-white/10">

<img
src="https://imgur.com/1tXzOav.jpg"
className="h-8"
/>

<button onClick={()=>setIsOpen(false)}>

<X className="text-white"/>

</button>

</div>

<div className="flex flex-col gap-6 p-8">

{navLinks.map((link)=>(

<Link
key={link.name}
to={link.path}
onClick={()=>setIsOpen(false)}
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

return(

<footer className="bg-[#1f1f1f] text-white pt-16 pb-8">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

{/* BRAND */}

<div className="space-y-6">

<img
src="https://imgur.com/1tXzOav.jpg"
className="h-12"
/>

<p className="text-white/60 text-sm">

Gestión inmobiliaria responsable y transparente en Córdoba.
Tu confianza es nuestro mayor compromiso.

</p>

<div className="flex gap-4">

<a href="https://instagram.com/arman.propiedades" target="_blank">

<Instagram size={20}/>

</a>

<a href="mailto:armangrupoinmobiliario@gmail.com">

<Mail size={20}/>

</a>

</div>

</div>

{/* NAV */}

<div>

<h3 className="font-semibold mb-6">
Navegación
</h3>

<ul className="space-y-3 text-white/60 text-sm">

<li><Link to="/">Inicio</Link></li>
<li><Link to="/propiedades">Propiedades</Link></li>
<li><Link to="/proyectos">Proyectos</Link></li>
<li><Link to="/tasaciones">Tasaciones</Link></li>
<li><Link to="/nosotros">Nosotros</Link></li>

</ul>

</div>

{/* SERVICES */}

<div>

<h3 className="font-semibold mb-6">
Servicios
</h3>

<ul className="space-y-3 text-white/60 text-sm">

<li>Venta de Propiedades</li>
<li>Alquileres</li>
<li>Tasaciones Profesionales</li>
<li>Desarrollos Inmobiliarios</li>

</ul>

</div>

{/* CONTACT */}

<div>

<h3 className="font-semibold mb-6">
Contacto
</h3>

<ul className="space-y-4 text-white/60 text-sm">

<li className="flex gap-3">
<MapPin size={18}/>
9 de Julio 37, Córdoba
</li>

<li className="flex gap-3">
<Phone size={18}/>
+54 9 351 505 2474
</li>

<li className="flex gap-3">
<Mail size={18}/>
armangrupoinmobiliario@gmail.com
</li>

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
className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
>

<Phone size={24}/>

</a>

);

/* ---------------- PAGE LAYOUT ---------------- */

export const PageLayout = ({children}:{children:React.ReactNode}) => {

return(

<div>

<Navbar/>

<main className="pt-20">
{children}
</main>

<Footer/>

<WhatsAppButton/>

</div>

);

};