import React, { useState, useRef, useEffect } from "react"
import {
  MapPin,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Phone,
  Star,
  Sun,
  Waves,
  DollarSign,
  CalendarDays,
  BadgeCheck,
  Percent
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import Map, { Marker } from "react-map-gl/mapbox"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

/* ─── GOOGLE FONT + GLOBAL STYLES ───────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

    :root {
      --gold: #C9A96E;
      --gold-light: #E8D5B0;
      --gold-dark: #A07840;
      --cream: #FAF8F4;
      --dark: #1A1814;
      --dark-2: #2C2820;
      --muted: #8A8278;
      --border: rgba(201,169,110,0.2);
    }

    /* ── HARD RESET: previene scroll horizontal ── */
    html, body {
      overflow-x: hidden;
      max-width: 100%;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'Jost', sans-serif; }

    /* ── RANGE INPUT ── */
    input[type=range].premium-range {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: linear-gradient(
        to right,
        var(--gold) 0%,
        var(--gold) var(--val, 50%),
        rgba(201,169,110,0.2) var(--val, 50%),
        rgba(201,169,110,0.2) 100%
      );
      border-radius: 4px;
      outline: none;
    }
    input[type=range].premium-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: var(--gold);
      border: 3px solid var(--cream);
      box-shadow: 0 0 0 1px var(--gold), 0 4px 12px rgba(201,169,110,0.4);
      cursor: pointer;
      transition: transform 0.15s;
    }
    input[type=range].premium-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
    input[type=range].premium-range::-moz-range-thumb {
      width: 22px; height: 22px;
      border-radius: 50%;
      background: var(--gold);
      border: 3px solid var(--cream);
      cursor: pointer;
    }

    /* ── CAROUSEL ── */
    .carousel-track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }
    .carousel-track::-webkit-scrollbar { display: none; }
    .carousel-slide { scroll-snap-align: center; flex-shrink: 0; }

    /* ── GOLD DIVIDER ── */
    .gold-divider {
      width: 60px; height: 1px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
      margin: 0 auto;
    }

    /* ── SECTION WRAPPER ── */
    .section-inner {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 32px;
    }

    /* ── VISIBILITY HELPERS ── */
    .desktop-carousel { display: flex; flex-direction: column; }
    .mobile-carousel  { display: none; }

    /* ── GRIDS ── */
    .sim-controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-bottom: 40px;
    }
    .sim-results-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      text-align: center;
    }
    .info-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    /* ── EXP ROW ── */
    .exp-row {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      padding: 32px 0;
      text-align: left;
    }
    .exp-num { font-size: 36px; flex-shrink: 0; }

    /* ════════════════════════════════════════
       MOBILE  ≤ 768px
    ════════════════════════════════════════ */
    @media (max-width: 768px) {

      /* Wrapper: todo hijo respeta el ancho */
      .page-root { overflow-x: hidden; width: 100%; }
      .page-root * { max-width: 100%; }

      /* Section padding */
      .section-inner { padding: 0 18px; }
      .section-pad   { padding: 64px 0 !important; }

      /* Carousel */
      .desktop-carousel { display: none !important; }
      .mobile-carousel  { display: block !important; }

      /* Stats: 2 columnas en mobile */
      .stats-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 28px !important;
      }

      /* Hero */
      .hero-text-wrap {
        padding: 0 18px !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      .hero-title   { font-size: clamp(52px, 14vw, 80px) !important; }
      .hero-badge   { font-size: 10px !important; letter-spacing: 0.08em !important; }
      .hero-buttons { flex-direction: column !important; gap: 12px !important; }
      .hero-buttons a {
        width: 100% !important;
        justify-content: center !important;
        text-align: center !important;
      }

      /* Simulador */
      .sim-controls-grid {
        grid-template-columns: 1fr !important;
        gap: 28px !important;
      }
      .sim-results-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .sim-box {
        padding: 28px 18px !important;
        border-radius: 20px !important;
      }

      /* Experiencia */
      .exp-row { gap: 16px !important; }
      .exp-num { font-size: 22px !important; }

      /* Mapa */
      .map-wrap { height: 260px !important; }

      /* CTA */
      .cta-inner { padding: 44px 18px !important; }

      /* Tags del mapa: wrap sin desborde */
      .map-tags { flex-wrap: wrap !important; justify-content: center !important; }
      .map-tag  { font-size: 11px !important; padding: 6px 12px !important; }

      /* Recharts: evita overflow interno */
      .recharts-wrapper { overflow: hidden !important; }
    }

    @media (max-width: 400px) {
      .hero-title { font-size: 46px !important; }
      .sim-results-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

/* ─── TOOLTIP ───────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(26,24,20,0.95)",
        border: "1px solid var(--gold)",
        borderRadius: 12, padding: "10px 16px",
        fontFamily: "'Jost', sans-serif",
        fontSize: 13, color: "#fff", maxWidth: 160
      }}>
        <p style={{ color: "var(--gold)", marginBottom: 4 }}>{label}</p>
        <p>USD <strong>{payload[0].value.toLocaleString()}</strong></p>
      </div>
    )
  }
  return null
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const Proyectos = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const [activeRender, setActiveRender] = useState(0)
  const [investment, setInvestment] = useState(300000)
  const [years, setYears] = useState(5)
  const carouselRef = useRef<HTMLDivElement>(null)

  const whatsappLink = "https://wa.me/5493515052474"

  const renders = [
    "https://imgur.com/2IaGZZB.jpg",
    "https://imgur.com/bPeK5g9.jpg",
    "https://imgur.com/CcbDbEO.jpg"
  ]

  const latitude  = -31.509285
  const longitude = -64.179648

  /* Parallax */
  const { scrollY } = useScroll()
  const heroY       = useTransform(scrollY, [0, 400], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  /* Investment */
  const RATE     = 0.08
  const minInv   = 100000
  const maxInv   = 500000
  const rangeVal = ((investment - minInv) / (maxInv - minInv)) * 100

  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    año:   i === 0 ? "Hoy" : `Año ${i}`,
    valor: Math.round(investment * Math.pow(1 + RATE, i))
  }))
  const finalValue = chartData[chartData.length - 1].valor
  const gain       = finalValue - investment

  /* Carousel */
  const scrollTo = (idx: number) => {
    setActiveRender(idx)
    const el = carouselRef.current
    if (!el) return
    const slide = el.children[idx] as HTMLElement
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }
  const nextRender = () => scrollTo((activeRender + 1) % renders.length)
  const prevRender = () => scrollTo((activeRender - 1 + renders.length) % renders.length)

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveRender(idx)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  /* Stats inView */
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const fadeUp = {
    hidden:  { opacity: 0, y: 32 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
    })
  }

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div
      className="font-body page-root"
      style={{
        background: "var(--cream)",
        color: "var(--dark)",
        overflowX: "hidden",
        width: "100%",
        position: "relative"
      }}
    >
      <FontStyle />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        overflow: "hidden", paddingTop: 72
      }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://i.imgur.com/LvxkY54.jpg')",
            backgroundSize: "cover", backgroundPosition: "center"
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(26,24,20,0.78) 0%, rgba(26,24,20,0.4) 60%, transparent 100%)"
          }} />
        </motion.div>

        <motion.div
          className="hero-text-wrap"
          style={{
            opacity: heroOpacity, position: "relative", zIndex: 2,
            maxWidth: 760, padding: "0 48px", width: "100%"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="hero-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,169,110,0.15)", border: "1px solid var(--gold)",
              borderRadius: 40, padding: "6px 16px", marginBottom: 28,
              color: "var(--gold-light)", fontSize: 12,
              letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap"
            }}
          >
            <Star size={10} fill="currentColor" /> Desarrollo premium · Córdoba
          </motion.div>

          <motion.h1
            className="font-display hero-title"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{ fontSize: "clamp(64px,8vw,112px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, marginBottom: 24 }}
          >
            La<br /><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>Feliza</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}
          >
            Un desarrollo inmobiliario de alta gama pensado para quienes buscan combinar calidad de vida, naturaleza y una inversión con proyección real.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <a href={whatsappLink} target="_blank" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "var(--gold)", color: "#fff",
              padding: "16px 32px", borderRadius: 50,
              fontSize: 14, fontWeight: 500, letterSpacing: "0.06em",
              textDecoration: "none", transition: "all 0.25s",
              boxShadow: "0 8px 32px rgba(201,169,110,0.4)", whiteSpace: "nowrap"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,169,110,0.55)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,169,110,0.4)" }}
            >
              Hablar con un asesor <ArrowRight size={16} />
            </a>
            <a href="#simulador" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "16px 32px", borderRadius: 50,
              fontSize: 14, fontWeight: 400, letterSpacing: "0.06em",
              textDecoration: "none", transition: "all 0.25s",
              backdropFilter: "blur(8px)", whiteSpace: "nowrap"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
            >
              Simular inversión
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{
            position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.15em", zIndex: 2
          }}
        >
          <span style={{ textTransform: "uppercase" }}>Explorar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          INFO CARDS
      ══════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              El proyecto
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
              Un desarrollo pensado<br /><em>para el futuro</em>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="gold-divider" style={{ marginTop: 24 }} />
          </motion.div>

          <div className="info-cards-grid">
            {[
              { icon: <MapPin size={20} />, title: "Ubicación privilegiada", text: "Zona sur de Córdoba con acceso directo desde Camino a San Carlos." },
              { icon: <Sun size={20} />, title: "Lotes amplios", text: "Desde 700 m² hasta más de 1.700 m² con privacidad y vistas abiertas." },
              { icon: <ShieldCheck size={20} />, title: "Infraestructura completa", text: "Calles adoquinadas, iluminación y servicios subterráneos." },
              { icon: <TreePine size={20} />, title: "Masterplan verde", text: "Plaza central, SUM, espacios verdes y sector housing." }
            ].map((item, i) => (
              <motion.div
                key={i} custom={i} initial="hidden" whileInView="visible"
                viewport={{ once: true }} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}
                style={{
                  background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "32px 24px", transition: "box-shadow 0.3s"
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(201,169,110,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--gold)", marginBottom: 20
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINANCIACIÓN PROPIA
      ══════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        {/* Decorative glow */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            style={{ marginBottom: 72 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }} className="financ-header-grid">
              <style>{`
                @media (min-width: 769px) {
                  .financ-header-grid { grid-template-columns: 1fr 1fr !important; gap: 64px !important; align-items: end !important; }
                }
              `}</style>

              <div>
                <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
                  Financiación propia
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                  Invertí sin necesitar<br /><em style={{ color: "var(--gold-light)" }}>un banco</em>
                </motion.h2>
                <motion.div variants={fadeUp} custom={2} style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, var(--gold), transparent)", marginBottom: 24 }} />
                <motion.p variants={fadeUp} custom={3} style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, maxWidth: 440 }}>
                  Contamos con planes de financiación directa, sin intermediarios bancarios. Cuotas accesibles en pesos o dólares, adaptadas a tu capacidad de pago. Comprás tu lote hoy y empezás a construir tu patrimonio de inmediato.
                </motion.p>
              </div>

              {/* Big number accent */}
              <motion.div
                variants={fadeUp} custom={2}
                style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 32 }}
              >
                <div style={{ borderLeft: "1px solid rgba(201,169,110,0.25)", paddingLeft: 32 }}>
                  <div className="font-display" style={{ fontSize: "clamp(52px,7vw,88px)", fontWeight: 300, color: "var(--gold)", lineHeight: 0.9 }}>
                    0%
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 10 }}>
                    Interés para las primeras cuotas
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              {
                icon: <DollarSign size={20} />,
                title: "Sin banco",
                desc: "Financiación 100% propia. Sin calificación crediticia ni papelerío bancario."
              },
              {
                icon: <CalendarDays size={20} />,
                title: "Plazos flexibles",
                desc: "Hasta 60 cuotas. Adaptamos el plan a tu situación financiera real."
              },
              {
                icon: <Percent size={20} />,
                title: "Cuotas accesibles",
                desc: "Pagás en pesos o dólares. Siempre con condiciones claras y sin sorpresas."
              },
              {
                icon: <BadgeCheck size={20} />,
                title: "Escritura garantizada",
                desc: "Desde la firma del boleto, el lote es tuyo. Escritura al completar el pago."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,169,110,0.15)",
                  borderRadius: 16,
                  padding: "28px 24px",
                  transition: "border-color 0.3s, background 0.3s"
                }}
                whileHover={{ borderColor: "rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)" } as any}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: "rgba(201,169,110,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--gold)", marginBottom: 16
                }}>
                  {item.icon}
                </div>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 8, letterSpacing: "0.02em" }}>
                  {item.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              marginTop: 48,
              padding: "28px 32px",
              borderRadius: 14,
              border: "1px solid rgba(201,169,110,0.2)",
              background: "rgba(201,169,110,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap"
            }}
          >
            <div>
              <p style={{ color: "#fff", fontSize: "clamp(14px,2vw,16px)", fontWeight: 500, marginBottom: 4 }}>
                ¿Querés conocer tu plan de cuotas?
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                Un asesor te arma una propuesta personalizada sin compromiso.
              </p>
            </div>
            <a
              href={whatsappLink} target="_blank"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--gold)", color: "#fff",
                padding: "14px 28px", borderRadius: 50,
                fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
                textDecoration: "none", transition: "all 0.25s",
                boxShadow: "0 6px 24px rgba(201,169,110,0.35)",
                whiteSpace: "nowrap", flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(201,169,110,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.35)" }}
            >
              Consultar financiación <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS BAND
      ══════════════════════════════════ */}
      <section
        ref={statsRef}
        className="section-pad"
        style={{ padding: "80px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 60%)"
        }} />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <div className="stats-grid">
            {[
              { n: 42,  suffix: "",    label: "Lotes disponibles" },
              { n: 8,    suffix: "%",   label: "ROI anual estimado" },
              { n: 10,    suffix: "min", label: "Del centro" },
              { n: 2026, suffix: "",    label: "Año de lanzamiento" }
            ].map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="font-display" style={{ fontSize: "clamp(36px,4vw,64px)", fontWeight: 300, color: "var(--gold-light)", lineHeight: 1 }}>
                  {statsInView && <CountUp end={s.n} duration={2} />}{s.suffix}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MAPA
      ══════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              Ubicación
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>
              Encontranos en <em>Córdoba</em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}
          >
            <div className="map-wrap" style={{ height: 480 }}>
              <Map
                mapboxAccessToken={mapboxToken}
                initialViewState={{ longitude, latitude, zoom: 15 }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                style={{ width: "100%", height: "100%" }}
              >
                <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{
                      background: "var(--gold)", color: "#fff",
                      padding: "8px 16px", borderRadius: 40,
                      fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                      boxShadow: "0 8px 24px rgba(201,169,110,0.5)",
                      fontFamily: "'Jost', sans-serif", letterSpacing: "0.04em"
                    }}>
                      La Feliza
                    </div>
                    <div style={{ width: 2, height: 12, background: "var(--gold)" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
                  </motion.div>
                </Marker>
              </Map>
            </div>
          </motion.div>

          <div className="map-tags" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <MapPin size={13} />, text: "Camino a San Carlos, Córdoba" },
              { icon: <Waves size={13} />, text: "A 5 min del centro" },
              { icon: <TreePine size={13} />, text: "Zona de alto crecimiento" }
            ].map((tag, i) => (
              <span key={i} className="map-tag" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(201,169,110,0.1)", border: "1px solid var(--border)",
                borderRadius: 40, padding: "8px 14px",
                fontSize: 12, color: "var(--gold-dark)", fontWeight: 500, whiteSpace: "nowrap"
              }}>
                {tag.icon} {tag.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          VISUALIZACIÓN
      ══════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              Renders
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>
              Visualización del <em>proyecto</em>
            </motion.h2>
          </motion.div>

          {/* DESKTOP */}
          <div className="desktop-carousel">
            <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
              <button
                onClick={prevRender}
                style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
                  background: "#fff", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.2s", color: "var(--dark)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--gold)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.borderColor = "var(--border)" }}
              ><ChevronLeft size={20} /></button>

              <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1, overflow: "hidden", minWidth: 0 }}>
                {renders.map((src, i) => {
                  const isActive = i === activeRender
                  return (
                    <motion.div
                      key={i}
                      onClick={() => setActiveRender(i)}
                      animate={{ flex: isActive ? 3 : 1, opacity: isActive ? 1 : 0.55, scale: isActive ? 1 : 0.95 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        overflow: "hidden", borderRadius: 20, cursor: "pointer",
                        border: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                        boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.2)" : "0 8px 20px rgba(0,0,0,0.08)",
                        transition: "border 0.3s, box-shadow 0.3s", minWidth: 0
                      }}
                    >
                      <img src={src} style={{
                        width: "100%",
                        aspectRatio: isActive ? "16/9" : "4/5",
                        objectFit: "cover", display: "block",
                        transition: "aspect-ratio 0.5s"
                      }} />
                    </motion.div>
                  )
                })}
              </div>

              <button
                onClick={nextRender}
                style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: "50%",
                  background: "#fff", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.2s", color: "var(--dark)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--gold)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--dark)"; e.currentTarget.style.borderColor = "var(--border)" }}
              ><ChevronRight size={20} /></button>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
              {renders.map((_, i) => (
                <button key={i} onClick={() => setActiveRender(i)} style={{
                  width: i === activeRender ? 28 : 8, height: 8, borderRadius: 4,
                  background: i === activeRender ? "var(--gold)" : "rgba(201,169,110,0.25)",
                  border: "none", cursor: "pointer", transition: "all 0.3s"
                }} />
              ))}
            </div>
          </div>

          {/* MOBILE */}
          <div className="mobile-carousel" style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, zIndex: 2, background: "linear-gradient(to right, rgba(255,255,255,0.95), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, zIndex: 2, background: "linear-gradient(to left, rgba(255,255,255,0.95), transparent)", pointerEvents: "none" }} />

            <div ref={carouselRef} className="carousel-track" style={{ gap: 10, padding: "8px 20px" }}>
              {renders.map((src, i) => {
                const isActive = i === activeRender
                return (
                  <div
                    key={i}
                    className="carousel-slide"
                    style={{ width: "78vw", maxWidth: "78vw" }}
                  >
                    <motion.img
                      src={src}
                      animate={{ scale: isActive ? 1 : 0.88, opacity: isActive ? 1 : 0.55 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        width: "100%", aspectRatio: "4/3", objectFit: "cover",
                        borderRadius: 16, display: "block",
                        boxShadow: isActive ? "0 20px 50px rgba(0,0,0,0.18)" : "0 8px 20px rgba(0,0,0,0.08)",
                        border: isActive ? "2px solid var(--gold)" : "2px solid transparent"
                      }}
                    />
                  </div>
                )
              })}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
              {renders.map((_, i) => (
                <div key={i} style={{
                  width: i === activeRender ? 24 : 7, height: 7, borderRadius: 4,
                  background: i === activeRender ? "var(--gold)" : "rgba(201,169,110,0.3)",
                  transition: "all 0.3s"
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SIMULADOR
      ══════════════════════════════════ */}
      <section id="simulador" className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              Calculadora
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>
              Simulador de <em>inversión</em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="sim-box"
            style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: 28, padding: "48px 40px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.07)", width: "100%"
            }}
          >
            {/* Controls */}
            <div className="sim-controls-grid">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Capital inicial</span>
                  <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>
                    USD {investment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range" min={minInv} max={maxInv} step={5000} value={investment}
                  onChange={e => setInvestment(Number(e.target.value))}
                  className="premium-range"
                  style={{ "--val": `${rangeVal}%` } as React.CSSProperties}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                  <span>USD 100K</span><span>USD 500K</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Horizonte</span>
                  <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>
                    {years} {years === 1 ? "año" : "años"}
                  </span>
                </div>
                <input
                  type="range" min={1} max={10} step={1} value={years}
                  onChange={e => setYears(Number(e.target.value))}
                  className="premium-range"
                  style={{ "--val": `${((years - 1) / 9) * 100}%` } as React.CSSProperties}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                  <span>1 año</span><span>10 años</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div
              className="sim-results-grid"
              style={{ background: "rgba(201,169,110,0.06)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 40 }}
            >
              {[
                { label: "Inversión inicial",     value: `USD ${investment.toLocaleString()}`,  color: "var(--dark)" },
                { label: "Ganancia estimada",     value: `+USD ${gain.toLocaleString()}`,        color: "#16a34a" },
                { label: `Valor en ${years} años`, value: `USD ${finalValue.toLocaleString()}`,  color: "var(--gold-dark)" }
              ].map((r, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{r.label}</div>
                  <div className="font-display" style={{ fontSize: "clamp(14px,3vw,20px)", fontWeight: 600, color: r.color, wordBreak: "break-word" }}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ width: "100%", overflow: "hidden" }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="año" tick={{ fontSize: 10, fontFamily: "'Jost', sans-serif", fill: "var(--muted)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fontFamily: "'Jost', sans-serif", fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="valor" stroke="var(--gold)" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ fill: "var(--gold)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "var(--gold)", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 16, letterSpacing: "0.05em" }}>
              * Proyección basada en una tasa de valorización anual estimada del 8%. No constituye asesoramiento financiero.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          EXPERIENCIA GUIADA
      ══════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 60%)" }} />
        <div className="section-inner" style={{ maxWidth: 900, position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
            Por qué elegirnos
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 60 }}>
            La experiencia<br /><em style={{ color: "var(--gold-light)" }}>La Feliza</em>
          </motion.h2>

          <div style={{ display: "grid", gap: 2 }}>
            {[
              { num: "01", title: "Asesoramiento personalizado", desc: "Un equipo dedicado te guía desde la consulta inicial hasta la escritura. Sin presiones, con información transparente." },
              { num: "02", title: "Financiamiento a medida", desc: "Planes de pago adaptados a tu situación. Cuotas en pesos o dólares, con condiciones pensadas para que la inversión sea accesible." },
              { num: "03", title: "Entrega con infraestructura", desc: "Los lotes se entregan con todos los servicios instalados. Podés construir desde el primer día sin sorpresas." },
              { num: "04", title: "Comunidad en crecimiento", desc: "Un barrio que nace con visión de largo plazo, con espacios comunes, seguridad y estética cuidada en cada detalle." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="exp-row"
                style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <span className="font-display exp-num" style={{ fontWeight: 300, color: "rgba(201,169,110,0.3)", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>
                  {item.num}
                </span>
                <div style={{ textAlign: "left", minWidth: 0 }}>
                  <h3 style={{ color: "#fff", fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.02em" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px,2vw,14px)", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA FINAL
      ══════════════════════════════════ */}
      <section style={{ background: "#1f1f1f", padding: "100px 0 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ borderRadius: 28, overflow: "hidden", position: "relative", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,24,20,0.80), rgba(26,24,20,0.55))" }} />
            <div className="cta-inner" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 32px", width: "100%" }}>
              <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Tu próximo paso</p>
              <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 20 }}>
                Invertí en<br /><em style={{ color: "var(--gold-light)" }}>La Feliza</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(14px,2vw,16px)", maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.7 }}>
                Una oportunidad única para participar en uno de los desarrollos con mayor proyección de Córdoba.
              </p>
              <a
                href={whatsappLink} target="_blank"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "var(--gold)", color: "#fff",
                  padding: "18px 40px", borderRadius: 50,
                  fontSize: 14, fontWeight: 500, letterSpacing: "0.07em",
                  textDecoration: "none", transition: "all 0.25s",
                  boxShadow: "0 8px 40px rgba(201,169,110,0.45)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(201,169,110,0.55)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 40px rgba(201,169,110,0.45)" }}
              >
                Contactar un asesor <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
        {/* Spacer oscuro que une con el footer */}
        <div style={{ height: 64, background: "#1f1f1f" }} />
      </section>

    </div>
  )
}

export default Proyectos