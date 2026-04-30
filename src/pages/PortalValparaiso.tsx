import React, { useRef, useEffect, ReactNode } from "react"
import {
  MapPin, ArrowRight, ShieldCheck, TreePine, Star, Sun, Mountain,
  Home, Compass, Phone,
} from "lucide-react"
import { motion } from "framer-motion"

/* ─── SECTION REVEAL HOOK ──────────────────────────────────── */
function useSectionReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

/* ─── GLOBAL STYLES ────────────────────────────────────────── */
const FontStyle: React.FC = () => (
  <style>{`
    :root {
      --emerald:       #2D7D5F;
      --emerald-light: #5DAE8B;
      --emerald-dark:  #1B5E43;
      --cream:         #FAF8F4;
      --dark:          #1A1F1C;
      --muted:         #6B7B72;
      --border:        rgba(45,125,95,0.2);
      --gold:          #C9A96E;
      --gold-light:    #E8D5B0;
    }
    html, body { overflow-x: hidden; max-width: 100%; }
    *, *::before, *::after { box-sizing: border-box; }
    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'Jost', sans-serif; }
    .font-pinyon  { font-family: 'Pinyon Script', cursive; font-weight: 400; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(8px); }
    }

    .reveal {
      opacity: 0;
      animation-fill-mode: both;
      animation-duration: 0.6s;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    .in-view .reveal               { animation-name: fadeUp; }
    .reveal[data-delay="1"]        { animation-delay: 0.08s; }
    .reveal[data-delay="2"]        { animation-delay: 0.16s; }
    .reveal[data-delay="3"]        { animation-delay: 0.24s; }
    .reveal[data-delay="4"]        { animation-delay: 0.32s; }

    .hero-pv-bg {
      position: absolute; inset: 0;
      background-image: url('/portal-valparaiso.png');
      background-size: cover; background-position: center;
      will-change: transform; transform: translateZ(0);
    }

    .emerald-divider {
      width: 60px; height: 1px;
      background: linear-gradient(to right, transparent, var(--emerald), transparent);
      margin: 0 auto;
    }
    .section-inner-pv { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 32px; }

    .info-card-pv {
      background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 32px 24px;
      transition: box-shadow 0.3s ease, transform 0.3s ease; transform: translateZ(0);
    }
    .info-card-pv:hover { transform: translateY(-6px) translateZ(0); box-shadow: 0 24px 60px rgba(0,0,0,0.1); }

    .feature-card-pv {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(45,125,95,0.15);
      border-radius: 16px; padding: 28px 24px; transition: border-color 0.3s, background 0.3s;
    }
    .feature-card-pv:hover { border-color: rgba(45,125,95,0.4); background: rgba(45,125,95,0.06); }

    .scroll-line-pv { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent); animation: scrollBounce 1.5s ease-in-out infinite; }

    @media (max-width: 768px) {
      .pv-page-root { overflow-x: hidden; width: 100%; }
      .pv-page-root * { max-width: 100%; }
      .section-inner-pv { padding: 0 18px; }
      .section-pad-pv   { padding: 64px 0 !important; }
      .pv-stats-grid    { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
      .pv-hero-text     { padding: 0 18px !important; max-width: 100% !important; width: 100% !important; }
      .pv-hero-title    { font-size: clamp(72px, 18vw, 100px) !important; }
      .pv-hero-badge    { font-size: 10px !important; letter-spacing: 0.08em !important; }
      .pv-hero-buttons  { flex-direction: column !important; gap: 12px !important; }
      .pv-hero-buttons a { width: 100% !important; justify-content: center !important; }
      .pv-info-grid     { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

/* ─── TYPES ────────────────────────────────────────────────── */
interface InfoCard { icon: ReactNode; title: string; text: string }
interface FeatureCard { icon: ReactNode; title: string; desc: string }

/* ─── MAIN COMPONENT ───────────────────────────────────────── */
const PortalValparaiso: React.FC = () => {
  const whatsappLink = "https://wa.me/5493515052474"

  const infoRef     = useSectionReveal(0.15)
  const featuresRef = useSectionReveal(0.1)
  const ctaRef      = useSectionReveal(0.2)
  const locationRef = useSectionReveal(0.15)

  const infoCards: InfoCard[] = [
    { icon: <Mountain size={20} />,    title: "Entorno serrano",           text: "Rodeado de sierras con vistas panorámicas, aire puro y la tranquilidad que solo la naturaleza puede ofrecer." },
    { icon: <Sun size={20} />,         title: "Lotes amplios",             text: "Parcelas desde 600 m² hasta más de 1.500 m², diseñados para construir la casa de tus sueños." },
    { icon: <ShieldCheck size={20} />, title: "Seguridad 24/7",            text: "Acceso controlado, vigilancia permanente y perímetro cerrado para la tranquilidad de toda la familia." },
    { icon: <TreePine size={20} />,    title: "Espacios verdes",           text: "Senderos peatonales, plazas, arbolado nativo y un masterplan paisajístico que respeta el entorno." },
    { icon: <Home size={20} />,        title: "Infraestructura completa",  text: "Calles consolidadas, iluminación LED, red de agua, cloacas y gas natural desde el inicio." },
    { icon: <Compass size={20} />,     title: "Ubicación estratégica",     text: "Conectividad directa con rutas principales, a minutos de centros urbanos y servicios esenciales." },
  ]

  const featureCards: FeatureCard[] = [
    { icon: <Star size={20} />,        title: "Escritura inmediata",       desc: "Lotes con escritura individual desde el momento de la compra. Sin esperas, sin trámites complicados." },
    { icon: <MapPin size={20} />,      title: "Plusvalía garantizada",     desc: "Zona de alto crecimiento con proyección de revalorización sostenida. Tu inversión crece año a año." },
    { icon: <TreePine size={20} />,    title: "Vida al aire libre",        desc: "Club house, áreas deportivas, senderos y espacios de encuentro para disfrutar en comunidad." },
    { icon: <ShieldCheck size={20} />, title: "Respaldo profesional",      desc: "Desarrollado por ARMAN Grupo Inmobiliario con trayectoria comprobada en proyectos de alta gama." },
  ]

  return (
    <div className="font-body pv-page-root" style={{ background: "var(--cream)", color: "var(--dark)", overflowX: "hidden", width: "100%", position: "relative" }}>
      <FontStyle />

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 72 }}>
        <div style={{ position: "absolute", inset: 0, transform: "translateZ(0)" }}>
          <div className="hero-pv-bg" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,31,28,0.82) 0%, rgba(26,31,28,0.45) 60%, transparent 100%)", contain: "strict" }} />
        </div>
        <motion.div className="pv-hero-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 2, maxWidth: 760, padding: "0 48px", width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="pv-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,125,95,0.2)", border: "1px solid var(--emerald)", borderRadius: 40, padding: "6px 16px", marginBottom: 28, color: "var(--emerald-light)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            <Star size={10} fill="currentColor" /> Próximamente · Sierras de Córdoba
          </motion.div>
          <motion.h1 className="font-pinyon pv-hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: "'Pinyon Script',cursive", fontSize: "clamp(72px,11vw,140px)", fontWeight: 400, color: "#fff", lineHeight: 0.9, marginBottom: 28 }}>
            Portal <span style={{ color: "var(--emerald-light)" }}>Valparaíso</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}>
            Un desarrollo residencial exclusivo enmarcado en las sierras cordobesas. Lotes premium con vistas panorámicas, infraestructura completa y un entorno natural que redefine la calidad de vida.
          </motion.p>
          <motion.div className="pv-hero-buttons" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.34 }} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--emerald)", color: "#fff", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 32px rgba(45,125,95,0.4)", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(45,125,95,0.55)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,125,95,0.4)" }}>
              Solicitar información <ArrowRight size={16} />
            </a>
            <a href="#ubicacion" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 400, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}>
              Ver ubicación
            </a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.15em", zIndex: 2 }}>
          <span style={{ textTransform: "uppercase" }}>Explorar</span>
          <div className="scroll-line-pv" />
        </motion.div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section className="section-pad-pv" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner-pv">
          <div ref={infoRef}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="reveal" style={{ color: "var(--emerald)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>El proyecto</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
                Tu refugio en las<br /><em>sierras de Córdoba</em>
              </h2>
              <div className="reveal emerald-divider" data-delay="2" style={{ marginTop: 24 }} />
            </div>
            <div className="pv-info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {infoCards.map((item, i) => (
                <div key={i} className="info-card-pv reveal" data-delay={String((i % 4) + 1)}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(45,125,95,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald)", marginBottom: 20 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="section-pad-pv" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(45,125,95,0.07) 0%, transparent 65%)", pointerEvents: "none", contain: "strict" }} />
        <div className="section-inner-pv" style={{ position: "relative", zIndex: 1 }}>
          <div ref={featuresRef}>
            <div style={{ marginBottom: 64 }}>
              <p className="reveal" style={{ color: "var(--emerald-light)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>¿Por qué Portal Valparaíso?</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                Invertí en un lugar<br /><em style={{ color: "var(--emerald-light)" }}>que crece con vos</em>
              </h2>
              <div className="reveal emerald-divider" data-delay="2" style={{ margin: "0 0 24px", background: "linear-gradient(to right, transparent, var(--emerald-light), transparent)" }} />
              <p className="reveal" data-delay="3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, maxWidth: 520 }}>
                Portal Valparaíso combina la belleza natural de las sierras con infraestructura de primer nivel, creando un espacio ideal para vivir, descansar o invertir con proyección a futuro.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 48 }}>
              {featureCards.map((item, i) => (
                <div key={i} className="feature-card-pv reveal" data-delay={String((i % 4) + 1)}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(45,125,95,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-light)", marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="section-pad-pv" style={{ padding: "80px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(45,125,95,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(45,125,95,0.04) 0%, transparent 60%)", contain: "strict" }} />
        <div className="section-inner-pv" style={{ position: "relative", zIndex: 1 }}>
          <div className="pv-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
            {[
              { n: "600+", label: "m² lote mínimo" },
              { n: "24/7", label: "Seguridad" },
              { n: "15", label: "Min del centro" },
              { n: "100%", label: "Infraestructura" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display" style={{ fontSize: "clamp(36px,4vw,64px)", fontWeight: 300, color: "var(--emerald-light)", lineHeight: 1 }}>
                  {s.n}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UBICACIÓN ══ */}
      <section id="ubicacion" className="section-pad-pv" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner-pv">
          <div ref={locationRef}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="reveal" style={{ color: "var(--emerald)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Ubicación</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>En el corazón de las <em>sierras</em></h2>
            </div>
            <div className="reveal" data-delay="2" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 28 }}>
              {[
                { icon: <MapPin size={13} />, text: "Sierras de Córdoba" },
                { icon: <Mountain size={13} />, text: "Vistas panorámicas" },
                { icon: <TreePine size={13} />, text: "Entorno natural preservado" },
              ].map((tag, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,125,95,0.1)", border: "1px solid var(--border)", borderRadius: 40, padding: "10px 18px", fontSize: 13, color: "var(--emerald-dark)", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {tag.icon} {tag.text}
                </span>
              ))}
            </div>
            <p className="reveal" data-delay="3" style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 32, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              Ubicación exacta disponible para interesados. Contactanos para coordinar una visita al terreno y conocer el proyecto en persona.
            </p>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="section-pad-pv" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(45,125,95,0.08) 0%, transparent 65%)", contain: "strict" }} />
        <div className="section-inner-pv" style={{ position: "relative", zIndex: 1 }}>
          <div ref={ctaRef} style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <p className="reveal" style={{ color: "var(--emerald-light)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Reservá tu lote</p>
            <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
              Sé parte del<br /><em style={{ color: "var(--emerald-light)" }}>nuevo Valparaíso</em>
            </h2>
            <p className="reveal" data-delay="2" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, marginBottom: 40 }}>
              Las pre-reservas están abiertas. Asegurá tu lugar en uno de los desarrollos más exclusivos de las sierras cordobesas. Contactanos hoy.
            </p>
            <div className="reveal" data-delay="3" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--emerald)", color: "#fff", padding: "18px 36px", borderRadius: 50, fontSize: 15, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 32px rgba(45,125,95,0.4)", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(45,125,95,0.55)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,125,95,0.4)" }}>
                <Phone size={16} /> Hablar con un asesor
              </a>
            </div>
            <p className="reveal" data-delay="4" style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 32 }}>
              Preventa exclusiva · Cupos limitados
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PortalValparaiso
