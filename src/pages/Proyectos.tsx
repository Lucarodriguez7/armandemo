import React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, MapPin, Maximize2, MoveRight } from "lucide-react"

const Proyectos = () => {
  const proyectos = [
    {
      id: "la-feliza",
      title: "La Feliza",
      tag: "Proyecto Destacado",
      location: "Córdoba, Argentina",
      desc: "Un desarrollo que combina naturaleza y urbanismo moderno, diseñado para quienes buscan exclusividad y tranquilidad.",
      image: "https://imgur.com/pgVMN5C.jpg", // Cambia por la foto real de La Feliza
      path: "/proyectos/la-feliza",
      aos: "fade-up"
    },
    {
      id: "valle-del-tabaquillo",
      title: "Valle del Tabaquillo",
      tag: "Nueva Oportunidad",
      location: "Sierras de Córdoba",
      desc: "Lotes premium con vistas imponentes. Una inversión segura en el corazón de la naturaleza serrana.",
      image: "https://imgur.com/50ifKba.jpg", // Cambia por la foto real de Valle del Tabaquillo
      path: "/proyectos/valle-del-tabaquillo",
      aos: "fade-up"
    },
    {
      id: "portal-valparaiso",
      title: "Portal Valparaíso",
      tag: "Próximamente",
      location: "Sierras de Córdoba",
      desc: "Un exclusivo desarrollo residencial enmarcado en las sierras cordobesas, con lotes premium, vistas panorámicas y un entorno natural inigualable.",
      image: "/portal-valparaiso.png",
      path: "/proyectos/portal-valparaiso",
      aos: "fade-up"
    }
  ]

  return (
    <div className="pt-28 md:pt-32 pb-20 overflow-x-hidden bg-white text-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER - Estilo Minimalista */}
        <div className="mb-20" data-aos="fade-down">
          <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-3 block">
            Portfolio Exclusivo
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
            Arquitectura que define <br /> 
            <span className="text-brand-primary/30 italic">un estilo de vida.</span>
          </h1>
          <p className="text-lg text-brand-secondary max-w-2xl leading-relaxed">
            Explorá nuestros desarrollos más recientes. Cada proyecto es una pieza única de ingeniería y diseño pensada para el futuro.
          </p>
        </div>

        {/* LISTADO DE PROYECTOS - Full Width Cards */}
        <div className="space-y-16 md:space-y-24">
          {proyectos.map((proyecto, index) => (
            <div 
              key={proyecto.id} 
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center group`}
              data-aos={proyecto.aos}
            >
              {/* IMAGEN CON EFECTO ZOOM */}
              <div className="w-full md:w-3/5 overflow-hidden rounded-3xl shadow-2xl relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                <img 
                  src={proyecto.image} 
                  alt={proyecto.title}
                  className="w-full h-[400px] md:h-[550px] object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-white/90 backdrop-blur-md text-brand-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    {proyecto.tag}
                  </span>
                </div>
              </div>

              {/* CONTENIDO TEXTUAL */}
              <div className="w-full md:w-2/5 space-y-6">
                <div className="flex items-center gap-2 text-brand-accent">
                  <MapPin size={18} />
                  <span className="text-sm font-medium tracking-wide">{proyecto.location}</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-display font-bold group-hover:text-brand-accent transition-colors duration-300">
                  {proyecto.title}
                </h2>
                
                <p className="text-brand-secondary text-lg leading-relaxed">
                  {proyecto.desc}
                </p>

                <div className="pt-4 flex flex-wrap gap-6 text-sm font-bold text-brand-primary/60 uppercase tracking-tighter">
                  <div className="flex items-center gap-2">
                    <Maximize2 size={16} /> Masterplan Diseñado
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight size={16} /> Entrega Inmediata
                  </div>
                </div>

                <div className="pt-8">
                  <Link 
                    to={proyecto.path}
                    className="inline-flex items-center gap-4 bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-brand-accent hover:shadow-xl transition-all duration-300 group/btn"
                  >
                    Explorar Proyecto
                    <MoveRight className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN FINAL - CTA */}
        <div 
          className="mt-32 bg-gray-50 rounded-[3rem] p-12 md:p-20 text-center border border-gray-100"
          data-aos="zoom-in"
        >
          <h3 className="text-2xl md:text-4xl font-display font-bold mb-6 text-brand-primary">
            ¿Buscas algo a medida?
          </h3>
          <p className="text-brand-secondary mb-10 max-w-xl mx-auto">
            Nuestro equipo técnico puede asesorarte sobre cuál de nuestros desarrollos se adapta mejor a tu perfil de inversión.
          </p>
          <Link 
            to="/contacto"
            className="text-brand-primary font-bold border-b-2 border-brand-accent pb-1 hover:text-brand-accent transition-colors text-lg"
          >
            Hablemos hoy mismo
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Proyectos