import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

/* ─── INLINE STYLES FOR FONTS & VARIABLES ────────────────────────── */
const FontStyle: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap');

    :root {
      --gold: #C0A062;
      --gold-dark: #9A7B46;
      --dark-bg: #141414;
      --darker-bg: #0A0A0A;
      --light-bg: #F5F4F0;
      --text-gray: #A3A3A3;
      --border-color: rgba(192, 160, 98, 0.3);
    }
    
    .font-jost { font-family: 'Jost', sans-serif; }
    
    /* Stats Bar separator */
    .stat-divider {
      position: relative;
    }
    .stat-divider:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Table styles for Ficha Técnica */
    .ficha-row:nth-child(even) { background-color: rgba(0,0,0,0.03); }
    .ficha-row:nth-child(odd) { background-color: transparent; }

    .gold-gradient-text {
      background: linear-gradient(to right, var(--gold), #E6D0A7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `}</style>
);

/* ─── ANIMATION VARIANTS ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
const PortalValparaiso: React.FC = () => {
  const whatsappLink = "https://wa.me/5493515052474";

  return (
    <div className="font-jost w-full overflow-x-hidden bg-[var(--dark-bg)] text-white selection:bg-[var(--gold)] selection:text-white">
      <FontStyle />

      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full h-screen flex flex-col justify-end pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://imgur.com/27L0XYP.png')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--darker-bg)] via-[var(--darker-bg)]/60 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 text-center pb-24 md:pb-32">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p variants={fadeUp} className="text-[var(--gold)] text-xs md:text-sm tracking-[0.15em] font-medium uppercase mb-4">
              Locales Comerciales en Alquiler · Zona Sur, Córdoba
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[90px] leading-tight mb-2">
              <span className="font-bold">PORTAL</span> <span className="font-light">VALPARAÍSO</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/80 text-base md:text-lg font-light tracking-wide">
              Av. Ciudad de Valparaíso · Zona Sur, Córdoba
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="relative z-10 w-full bg-[var(--darker-bg)]/90 backdrop-blur-md border-t border-white/5">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 py-8 md:py-10"
          >
            {[
              { value: "6", label: "LOCALES" },
              { value: "88,5 m²", label: "POR LOCAL" },
              { value: "PASEO CUBIERTO", label: "FRENTE AL LOCAL" },
              { value: "ESTAC. PRIVADO", label: "INCLUIDO" },
            ].map((stat, idx) => (
              <motion.div variants={fadeUp} key={idx} className="stat-divider flex flex-col items-center justify-center px-4 py-4 md:py-0 text-center group">
                <div className="text-[var(--gold)] text-2xl md:text-3xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-white/50 tracking-[0.2em] uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ EL PROYECTO & FICHA TECNICA ══ */}
      <section className="w-full flex flex-col lg:flex-row min-h-screen">
        {/* Left Side (Dark) */}
        <div className="w-full lg:w-[45%] bg-[var(--dark-bg)] p-10 md:p-16 lg:p-24 flex flex-col justify-center border-r border-white/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <motion.h3 variants={fadeUp} className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              El Proyecto
            </motion.h3>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Portal <br /> Valparaíso
            </motion.h2>
            <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[var(--gold)] mb-8" />

            <motion.div variants={staggerContainer} className="space-y-6 text-[var(--text-gray)] font-light leading-relaxed text-[15px] mb-12">
              <motion.p variants={fadeUp}>
                Desarrollo comercial de categoría sobre Av. Ciudad de Valparaíso, zona sur de mayor crecimiento de Córdoba.
              </motion.p>
              <motion.p variants={fadeUp}>
                Arquitectura industrial-premium: ladrillo visto, estructura metálica y paseo semi-cubierto.
              </motion.p>
              <motion.p variants={fadeUp}>
                88,5 m² con patio privado, kitchenette, baño y estacionamiento propio.
              </motion.p>
            </motion.div>

            {/* Feature Cards Grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { title: "PATIO PRIVADO", desc: "~62 m²" },
                { title: "KITCHENETTE", desc: "Incluida" },
                { title: "PASEO CUBIERTO", desc: "Uso común" },
                { title: "ESTAC. PRIVADO", desc: "Frente al local" },
              ].map((card, idx) => (
                <motion.div key={idx} variants={fadeUp} className="border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between hover:bg-white/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <span className="text-[var(--gold)] text-[10px] tracking-[0.1em] font-semibold mb-4">{card.title}</span>
                  <span className="text-white/70 text-sm font-light">{card.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side (Light) */}
        <div className="w-full lg:w-[55%] bg-[var(--light-bg)] text-black p-10 md:p-16 lg:p-24 flex flex-col justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-xl mx-auto lg:mx-0">
            <motion.h3 variants={fadeUp} className="text-[var(--gold-dark)] text-xs tracking-[0.2em] uppercase font-semibold mb-10">
              Ficha Técnica
            </motion.h3>

            <motion.div variants={fadeUp} className="w-full flex flex-col text-[14px]">
              {[
                { label: "Proyecto", value: "Portal Valparaíso" },
                { label: "Dirección", value: "Av. Cdad. de Valparaíso, Zona Sur" },
                { label: "Locales disponibles", value: "6 unidades" },
                { label: "Superficie por local", value: "88,5 m²" },
                { label: "Frente al paseo", value: "4,40 m" },
                { label: "Profundidad", value: "~15,18 m" },
                { label: "Patio trasero", value: "~62 m² privado" },
                { label: "Baño", value: "Completo, incluido" },
                { label: "Kitchenette", value: "Incluida" },
                { label: "Estacionamiento", value: "Privado frente al local" },
                { label: "Paseo semi-cubierto", value: "Uso común" },
                { label: "Fachada", value: "Ladrillo visto + acero" },
                { label: "Carpintería", value: "Vidrio + marco metálico negro" },
              ].map((row, idx) => (
                <motion.div variants={fadeUp} key={idx} className="ficha-row flex justify-between py-4 px-4 border-b border-black/5 last:border-0 hover:bg-black/5 transition-colors duration-300 rounded-lg">
                  <span className="text-black/50 font-light">{row.label}</span>
                  <span className="font-medium text-black/80 text-right">{row.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ VISTAS DEL PROYECTO ══ */}
      <section className="w-full bg-[var(--dark-bg)] pt-24 pb-12">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="text-center mb-16 px-6"
        >
          <motion.h3 variants={fadeUp} className="text-[var(--gold)] text-xs md:text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Vistas del Proyecto
          </motion.h3>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-white mb-6">
            Recorrido Visual
          </motion.h2>
          <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[var(--gold)] mx-auto" />
        </motion.div>

        {/* Premium Image Gallery */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="w-full max-w-[1400px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
        >
          {/* Image 1 - Large */}
          <motion.div variants={fadeUp} className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl">
            <img src="https://imgur.com/fAl53Xw.jpg" alt="Vista 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">Fachada Exterior</p>
              <h4 className="text-white text-xl md:text-2xl font-medium drop-shadow-md">Arquitectura Premium</h4>
            </div>
          </motion.div>

          {/* Image 2 - Medium */}
          <motion.div variants={fadeUp} className="md:col-span-5 relative aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl">
            <img src="https://imgur.com/LuJusNa.jpg" alt="Vista 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <p className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">Paseo Comercial</p>
              <h4 className="text-white text-xl md:text-2xl font-medium drop-shadow-md">Diseño Vanguardista</h4>
            </div>
          </motion.div>

          {/* Image 3 - Small 1 */}
          <motion.div variants={fadeUp} className="md:col-span-4 relative aspect-[4/3] md:h-[400px] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl">
            <img src="https://imgur.com/Dp5ymE7.jpg" alt="Vista 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>

          {/* Image 4 - Small 2 */}
          <motion.div variants={fadeUp} className="md:col-span-4 relative aspect-[4/3] md:h-[400px] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl">
            <img src="https://imgur.com/iUPhXQO.jpg" alt="Vista 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>

          {/* Image 5 - Small 3 */}
          <motion.div variants={fadeUp} className="md:col-span-4 relative aspect-[4/3] md:h-[400px] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl">
            <img src="https://imgur.com/nj0g5Uw.jpg" alt="Vista 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <div className="w-full bg-[var(--darker-bg)] border-t border-[var(--gold)]/20 mt-16">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 py-8 md:py-10"
          >
            {[
              { value: "6", label: "Locales disponibles" },
              { value: "88,5 m²", label: "Superficie por local" },
              { value: "Paseo semi-cubierto", label: "Frente al local" },
              { value: "+54 9 351 505-2474", label: "Consultas ARMAN", link: whatsappLink },
            ].map((stat, idx) => (
              <motion.div variants={fadeUp} key={idx} className="stat-divider flex flex-col items-center justify-center px-4 py-4 md:py-0 text-center group">
                {stat.link ? (
                  <a href={stat.link} target="_blank" rel="noreferrer" className="text-[var(--gold)] text-xl md:text-2xl font-semibold mb-2 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                    {stat.value}
                  </a>
                ) : (
                  <div className="text-[var(--gold)] text-xl md:text-2xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                )}
                <div className="text-[10px] md:text-[11px] text-white/50 tracking-[0.1em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ DISTRIBUCION DE LOCALES ══ */}
      <section className="w-full bg-[var(--light-bg)] pt-24 pb-0">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between"
        >
          <div>
            <motion.h3 variants={fadeUp} className="text-[var(--gold-dark)] text-xs tracking-[0.2em] uppercase font-semibold mb-2">
              Planta Baja · Distribución y Ubicación de Lotes
            </motion.h3>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-semibold text-black mb-4 md:mb-0">
              Plano General del Proyecto
            </motion.h2>
          </div>
        </motion.div>

        <div className="w-full max-w-[1400px] mx-auto px-6 mb-16">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            variants={fadeUp}
            className="w-full bg-white rounded-2xl border border-black/10 flex items-center justify-center relative overflow-hidden shadow-xl group"
          >
            <img 
              src="https://imgur.com/YhMuIG1.jpg" 
              alt="Plano de distribución de lotes" 
              className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 pointer-events-none" />
          </motion.div>
        </div>

        {/* Dark Bottom Stats Bar */}
        <div className="w-full bg-[var(--darker-bg)]">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-5 py-8 md:py-10"
          >
            {[
              { value: "6", label: "Locales", label2: "Comerciales" },
              { value: "88,5 m²", label: "Superficie", label2: "por Local" },
              { value: "~62 m²", label: "Patio Trasero", label2: "Privado" },
              { value: "4,40 m", label: "Frente", label2: "al Paseo" },
              { value: "19,00 m", label: "Longitud", label2: "Total" },
            ].map((stat, idx) => (
              <motion.div variants={fadeUp} key={idx} className="stat-divider flex flex-col items-center justify-center px-4 py-4 md:py-0 text-center group">
                <div className="text-[var(--gold)] text-xl md:text-2xl font-semibold mb-3 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-[10px] md:text-[11px] text-white/50 tracking-[0.05em] font-light leading-tight">
                  {stat.label} <br /> {stat.label2}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ UBICACION ESTRATEGICA ══ */}
      <section className="w-full relative bg-[var(--dark-bg)]">
        {/* Top Image Half */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="w-full h-[50vh] min-h-[400px] relative"
        >
          {/* Reusing one of the nice project renders for the map area since we don't have a map image, 
              using the main facade image as an establishing shot */}
          <div className="absolute inset-0 bg-[url('https://imgur.com/fAl53Xw.jpg')] bg-cover bg-center" style={{ backgroundAttachment: 'fixed' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)] via-[var(--dark-bg)]/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1000px] mx-auto px-6 -mt-20 pb-32 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h3 variants={fadeUp} className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-semibold mb-6">
              Ubicación Estratégica
            </motion.h3>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-semibold text-white mb-8">
              Av. Ciudad de Valparaíso
            </motion.h2>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-12">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-white/80 font-light text-lg tracking-wide">Zona Sur, Córdoba</span>
              <div className="h-[1px] w-12 bg-white/20" />
            </motion.div>

            <motion.div variants={staggerContainer} className="max-w-[700px] mx-auto space-y-6 text-[var(--text-gray)] font-light leading-relaxed text-[15px] mb-20">
              <motion.p variants={fadeUp}>
                Corredor residencial y comercial consolidado en la Zona Sur de Córdoba.
                Una de las áreas de mayor desarrollo y crecimiento de la ciudad,
                con alta densidad de vivienda, colegios, comercios y acceso directo a Av. de Circunvalación.
              </motion.p>
              <motion.p variants={fadeUp}>
                Alto flujo vehicular y peatonal constante. <br />
                Público de perfil familiar, con fuerte poder adquisitivo.
              </motion.p>
            </motion.div>

            {/* Outlined Features Grid */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { top: "ZONA SUR", line1: "Corredor de alto", line2: "crecimiento" },
                { top: "PÚBLICO", line1: "Perfil familiar", line2: "poder adquisitivo" },
                { top: "ACCESO", line1: "Circunvalación", line2: "a metros" },
                { top: "ENTORNO", line1: "Residencial", line2: "consolidado" },
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUp} className="border border-[var(--border-color)] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[var(--gold)]/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(192,160,98,0.15)] group">
                  <span className="text-[var(--gold)] text-[9px] tracking-[0.15em] uppercase font-semibold mb-4 group-hover:scale-110 transition-transform duration-300">{item.top}</span>
                  <span className="text-white font-medium text-sm leading-relaxed">{item.line1} <br /> {item.line2}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortalValparaiso;


